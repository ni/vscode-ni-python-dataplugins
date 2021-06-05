import * as fs from 'fs-extra';
import * as open from 'open';
import * as path from 'path';
import * as vscode from 'vscode';
import * as config from './config';
import * as fileutils from './file-utils';
import DataPlugin from './dataplugin';
import Example from './example';

export async function disposeDataPlugin(dataPlugin: DataPlugin): Promise<void> {
    const pluginFolder: string = dataPlugin.folderPath;
    void fs.remove(pluginFolder);
}

export async function exportDataPlugin(
    scriptPath: string,
    fileExtensions: string,
    exportPath: string,
    promptInfoMessage = true
): Promise<void> {
    await fileutils.writeUriFile(scriptPath, fileExtensions, exportPath);

    if (!promptInfoMessage) {
        return;
    }

    const result = await vscode.window.showInformationMessage(
        `${config.extPrefix} Sucessfully exported DataPlugin`,
        'Open in Explorer',
        'Register DataPlugin'
    );
    if (result === 'Open in Explorer') {
        await open(path.dirname(exportPath));
    }
    if (result === 'Register DataPlugin') {
        await open(exportPath);
    }
}

export function loadExamples(): Example[] {
    const examplesFolder = path.resolve(`${path.dirname(__dirname)}\\examples`);
    const examplesNames: string[] = fs
        .readdirSync(examplesFolder)
        .filter(folder => fs.statSync(path.join(examplesFolder, folder)).isDirectory());
    const examples = examplesNames.map(name => {
        return new Example(examplesFolder, name);
    });

    return examples;
}

export function isDocumentEmpty(): boolean {
    return !vscode.window.activeTextEditor?.document.getText.toString();
}

export async function openDocumentAndShow(docPath: string): Promise<vscode.TextEditor> {
    const textDocument = await vscode.workspace.openTextDocument(docPath);
    return vscode.window.showTextDocument(textDocument);
}

export async function showDataPluginInVSCode(dataPlugin: DataPlugin): Promise<void> {
    // Creates the DIAdem folder in the workspace.
    vscode.workspace.updateWorkspaceFolders(0, 0, {
        uri: vscode.Uri.file(`${dataPlugin.folderPath}`),
        name: dataPlugin.name
    });

    // Opens the VSCode explorer
    await vscode.commands.executeCommand('workbench.view.explorer');
    await openDocumentAndShow(dataPlugin.scriptPath);
}

export async function showInputBox(
    prompt: string,
    placeHolder: string
): Promise<string | undefined> {
    const options: vscode.InputBoxOptions = {
        prompt,
        placeHolder
    };

    let returnValue: string | undefined;

    await vscode.window.showInputBox(options).then(value => {
        if (!value) {
            return;
        }
        returnValue = value;
    });

    return returnValue;
}

export async function showQuickPick(
    placeHolder: string,
    canPickMany: boolean,
    matchOnDescription: boolean,
    items: vscode.QuickPickItem[]
): Promise<vscode.QuickPickItem | undefined> {
    const options: vscode.QuickPickOptions = {
        placeHolder,
        canPickMany,
        matchOnDescription
    };

    let returnValue: vscode.QuickPickItem | undefined;

    await vscode.window.showQuickPick(items, options).then(async value => {
        if (value !== undefined) {
            if (!value) {
                return;
            }
            returnValue = value;
        }
    });

    return returnValue;
}
