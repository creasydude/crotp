## 🔐 CROTP

**Secure CLI Tool for Managing Your One-Time Password Secrets**

## 🌟 Overview

CROTP is a powerful command-line interface tool for managing and generating Time-based One-Time Passwords (TOTP). It provides a secure and efficient way to store and access your 2FA secrets with a user-friendly interface.

## ✨ Features

- **Secure OTP Management**
- **Real-time TOTP Generation**
- **Visual Countdown Timer**
- **Easy Secret Management**
- **Cached Performance**
- **Cross-Platform Support**

## 🚀 Installation

### One-Time Run

```bash
npx crotp
```

### Global Installation (Requires Node.js)

```bash
npm install -g crotp
```

Then run:

```bash
crotp
```

[![npm version](https://badge.fury.io/js/crotp.svg)](https://badge.fury.io/js/crotp)

## ⚙️ Config Location

Your OTP secrets are securely stored in:

```
/<username>/.crotpConfig/config.json
```

## 📝 Usage Guide

### Adding New OTP Secret

1. Select "Add OTP Secret" from the menu
2. Enter a name for the secret
3. Input the OTP secret key (base32 format)

### Viewing OTP Codes

1. Select "Show all OTPs" from the menu
2. View real-time OTP codes with countdown timers
3. Press 'q' to return to main menu

### Removing OTP Secret

1. Select "Remove OTP Secret" from the menu
2. Choose the secret you want to remove
3. Confirm deletion

## 😊 DEMO

<img src="https://github.com/creasydude/crotp/blob/master/demo.gif?raw=true" width="100%">

## 🔒 Security

- Secrets are stored locally on your machine
- No external API calls or data transmission
- Compatible with Google Authenticator and other TOTP apps

## 💻 Technical Details

- Built with Node.js
- Uses TOTP standard (RFC 6238)
- 30-second time step
- SHA-1 hashing algorithm
- 6-digit OTP codes

## 💰 Support the Project

Help continue the development of CROTP:

### Cryptocurrency Donations

- **EVM**: `0x54Daf8377f714dbF6aB874A9A4A12716385033c1`
- **SOLANA**: `FjhaNZxuKbPh9Ms5YnrYkawM54grGpudSmNeRVFwA51P`
- **TON**: `UQClozQ06Qoh--yXV4VZPl2jRx94tdnre2FGHxU-YrdxJbDM`

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 🔧 Dependencies

- @inquirer/prompts
- chalk
- chalk-animation
- speakeasy

## 🐛 Bug Reports

Found a bug? Please open an issue on GitHub with:

1. Your OS version
2. Node.js version
3. Steps to reproduce
4. Expected vs actual behavior

## ✨ Acknowledgments

- speakeasy for TOTP implementation
- inquirer for the interactive CLI
- The open-source community
