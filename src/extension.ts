/* eslint-disable import/prefer-default-export */
import * as vscode from 'vscode';
import * as commands from './commands';
import * as config from './config';
import * as fileutils from './file-utils';

export function activate(context: vscode.ExtensionContext): void {
    fileutils.createFolderSync(config.dataPluginFolder);

    const createDataPluginCommand = vscode.commands.registerCommand(
        'nipy.createDataPlugin',
        async () => {
            void commands.createDataPlugin();
        }
    );
    const exportPluginCommand = vscode.commands.registerCommand(
        'nipy.exportPlugin',
        async (uri: vscode.Uri) => {
            void commands.exportPlugin(uri);
        }
    );
    const registerPluginCommand = vscode.commands.registerCommand(
        'nipy.registerPlugin',
        async (uri: vscode.Uri) => {
            void commands.registerPlugin(uri);
        }
    );

    context.subscriptions.push(createDataPluginCommand, exportPluginCommand, registerPluginCommand);
}
