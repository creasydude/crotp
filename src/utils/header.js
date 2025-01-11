import chalk from "chalk";
import chalkAnimation from "chalk-animation";

const text = `

 ██████╗██████╗      ██████╗ ████████╗██████╗ 
██╔════╝██╔══██╗    ██╔═══██╗╚══██╔══╝██╔══██╗
██║     ██████╔╝    ██║   ██║   ██║   ██████╔╝
██║     ██╔══██╗    ██║   ██║   ██║   ██╔═══╝ 
╚██████╗██║  ██║    ╚██████╔╝   ██║   ██║     
 ╚═════╝╚═╝  ╚═╝     ╚═════╝    ╚═╝   ╚═╝     

 By CreasY
`;


export default async function showHeader() {
    process.stdout.write("\x1Bc");
    const animation = chalkAnimation.glitch(text);
    // Wait for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 1350));
    animation.stop(); // Stop the animation
    console.log(chalk.green("\nScript is starting...\n"));
    process.stdout.write("\x1Bc");
    console.log(chalk.bgWhite(chalk.black(" CR OTP - Secure CLI Tool for Managing Your One-Time Password Secrets ")));
    console.log("\n");
}