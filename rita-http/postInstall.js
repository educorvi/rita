const fs = require("fs")
const {exec} = require('child_process');

/**
 * This file is executed after npm install and performs post installation steps if necessary
 */


/**
 * Execute a shell command and return a promise, that resolves when the command succeeds
 * @param cmd
 * @returns {Promise<unknown>}
 */
function promisingExec(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                console.error(stderr);
                reject(error);
            }
            resolve(stdout);
        })
    });
}

(async () => {
    let errors = 0;

    // Generate Routes with tsoa
    if (fs.existsSync("tsoa.json")) {
        console.log(" Generating routes...");
        try {
            await promisingExec("npm run generate-routes");
            console.log("\x1b[32m \u2713 \x1b[0m Generated routes");
        } catch (e) {
            console.error("\n\u274C Route generation failed")
            errors++;
        }
    } else {
        console.warn("Skipped route generation");
    }
    console.log();
})();
