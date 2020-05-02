import * as vscode from 'vscode';
import * as config from './config';
import * as vscu from './vscode-utils';
import { DataPlugin } from './dataplugin';
import { Languages } from './plugin-languages.enum';

export async function checkSyntax() {
   if (vscu.isDocumentEmpty()) {
      return;
   }

   if (vscode.window.activeTextEditor?.document.languageId === 'python') {
      const cls: string = 'class';
      const text = vscode.window.activeTextEditor?.document.getText();

      const result = text.match(new RegExp(cls + '\\s(\\w+)'));
      if (result?.[1] === 'Plugin') {
         vscode.window.showInformationMessage(config.extPrefix + 'The class name is ok.');
      } else {
         vscode.window.showInformationMessage(config.extPrefix + 'The class name must be "Plugin" !');
      }
   } else {
      vscode.window.showInformationMessage(config.extPrefix + 'This is not a Python-DataPlugin file.');
   }
}

export async function createDataPlugin(): Promise<DataPlugin | null> {
   const scriptName: string | undefined = await vscu.showInputBox('DataPlugin name: ', 'Please enter your DataPlugin name');
   if (!scriptName) {
      return null;
   }

   const pluginQuickPickItems: vscode.QuickPickItem[] = [
      {
         label: 'Direct',
         description: 'Template for direct loading of data'
      }, {
         label: 'Indirect',
         description: 'Template for loading data by callback functions'
      }
   ];

   const pluginType = await vscu.showQuickPick(
      'Please choose your DataPlugin type',
      false,
      false,
      pluginQuickPickItems
   );

   if (!pluginType) {
      return null;
   }
   const dataPlugin: DataPlugin = new DataPlugin(scriptName, pluginType.label === 'Direct', Languages.Python);
   await dataPlugin.createMainPy();
   await dataPlugin.createExampleDataFile();
   return dataPlugin;
}

export async function exportPlugin() {
   const optionsOpen: vscode.OpenDialogOptions = {
      defaultUri: vscode.Uri.parse(config.userDocuments),
      filters: { 'Python': ['py'] },
      canSelectFolders: false,
      canSelectMany: false
   };

   const extensions = await vscu.showInputBox('Please enter the file extensions your DataPlugin can handle in the right syntax: ', '*.tdm; *.xls ...');

   if (extensions !== undefined) {
      await vscode.window.showOpenDialog({ ...optionsOpen }).then(async fileUri => {
         if (fileUri?.[0]) {
            if (extensions !== undefined) {
               await DataPlugin.exportPlugin(fileUri, extensions.toString());
            }
         }
      });
   }
}

export async function exportPluginFromContextMenu(uri: vscode.Uri) {
   const extensions = await vscu.showInputBox('Please enter the file extensions your DataPlugin can handle in the right syntax: ', '*.tdm; *.xls ...');

   if (extensions !== undefined) {
      await DataPlugin.exportPlugin([uri], extensions.toString());
   }
}