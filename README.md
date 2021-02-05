# NI DataPlugins extension for Visual Studio Code

A [Visual Studio Code](https://code.visualstudio.com/) Extension that provides development support for [NI DataPlugins](https://www.ni.com/downloads/dataplugins) written in [Python](https://www.python.org). For more information about writing Python DataPlugins, please refer to the [SystemLink Operations Handbook](https://operations.systemlink.io).

![CI](https://github.com/ni/vscode-ni-python-dataplugins/workflows/CI/badge.svg)

## Quick start

**Step 1.** Install this extension. Download the latest *vsix* from [Release](https://github.com/jschumme/vscode-ni-python-dataplugins/releases).

- Open Visual Studio Code and select View->Extensions from the menu to display the Extensions pane.
- Click the ... at the top-right corner of the Extensions pane and select "Install from VSIX...".
- Locate the .vsix file you download and click "Open".
- Click "Restart" to confirm.

![Installing the extension](./docs/images/install-from-vsix.png)

**Step 2.** Create a new DataPlugin. Launch VS Code Command Palette (Ctrl+Shift+P), paste the following command, and press enter.

```json
NI DataPlugins: Create new Python-DataPlugin
```

![Creating a new DataPlugin](./docs/images/create-new-dataplugin.gif)

**Step 3.** Export the DataPlugin. Right click on the \*.py file you want to export -> Choose "NI DataPlugins: Export DataPlugin". Create a file `.file-extensions` in the root directory of your project and list all file extensions that your DataPlugin should support. If no list is defined, you will be prompted to provide a list of file extensions on first export of your DataPlugin.

## Advanced Settings

### Custom Template

Start writing your DataPlugin with your own custom template. Simply add your template to the `examples` directory of this extension. You find the extension in `$HOME/.vscode/extensions` folder on Mac and Linux or the `%USERPROFILE%\.vscode\extensions` folder on Windows.

### Export Path

Set the export path for all your plugins in Preferences -> Settings -> Extensions -> Vscode-NI-Python-DataPlugins -> Plugin Export Path. The path can be a folder or a *.uri file.

<details>
<summary>Example</summary>

```json
{
    "NI-DataPlugins.PluginExportPath": "C:\\Temp"
}
// OR
{
    "NI-DataPlugins.PluginExportPath": "C:\\Temp\\MyPlugin.uri"
}
```

</details>

## Contribute

Contribute to this project by finding issues, requesting features or creating Pull Requests. General documentation about developing extensions for Visual Studio Code can be found [here](https://code.visualstudio.com/api) and [here](https://vscode-docs.readthedocs.io/en/stable/extensions/debugging-extensions/).
