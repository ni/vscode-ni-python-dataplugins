import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as config from './config';
import * as fileutils from './file-utils';
import * as vscu from './vscode-utils';
import DataPlugin from './dataplugin';
import Languages from './plugin-languages.enum';

export async function createDataPlugin(): Promise<DataPlugin | null> {
    const examples: string[] = vscu.loadExamples();
    const examplesNames: string[] = examples.map(example => path.basename(example));

    const scriptName: string | undefined = await vscu.showInputBox(
        'DataPlugin name: ',
        'Please enter your DataPlugin name'
    );
    if (!scriptName) {
        return null;
    }

    if (fs.existsSync(`${config.dataPluginFolder}\\${scriptName}`)) {
        await vscode.window.showInformationMessage(
            `${config.extPrefix} There is already a DataPlugin named "${scriptName}"!`
        );
        return null;
    }

    const pluginQuickPickItems: vscode.QuickPickItem[] = [];

    for (const item of examplesNames) {
        pluginQuickPickItems.push({
            label: item
        });
    }

    const pluginType: vscode.QuickPickItem | undefined = await vscu.showQuickPick(
        'Please choose a template to start with',
        false,
        false,
        pluginQuickPickItems
    );

    if (!pluginType) {
        return null;
    }

    try {
        const dataPlugin: DataPlugin = new DataPlugin(
            scriptName,
            pluginType.label,
            Languages.Python
        );
        await dataPlugin.pluginIsInitialized();
        await vscu.showDataPluginInVSCode(dataPlugin);
        return dataPlugin;
    } catch (e) {
        if (e instanceof Error) {
            await vscode.window.showErrorMessage(e.message);
        }
        throw e;
    }
}

export async function exportPluginFromContextMenu(uri: vscode.Uri): Promise<void> {
    const scriptPath: string = uri.fsPath;
    const pluginName: string = path.basename(path.dirname(scriptPath));

    let extensions: string | undefined;

    try {
        extensions = await fileutils.readFileExtensionConfig(path.dirname(scriptPath));
    } catch (e) {
        extensions = undefined;
    }

    if (!extensions) {
        extensions = await vscu.showInputBox(
            'Please enter the file extensions your DataPlugin can handle in the right syntax: ',
            '*.tdm; *.xls ...'
        );

        if (!extensions) {
            return;
        }
    }

    let exportPath: string = config.exportPath || '';
    if (!exportPath) {
        const options: vscode.SaveDialogOptions = {
            defaultUri: vscode.Uri.file(
                `${config.dataPluginFolder}\\${pluginName}\\${pluginName}.uri`
            ),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            filters: { Uri: ['uri'] }
        };

        const fileInfos = await vscode.window.showSaveDialog({ ...options });
        if (!fileInfos) {
            return;
        }

        exportPath = fileInfos.fsPath;
    }

    const isDirectory = path.extname(exportPath) === '';
    if (isDirectory) {
        exportPath = path.join(exportPath, `${pluginName}.uri`);
    }

    await vscu.exportDataPlugin(scriptPath, extensions.toString(), `${exportPath}`);

    // Store selected extensions so we don't have to ask again
    fileutils.storeFileExtensionConfig(path.dirname(scriptPath), extensions);
}
