import * as vscode from 'vscode';
import * as commands from './commands';
import * as config from './config';
import * as fileutils from './file-utils';

export function activate(context: vscode.ExtensionContext) {

   fileutils.createFolderSync(config.dataPluginFolder);

   const createDataPluginCommand = vscode.commands.registerCommand('nipy.createDataPlugin', async () => { commands.createDataPlugin(); });
   const checkSyntaxCommand = vscode.commands.registerCommand('nipy.checkSyntax', async () => { commands.checkSyntax(); });
   const exportPluginFromContextMenuCommand = vscode.commands.registerCommand('nipy.exportPluginFromContextMenu', async (uri: vscode.Uri) => { commands.exportPluginFromContextMenu(uri); });

   context.subscriptions.push(
      createDataPluginCommand,
      checkSyntaxCommand,
      exportPluginFromContextMenuCommand
   );
}