export function showHelp(preset: any) {
    const options = Object.values(preset)
        .map((preset) => '"' + preset + '"')
        .join(', ');

    console.log(`
  Usage: create-nx-workspace <name> [options] [new workspace options]

  Create a new Nx workspace

  Options:

    name                      workspace name (e.g., org name)

    preset                    What to create in a new workspace (options: ${options})

    appName                   the name of the application created by some presets  

    cli                       CLI to power the Nx workspace (options: "nx", "angular")
    
    style                     default style option to be used when a non-empty preset is selected 
                              options: ("css", "scss", "styl", "less") for React/Next.js also ("styled-components", "@emotion/styled")

    interactive               Enable interactive mode when using presets (boolean)

    [new workspace options]   any 'new workspace' options
`);
}
