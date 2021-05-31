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
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            commands.createDataPlugin();
        }
    );
    const exportPluginFromContextMenuCommand = vscode.commands.registerCommand(
        'nipy.exportPluginFromContextMenu',
        async (uri: vscode.Uri) => {
            void commands.exportPluginFromContextMenu(uri);
        }
    );

    context.subscriptions.push(createDataPluginCommand, exportPluginFromContextMenuCommand);
}
