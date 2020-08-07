import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as config from './config';
import * as fileutils from './file-utils';
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
   const examples: string[] = vscu.loadExamples();
   const examplesNames: string[] = new Array();
   for (let i = 0; i < examples.length; i++) {
      examplesNames[i] = path.basename(examples[i]);
   }

   const scriptName: string | undefined = await vscu.showInputBox('DataPlugin name: ', 'Please enter your DataPlugin name');
   if (!scriptName) {
      return null;
   }

   if (fs.existsSync(`${config.dataPluginFolder}\\${scriptName}`)) {
      await vscode.window.showInformationMessage(`${config.extPrefix} There is already a DataPlugin named "${scriptName}"!`);
      return null;
   }

   const pluginQuickPickItems: vscode.QuickPickItem[] = [];

   for (const item of examplesNames) {
      pluginQuickPickItems.push({
         label: item,
      });
   }

   const pluginType = await vscu.showQuickPick(
      'Please choose a template to start with',
      false,
      false,
      pluginQuickPickItems
   );

   if (!pluginType) {
      return null;
   }

   try {
      const dataPlugin: DataPlugin = new DataPlugin(scriptName, pluginType.label, Languages.Python);
      await dataPlugin.pluginIsInitialized();
      await vscu.showDataPluginInVSCode(dataPlugin);
      return dataPlugin;
   } catch (e) {
      vscode.window.showErrorMessage(e.message);
      throw e;
   }
}

export async function exportPluginFromContextMenu(uri: vscode.Uri) {
   const extensions = await vscu.showInputBox('Please enter the file extensions your DataPlugin can handle in the right syntax: ', '*.tdm; *.xls ...');
   const scriptPath: string = uri.fsPath;
   const pluginName: string = path.basename(path.dirname(scriptPath));

   let exportPath: string = config.exportPath || '';
   if (extensions) {
      if (!exportPath) {
         const options: vscode.SaveDialogOptions = {
            defaultUri: vscode.Uri.parse(`${config.dataPluginFolder}\\${pluginName}`),
            filters: { 'Uri': ['uri'] },
         };

         const fileInfos = await vscode.window.showSaveDialog({ ...options });
         exportPath = fileInfos?.fsPath || '';
      }

      await vscu.exportDataPlugin(scriptPath, extensions.toString(), `${exportPath}\\${pluginName}.uri`);
   }
}