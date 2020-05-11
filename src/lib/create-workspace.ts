import inquirer from 'inquirer';
import {output} from './output';
import {Preset} from './preset';

const cliVersion = 'NX_VERSION';
const angularCliVersion = 'ANGULAR_CLI_VERSION';

const presetOptions = [
    {
        value: Preset.Empty,
        name: 'empty             [an empty workspace]',
    },
    {
        value: 'web-components',
        name:
            'web components    [a workspace with a single app built using web components]',
    },
    {
        value: Preset.Angular,
        name: 'angular           [a workspace with a single Angular application]',
    },
    {
        value: Preset.AngularWithNest,
        name:
            'angular-nest      [a workspace with a full stack application (Angular + Nest)]',
    },
    {
        value: Preset.React,
        name: 'react             [a workspace with a single React application]',
    },
    {
        value: Preset.ReactWithExpress,
        name:
            'react-express     [a workspace with a full stack application (React + Express)]',
    },
    {
        value: Preset.NextJs,
        name: 'next.js           [a workspace with a single Next.js application]',
    },
];


export function determineWorkspaceName(parsedArgs: any): Promise<string> {
    const workspace = parsedArgs._[2];
    if (workspace) {
        return Promise.resolve(workspace)
    }

    return inquirer
        .prompt([
            {
                name: 'WorkspaceName',
                message: `Workspace name (e.g., org name)    `,
                type: 'string',
            },
        ])
        .then((a) => {
            if (!a.WorkspaceName) {
                output.error({
                    title: 'Invalid workspace name',
                    bodyLines: [`Workspace name cannot be empty`],
                });
                process.exit(1);
            }
            return a.WorkspaceName;
        });


}

export function determinePreset(parsedArgs: any): Promise<Preset> {
    if (parsedArgs.preset) {
        if (Object.values(Preset).indexOf(parsedArgs.preset) === -1) {
            output.error({
                title: 'Invalid preset',
                bodyLines: [
                    `It must be one of the following:`,
                    '',
                    ...Object.values(Preset),
                ],
            });
            process.exit(1);
        } else {
            return Promise.resolve(parsedArgs.preset);
        }
    }

    return inquirer
        .prompt([
            {
                name: 'Preset',
                message: `What to create in the new workspace`,
                default: 'empty',
                type: 'list',
                choices: presetOptions,
            },
        ])
        .then((a: { Preset: Preset }) => a.Preset);
}

export function determineAppName(preset: Preset, parsedArgs: any): Promise<string> {
    if (preset === Preset.Empty) {
        return Promise.resolve('');
    }

    if (parsedArgs.appName) {
        return Promise.resolve(parsedArgs.appName);
    }

    return inquirer
        .prompt([
            {
                name: 'AppName',
                message: `Application name                   `,
                type: 'string',
            },
        ])
        .then((a) => {
            if (!a.AppName) {
                output.error({
                    title: 'Invalid name',
                    bodyLines: [`Name cannot be empty`],
                });
                process.exit(1);
            }
            return a.AppName;
        });
}

export function determineStyle(preset: Preset, parsedArgs: any) {
    if (preset === Preset.Empty) {
        return Promise.resolve(null);
    }

    const choices = [
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

    if ([Preset.ReactWithExpress, Preset.React, Preset.NextJs].includes(preset)) {
        choices.push(
            {
                value: 'styled-components',
                name: 'styled-components [ https://styled-components.com ]',
            },
            {
                value: '@emotion/styled',
                name: 'emotion           [ https://emotion.sh]',
            }
        );
    }

    if (!parsedArgs.style) {
        return inquirer
            .prompt([
                {
                    name: 'style',
                    message: `Default stylesheet format          `,
                    default: 'css',
                    type: 'list',
                    choices,
                },
            ])
            .then((a) => a.style);
    }

    const foundStyle = choices.find(
        (choice) => choice.value === parsedArgs.style
    );

    if (foundStyle === undefined) {
        output.error({
            title: 'Invalid style',
            bodyLines: [
                `It must be one of the following:`,
                '',
                ...choices.map((choice) => choice.value),
            ],
        });

        process.exit(1);
    }

    return Promise.resolve(parsedArgs.style);
}

export function determineCli(preset: Preset, parsedArgs: any) {
    const angular = {
        package: '@angular/cli',
        version: angularCliVersion,
        command: 'ng',
    };

    const nx = {
        package: '@nrwl/tao',
        version: cliVersion,
        command: 'tao',
    };

    if (parsedArgs.cli) {
        if (['nx', 'angular'].indexOf(parsedArgs.cli) === -1) {
            output.error({
                title: 'Invalid cli',
                bodyLines: [`It must be one of the following:`, '', 'nx', 'angular'],
            });
            process.exit(1);
        }
        return Promise.resolve(parsedArgs.cli === 'angular' ? angular : nx);
    }

    switch (preset) {
        case Preset.Angular:
        case Preset.AngularWithNest: {
            return Promise.resolve(angular);
        }
        case Preset.WebComponents:
        case Preset.React:
        case Preset.ReactWithExpress:
        case Preset.NextJs: {
            return Promise.resolve(nx);
        }
        default: {
            return inquirer
                .prompt([
                    {
                        name: 'CLI',
                        message: `CLI to power the Nx workspace      `,
                        default: 'nx',
                        type: 'list',
                        choices: [
                            {
                                value: 'nx',
                                name:
                                    'Nx           [Extensible CLI for JavaScript and TypeScript applications]',
                            },

                            {
                                value: 'angular',
                                name:
                                    'Angular CLI  [Extensible CLI for Angular applications. Recommended for Angular projects.]',
                            },
                        ],
                    },
                ])
                .then((a: { CLI: string }) => (a.CLI === 'angular' ? angular : nx));
        }
    }
}
