"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var inquirer_1 = __importDefault(require("inquirer"));
var output_1 = require("./output");
var preset_1 = require("./preset");
var cliVersion = 'NX_VERSION';
var angularCliVersion = 'ANGULAR_CLI_VERSION';
var presetOptions = [
    {
        value: preset_1.Preset.Empty,
        name: 'empty             [an empty workspace]',
    },
    {
        value: 'web-components',
        name: 'web components    [a workspace with a single app built using web components]',
    },
    {
        value: preset_1.Preset.Angular,
        name: 'angular           [a workspace with a single Angular application]',
    },
    {
        value: preset_1.Preset.AngularWithNest,
        name: 'angular-nest      [a workspace with a full stack application (Angular + Nest)]',
    },
    {
        value: preset_1.Preset.React,
        name: 'react             [a workspace with a single React application]',
    },
    {
        value: preset_1.Preset.ReactWithExpress,
        name: 'react-express     [a workspace with a full stack application (React + Express)]',
    },
    {
        value: preset_1.Preset.NextJs,
        name: 'next.js           [a workspace with a single Next.js application]',
    },
];
function determineWorkspaceName(parsedArgs) {
    var workspace = parsedArgs._[2];
    if (workspace) {
        return Promise.resolve(workspace);
    }
    return inquirer_1.default
        .prompt([
        {
            name: 'WorkspaceName',
            message: "Workspace name (e.g., org name)    ",
            type: 'string',
        },
    ])
        .then(function (a) {
        if (!a.WorkspaceName) {
            output_1.output.error({
                title: 'Invalid workspace name',
                bodyLines: ["Workspace name cannot be empty"],
            });
            process.exit(1);
        }
        return a.WorkspaceName;
    });
}
exports.determineWorkspaceName = determineWorkspaceName;
function determinePreset(parsedArgs) {
    if (parsedArgs.preset) {
        if (Object.values(preset_1.Preset).indexOf(parsedArgs.preset) === -1) {
            output_1.output.error({
                title: 'Invalid preset',
                bodyLines: __spreadArrays([
                    "It must be one of the following:",
                    ''
                ], Object.values(preset_1.Preset)),
            });
            process.exit(1);
        }
        else {
            return Promise.resolve(parsedArgs.preset);
        }
    }
    return inquirer_1.default
        .prompt([
        {
            name: 'Preset',
            message: "What to create in the new workspace",
            default: 'empty',
            type: 'list',
            choices: presetOptions,
        },
    ])
        .then(function (a) { return a.Preset; });
}
exports.determinePreset = determinePreset;
function determineAppName(preset, parsedArgs) {
    if (preset === preset_1.Preset.Empty) {
        return Promise.resolve('');
    }
    if (parsedArgs.appName) {
        return Promise.resolve(parsedArgs.appName);
    }
    return inquirer_1.default
        .prompt([
        {
            name: 'AppName',
            message: "Application name                   ",
            type: 'string',
        },
    ])
        .then(function (a) {
        if (!a.AppName) {
            output_1.output.error({
                title: 'Invalid name',
                bodyLines: ["Name cannot be empty"],
            });
            process.exit(1);
        }
        return a.AppName;
    });
}
exports.determineAppName = determineAppName;
function determineStyle(preset, parsedArgs) {
    if (preset === preset_1.Preset.Empty) {
        return Promise.resolve(null);
    }
    var choices = [
        {
            value: 'css',
            name: 'CSS',
        },
        {
            value: 'scss',
            name: 'SASS(.scss)  [ http://sass-lang.com   ]',
        },
        {
            value: 'styl',
            name: 'Stylus(.styl)[ http://stylus-lang.com ]',
        },
        {
            value: 'less',
            name: 'LESS         [ http://lesscss.org     ]',
        },
    ];
    if ([preset_1.Preset.ReactWithExpress, preset_1.Preset.React, preset_1.Preset.NextJs].includes(preset)) {
        choices.push({
            value: 'styled-components',
            name: 'styled-components [ https://styled-components.com ]',
        }, {
            value: '@emotion/styled',
            name: 'emotion           [ https://emotion.sh]',
        });
    }
    if (!parsedArgs.style) {
        return inquirer_1.default
            .prompt([
            {
                name: 'style',
                message: "Default stylesheet format          ",
                default: 'css',
                type: 'list',
                choices: choices,
            },
        ])
            .then(function (a) { return a.style; });
    }
    var foundStyle = choices.find(function (choice) { return choice.value === parsedArgs.style; });
    if (foundStyle === undefined) {
        output_1.output.error({
            title: 'Invalid style',
            bodyLines: __spreadArrays([
                "It must be one of the following:",
                ''
            ], choices.map(function (choice) { return choice.value; })),
        });
        process.exit(1);
    }
    return Promise.resolve(parsedArgs.style);
}
exports.determineStyle = determineStyle;
function determineCli(preset, parsedArgs) {
    var angular = {
        package: '@angular/cli',
        version: angularCliVersion,
        command: 'ng',
    };
    var nx = {
        package: '@nrwl/tao',
        version: cliVersion,
        command: 'tao',
    };
    if (parsedArgs.cli) {
        if (['nx', 'angular'].indexOf(parsedArgs.cli) === -1) {
            output_1.output.error({
                title: 'Invalid cli',
                bodyLines: ["It must be one of the following:", '', 'nx', 'angular'],
            });
            process.exit(1);
        }
        return Promise.resolve(parsedArgs.cli === 'angular' ? angular : nx);
    }
    switch (preset) {
        case preset_1.Preset.Angular:
        case preset_1.Preset.AngularWithNest: {
            return Promise.resolve(angular);
        }
        case preset_1.Preset.WebComponents:
        case preset_1.Preset.React:
        case preset_1.Preset.ReactWithExpress:
        case preset_1.Preset.NextJs: {
            return Promise.resolve(nx);
        }
        default: {
            return inquirer_1.default
                .prompt([
                {
                    name: 'CLI',
                    message: "CLI to power the Nx workspace      ",
                    default: 'nx',
                    type: 'list',
                    choices: [
                        {
                            value: 'nx',
                            name: 'Nx           [Extensible CLI for JavaScript and TypeScript applications]',
                        },
                        {
                            value: 'angular',
                            name: 'Angular CLI  [Extensible CLI for Angular applications. Recommended for Angular projects.]',
                        },
                    ],
                },
            ])
                .then(function (a) { return (a.CLI === 'angular' ? angular : nx); });
        }
    }
}
exports.determineCli = determineCli;
