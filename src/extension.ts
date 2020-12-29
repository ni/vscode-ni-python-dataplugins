import * as vscode from 'vscode';
import * as commands from './commands';
import * as config from './config';
import * as fileutils from './file-utils';
import * as vscu from './vscode-utils';

export function activate(context: vscode.ExtensionContext) {
   vscu.getOutputChannel().appendLine(`info: activating extension`);

   fileutils.createFolderSync(config.dataPluginFolder);
   vscu.getOutputChannel().appendLine(`info: creating dataplugin shared folder ${config.dataPluginFolder}`);

   const createDataPluginCommand = vscode.commands.registerCommand('nipy.createDataPlugin', async () => { commands.createDataPlugin(); });
   vscu.getOutputChannel().appendLine(`info: command registered nipy.createDataPlugin`);
   const exportPluginFromContextMenuCommand = vscode.commands.registerCommand('nipy.exportPluginFromContextMenu', async (uri: vscode.Uri) => { commands.exportPluginFromContextMenu(uri); });
   vscu.getOutputChannel().appendLine(`info: command registered nipy.exportPluginFromContextMenu`);

   context.subscriptions.push(
      createDataPluginCommand,
      exportPluginFromContextMenuCommand
   );

   
}