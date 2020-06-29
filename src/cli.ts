#!/usr/bin/env node
import chalk from 'chalk';
import * as figlet from 'figlet';
import { execSync } from 'child_process';
import yargsParser from 'yargs-parser';
import { showHelp } from './lib/help'
import {Preset} from './lib/preset';
import {determineAppName, determineCli, determinePreset, determineStyle, determineWorkspaceName} from './lib/create-workspace';

console.log(
    chalk.yellow(
        figlet.textSync('Command tool', { horizontalLayout: 'full'})
    )
);

const parsedArgs = yargsParser(process.argv, {
    string: ['cli', 'preset', 'appName', 'style'],
    alias: {
        appName: 'app-name',
    },
    boolean: ['help', 'interactive'],
});


if (parsedArgs.help) {
    showHelp(Preset);
    process.exit(0);
}

determineWorkspaceName(parsedArgs).then(name => {
    determinePreset(parsedArgs).then(preset => {
        determineAppName(preset, parsedArgs).then(appName => {
            determineStyle(preset, parsedArgs).then(style => {
                const command = `npx create-nx-workspace@latest ${name} --preset=${preset} --appName=${appName} --style=${style} --interactive=true`;
                execSync(
                    command, {
                        cwd: process.cwd(),
                        stdio: [0, 1, 2]
                    }
                )
            })
        })
    })
})
