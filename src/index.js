#!/usr/bin/env node

import { select, input } from '@inquirer/prompts';
import showHeader from './utils/header.js';
import { saveDataToJsonFile, loadDataFromJsonFile, doesConfigFileExist } from './utils/config.js';
import getCurrentOtpAndTimeRemaining from './utils/otp.js';
import chalk from 'chalk';

// Cache for configuration data
let configCache = null;
let lastConfigLoad = 0;
const CONFIG_CACHE_TTL = 5000; // 5 seconds TTL

// Performance optimization: Memoize OTP calculation
const otpCache = new Map();
const OTP_CACHE_TTL = 500; // 500ms TTL

async function loadConfigWithCache() {
    const now = Date.now();
    if (configCache && (now - lastConfigLoad) < CONFIG_CACHE_TTL) {
        return configCache;
    }
    
    if (doesConfigFileExist('.crotpConfig', 'config.json')) {
        configCache = await loadDataFromJsonFile('.crotpConfig', 'config.json');
        lastConfigLoad = now;
        return configCache;
    }
    return [];
}

async function getMenuChoices() {
    const secrets = await loadConfigWithCache();
    return [
        {
            name: '🔐 Show all OTPs',
            value: 'show',
            disabled: !secrets.length,
            description: !secrets.length ? 'No secrets configured' : null
        },
        {
            name: '➕ Add OTP Secret',
            value: 'add'
        },
        {
            name: '❌ Remove OTP Secret',
            value: 'remove',
            disabled: !secrets.length
        }
    ];
}

function getOtpWithCache(key) {
    const now = Date.now();
    const currentPeriod = Math.floor(now / 30000);
    const cacheKey = `${key}-${currentPeriod}`;
    
    if (!otpCache.has(cacheKey)) {
        const result = getCurrentOtpAndTimeRemaining(key);
        otpCache.set(cacheKey, result);
        
        // Cleanup old cache entries
        for (const [oldKey] of otpCache) {
            if (oldKey.startsWith(`${key}-`) && oldKey !== cacheKey) {
                otpCache.delete(oldKey);
            }
        }
    }
    
    // Always update timeRemaining even for cached entries
    const cached = otpCache.get(cacheKey);
    const currentTime = Math.floor(Date.now() / 1000);
    const remaining = 30 - (currentTime % 30);
    
    return {
        ...cached,
        timeRemaining: remaining
    };
}

class OtpDisplay {
    constructor(secrets) {
        this.secrets = secrets;
        this.isRunning = true;
        this.intervalId = null;
        this.boundHandleKeyPress = this.handleKeyPress.bind(this);
    }

    display() {
        console.clear();
        console.log(chalk.cyan('Current OTPs:\n'));
        
        this.secrets.forEach(({ name, key }) => {
            const { currentOtp, timeRemaining } = getOtpWithCache(key);
            // Ensure timeRemaining is always between 0 and 30
            const safeTimeRemaining = Math.max(0, Math.min(30, timeRemaining));
            const timerBar = '█'.repeat(safeTimeRemaining) + '░'.repeat(30 - safeTimeRemaining);
            console.log(`${chalk.green(name)}`);
            console.log(`OTP: ${chalk.yellow(currentOtp)}`);
            console.log(`Time: ${chalk.blue(timerBar)} ${safeTimeRemaining}s\n`);
        });
        console.log(chalk.gray('Press [q] to return to main menu...'));
    }

    handleKeyPress(key) {
        if ((key[0] === 113 || key.toString().toLowerCase() === 'q') && this.isRunning) {
            this.cleanup();
        }
        if (key[0] === 3) {
            this.cleanup();
            process.exit(0);
        }
    }

    cleanup() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        process.stdin.removeListener('data', this.boundHandleKeyPress);
        process.stdin.setRawMode(false);
        process.stdin.pause();
        console.clear();
        process.nextTick(() => main());
    }

    start() {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', this.boundHandleKeyPress);

        // Initial display
        this.display();
        
        // Update more frequently for smoother countdown
        this.intervalId = setInterval(() => {
            if (this.isRunning) {
                this.display();
            }
        }, 500); // Update every 500ms for smoother display
    }
}

async function showAllOtps() {
    const secrets = await loadConfigWithCache();
    const display = new OtpDisplay(secrets);
    display.start();
}

async function addOtpSecret() {
    try {
        const name = await input({ message: '📝 Enter name for this OTP:' });
        const key = await input({ message: '🔑 Enter the OTP secret key:' });
        
        const config = await loadConfigWithCache();
        config.push({ name, key });
        await saveDataToJsonFile('.crotpConfig', 'config.json', config);
        configCache = config; // Update cache
        
        console.log(chalk.green('\nOTP secret added successfully! returning to main menu...'));
        await new Promise(resolve => setTimeout(resolve, 1000));
        return main();
    } catch (error) {
        console.error('Error:', error.message);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return main();
    }
}

async function removeOtpSecret() {
    try {
        const config = await loadConfigWithCache();
        const secretToRemove = await select({
            message: 'Select OTP secret to remove:',
            choices: config.map(({ name }) => ({ name, value: name }))
        });

        const updatedConfig = config.filter(secret => secret.name !== secretToRemove);
        await saveDataToJsonFile('.crotpConfig', 'config.json', updatedConfig);
        configCache = updatedConfig; // Update cache
        
        console.log(chalk.green('\nOTP secret removed successfully! returning to main menu...'));
        await new Promise(resolve => setTimeout(resolve, 1000));
        return main();
    } catch (error) {
        console.error('Error:', error.message);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return main();
    }
}

async function main() {
    try {
        console.clear();
        await showHeader();

        const action = await select({
            message: 'Select an action:',
            choices: await getMenuChoices()
        });

        switch (action) {
            case 'show': return showAllOtps();
            case 'add': return addOtpSecret();
            case 'remove': return removeOtpSecret();
        }
    } catch (error) {
        console.error('Error:', error.message);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return main();
    }
}

// Start the application
main().catch(console.error);
