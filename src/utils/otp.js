import speakeasy from "speakeasy";

export default function getCurrentOtpAndTimeRemaining(secret) {
    // Get current UNIX timestamp in seconds
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Calculate the start of the current 30-second period
    const timeStep = 30;
    const currentPeriod = Math.floor(currentTime / timeStep);
    
    const token = speakeasy.totp({
        secret: secret,
        encoding: 'base32',
        step: timeStep,
        time: currentTime
    });

    // Calculate exact remaining seconds
    const remaining = timeStep - (currentTime % timeStep);

    return {
        currentOtp: token,
        timeRemaining: remaining,
        periodStart: currentPeriod * timeStep
    };
}