# NI DataPlugins extension for Visual Studio Code

A [Visual Studio Code](https://code.visualstudio.com/) extension that provides development support for [NI DataPlugins](https://www.ni.com/downloads/dataplugins) written in [Python](https://www.python.org).

[![Build Status](https://janschummers.visualstudio.com/vscode-ni-python-dataplugins/_apis/build/status/jschumme.vscode-ni-python-dataplugins?branchName=master)](https://janschummers.visualstudio.com/vscode-ni-python-dataplugins/_build/latest?definitionId=1&branchName=master)

# Quick start
**Step 1.** Install this extension. Download the latest *vsix* from [Release](https://github.com/jschumme/vscode-ni-python-dataplugins/releases).
- Open Visual Studio Code and select View->Extensions from the menu to display the Extensions pane.
- Click the ... at the top-right corner of the Extensions pane and select "Install from VSIX...".
- Locate the .vsix file you download and click "Open".
- Click "Restart" to confirm.
**Step 2.** Create a new DataPlugin. Launch VS Code Command Palette (Ctrl+Shift+P), paste the following command, and press enter.
```
NI DataPlugins: Create new Python-DataPlugin
```
**Step 3.** Export the DataPlugin. Launch VS Code Command Palette (Ctrl+Shift+P), paste the following command, and press enter.
```
NI DataPlugins: Export Python-DataPlugin
```
