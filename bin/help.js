"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function showHelp(preset) {
    var options = Object.values(preset)
        .map(function (preset) { return '"' + preset + '"'; })
        .join(', ');
    console.log("\n  Usage: create-nx-workspace <name> [options] [new workspace options]\n\n  Create a new Nx workspace\n\n  Options:\n\n    name                      workspace name (e.g., org name)\n\n    preset                    What to create in a new workspace (options: " + options + ")\n\n    appName                   the name of the application created by some presets  \n\n    cli                       CLI to power the Nx workspace (options: \"nx\", \"angular\")\n    \n    style                     default style option to be used when a non-empty preset is selected \n                              options: (\"css\", \"scss\", \"styl\", \"less\") for React/Next.js also (\"styled-components\", \"@emotion/styled\")\n\n    interactive               Enable interactive mode when using presets (boolean)\n\n    [new workspace options]   any 'new workspace' options\n");
}
exports.showHelp = showHelp;
