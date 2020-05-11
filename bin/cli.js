#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var figlet = __importStar(require("figlet"));
var child_process_1 = require("child_process");
var yargs_parser_1 = __importDefault(require("yargs-parser"));
var help_1 = require("./lib/help");
var preset_1 = require("./lib/preset");
var create_workspace_1 = require("./lib/create-workspace");
console.log(chalk_1.default.yellow(figlet.textSync('m2stack Command tool', { horizontalLayout: 'full' })));
var parsedArgs = yargs_parser_1.default(process.argv, {
    string: ['cli', 'preset', 'appName', 'style'],
    alias: {
        appName: 'app-name',
    },
    boolean: ['help', 'interactive'],
});
if (parsedArgs.help) {
    help_1.showHelp(preset_1.Preset);
    process.exit(0);
}
create_workspace_1.determineWorkspaceName(parsedArgs).then(function (name) {
    create_workspace_1.determinePreset(parsedArgs).then(function (preset) {
        create_workspace_1.determineAppName(preset, parsedArgs).then(function (appName) {
            create_workspace_1.determineStyle(preset, parsedArgs).then(function (style) {
                var command = "npx create-nx-workspace@latest " + name + " --preset=" + preset + " --appName=" + appName + " --style=" + style + " --interactive=true";
                child_process_1.execSync(command, {
                    cwd: process.cwd(),
                    stdio: [0, 1, 2]
                });
            });
        });
    });
});
