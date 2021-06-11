import * as fs from 'fs-extra';
import * as open from 'open';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
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

    const isExample = !!quickPickItem.example;

    // Return DataPlugin from example template
    if (isExample) {
        try {
            const exampleName: string = quickPickItem.example?.name ?? '';
            const dataPlugin: DataPlugin = await DataPlugin.createDataPlugin(
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
    return createDataPluginFromSampleFile(dataPluginName);
}

export async function exportPlugin(uri: vscode.Uri): Promise<void> {
    if (!uri) {
        return;
    }

    const scriptPath = uri.fsPath;
    const workspaceDir = path.dirname(scriptPath);
    const pluginName = path.basename(path.dirname(scriptPath));
    const extensions = await readOrRequestFileExtensionConfig(workspaceDir);
    if (!extensions) {
        return;
    }

    let exportPath = config.exportPath || '';
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

    await vscu.exportDataPlugin(scriptPath, extensions.toString(), `${exportPath}`, {
        embedScript: true,
        promptInfoMessage: true
    });

    // Store selected extensions so we don't have to ask again
    fileutils.storeFileExtensionConfig(path.dirname(scriptPath), extensions);
}

export async function registerPlugin(uri: vscode.Uri): Promise<void> {
    const scriptPath = uri?.fsPath ?? vscu.getOpenPythonScript()?.fsPath;
    if (!scriptPath) {
        return;
    }

    const workspaceDir = path.dirname(scriptPath);
    const pluginName = path.basename(workspaceDir);
    const exportPath = path.join(os.tmpdir(), `${pluginName}.uri`);
    const extensions = await readOrRequestFileExtensionConfig(workspaceDir);
    if (!extensions) {
        return;
    }

    await vscu.exportDataPlugin(scriptPath, extensions.toString(), `${exportPath}`, {
        embedScript: false,
        promptInfoMessage: false
    });
    const process = await open(exportPath);
    process.on('exit', rc => {
        const foundUsiReg = rc === 0;
        if (!foundUsiReg) {
            const result = vscode.window.showErrorMessage(
                `UsiReg is not associated with the file extension *.uri. The DataPlugin has been exported to: ${exportPath}`,
                'Open in Explorer'
            );
            void result.then(r => {
                if (r === 'Open in Explorer') {
                    void open(path.dirname(exportPath));
                }
            });
        }
    });
    // Store selected extensions so we don't have to ask again
    fileutils.storeFileExtensionConfig(path.dirname(scriptPath), extensions);
}

async function createDataPluginFromSampleFile(dataPluginName: string): Promise<DataPlugin | null> {
    const dataPlugin: DataPlugin = await DataPlugin.createDataPlugin(
        dataPluginName,
        'hello_world',
        Languages.Python
    );

    const openDialogOptions = {
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        title: 'Choose your sample data file'
    };

    const selectedFiles = await vscode.window.showOpenDialog({ ...openDialogOptions });
    const sampleFile = selectedFiles?.[0];
    if (sampleFile) {
        const sampleFileName = path.basename(sampleFile.fsPath);
        try {
            await fs.copy(sampleFile.fsPath, path.join(dataPlugin.folderPath, sampleFileName));
        } catch (e) {
            if (e instanceof Error) {
                void vscode.window.showErrorMessage(
                    `Could not copy sample file to workspace: ${e.message}`
                );
            }
        }

        // determine file extension and store
        const fileExtension = path.extname(sampleFile.fsPath);
        if (fileExtension) {
            fileutils.storeFileExtensionConfig(
                path.dirname(dataPlugin.scriptPath),
                `*${fileExtension}`
            );
        }

        // manipulate script
        try {
            dataPlugin.replaceStringInScript('Example.csv', sampleFileName);
            dataPlugin.renameDataPluginScript(dataPlugin.name);
        } catch (e) {
            if (e instanceof Error) {
                void vscode.window.showErrorMessage(e.message);
            }
            throw e;
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

async function readOrRequestFileExtensionConfig(workspaceDir: string): Promise<string> {
    let extensions: string | undefined;

    try {
        extensions = await fileutils.readFileExtensionConfig(workspaceDir);
    } catch (e) {
        extensions = undefined;
    }

    if (!extensions) {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            // eslint-disable-next-line no-await-in-loop
            extensions = await vscu.showInputBox(
                'Enter the file extension(s) your DataPlugin handles using the following syntax: ',
                '*.tdm; *.xls ...'
            );

            if (!extensions) {
                return '';
            }

            const isValidInput = vscu.isValidFileExtensionInput(extensions);
            if (isValidInput) {
                break;
            }
        }
    }

    return extensions;
}
