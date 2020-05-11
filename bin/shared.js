"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
function getPackageManagerFromAngularCLI() {
    // If you have Angular CLI installed, read Angular CLI config.
    // If it isn't installed, default to 'yarn'.
    try {
        return child_process_1.execSync('ng config -g cli.packageManager', {
            stdio: ['ignore', 'pipe', 'ignore'],
            timeout: 500,
        })
            .toString()
            .trim();
    }
    catch (e) {
        return 'yarn';
    }
}
function determinePackageManager() {
    var packageManager = getPackageManagerFromAngularCLI();
    if (packageManager === 'npm' || isPackageManagerInstalled(packageManager)) {
        return packageManager;
    }
    if (isPackageManagerInstalled('yarn')) {
        return 'yarn';
    }
    if (isPackageManagerInstalled('pnpm')) {
        return 'pnpm';
    }
    return 'npm';
}
exports.determinePackageManager = determinePackageManager;
function isPackageManagerInstalled(packageManager) {
    var isInstalled = false;
    try {
        child_process_1.execSync(packageManager + " --version", {
            stdio: ['ignore', 'ignore', 'ignore'],
        });
        isInstalled = true;
    }
    catch (e) {
        /* do nothing */
    }
    return isInstalled;
}
