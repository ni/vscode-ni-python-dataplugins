import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as config from './config';
import * as fileutils from './file-utils';
import * as vscu from './vscode-utils';
import DataPlugin from './dataplugin';
import Example from './example';
import Languages from './plugin-languages.enum';
import { QuickPickItemWithExample } from './quick-pick-item-with-example';

export async function createDataPlugin(): Promise<DataPlugin | null> {
    const examples: Example[] = vscu.loadExamples();

    const dataPluginName: string | undefined = await vscu.showInputBox(
        'DataPlugin name: ',
        'Please enter your DataPlugin name'
    );
    if (!dataPluginName) {
        return null;
    }

    if (fs.existsSync(`${config.dataPluginFolder}\\${dataPluginName}`)) {
        await vscode.window.showInformationMessage(
            `${config.extPrefix} There is already a DataPlugin named "${dataPluginName}"!`
        );
        return null;
    }

    const pluginQuickPickItems: QuickPickItemWithExample[] = [];

    pluginQuickPickItems.push({
        detail: 'Select a sample file to be supported by your DataPlugin.',
        description: 'Browse files...',
        label: '$(folder) Start with sample data',
        picked: true
    });

    for (const item of examples) {
        pluginQuickPickItems.push({
            // eslint-disable-next-line no-await-in-loop
            detail: await item.getDetails(),
            description: 'Example',
            label: `$(file-code) ${item.name}`,
            example: item
        });
    }

    const quickPickItem = await vscode.window.showQuickPick<QuickPickItemWithExample>(
        pluginQuickPickItems,
        {
            canPickMany: false,
            matchOnDescription: false,
            placeHolder: 'Please choose a template to start with'
        }
    );

    if (!quickPickItem) {
        return null;
    }

    const isExample = !quickPickItem.picked;

    // Return DataPlugin from example template
    if (isExample) {
        try {
            const exampleName: string = quickPickItem.example?.name ?? '';
            const dataPlugin: DataPlugin = new DataPlugin(
                dataPluginName,
                exampleName,
                Languages.Python
            );
            await vscu.showDataPluginInVSCode(dataPlugin);
            return dataPlugin;
        } catch (e) {
            if (e instanceof Error) {
                void vscode.window.showErrorMessage(e.message);
            }
            throw e;
        }
    }

    // Return DataPlugin from Sample Data File
    const dataPlugin: DataPlugin = new DataPlugin(dataPluginName, 'hello_world', Languages.Python);
    return createDataPluginFromSampleFile(dataPlugin);
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

async function createDataPluginFromSampleFile(dataPlugin: DataPlugin): Promise<DataPlugin | null> {
    const openDialogOptions = {
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        title: 'Choose your sample data file'
    };

    const selectedFiles = await vscode.window.showOpenDialog({ ...openDialogOptions });
    if (selectedFiles) {
        const sampleFile = selectedFiles[0];
        // copy sample file to workspace
        try {
            const sampleFileName = path.basename(sampleFile.fsPath);
            await fs.copy(sampleFile.fsPath, path.join(dataPlugin.folderPath, sampleFileName));
        } catch (e) {
            void vscode.window.showErrorMessage('Could not copy sample file to workspace.');
        }

        // determine file extension and store
        const fileExtension = fileutils.getFileExtensionFromFileName(sampleFile.fsPath);
        if (fileExtension) {
            fileutils.storeFileExtensionConfig(
                path.dirname(dataPlugin.scriptPath),
                `*.${fileExtension}`
            );
        }

        // create DataPlugin
        try {
            await vscu.showDataPluginInVSCode(dataPlugin);
            return dataPlugin;
        } catch (e) {
            if (e instanceof Error) {
                void vscode.window.showErrorMessage(e.message);
            }
            throw e;
        }
    }

    return null;
}
