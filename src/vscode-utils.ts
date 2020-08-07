import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { DataPlugin } from './dataplugin';

export function loadExamples(): string[] {
   const exampleFolder = path.resolve(`${path.dirname(__dirname)}\\examples`);

   const examplesNames: string[] = fs.readdirSync(exampleFolder).filter(file => fs.statSync(path.join(exampleFolder, file)).isDirectory());
   const examplesPaths: string[] = new Array();
   for (let i = 0; i < examplesNames.length; i++) {
      examplesPaths[i] = `${exampleFolder}\\${examplesNames[i]}`;
   }
   return examplesPaths;
}

export function isDocumentEmpty() {
   return !(vscode.window.activeTextEditor?.document.getText.toString());
}

export async function openDocumentAndShow(docPath: string) {
   const textDocument = await vscode.workspace.openTextDocument(docPath);
   return await vscode.window.showTextDocument(textDocument);
}

export async function showDataPluginInVSCode(dataPlugin: DataPlugin) {
   // Creates the DIAdem folder in the workspace.
   vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.file(`${dataPlugin.folderPath}`), name: dataPlugin.name });

   // Opens the VSCode explorer
   await vscode.commands.executeCommand('workbench.view.explorer');
   await openDocumentAndShow(dataPlugin.scriptPath);
}

export async function showInputBox(prompt: string, placeHolder: string): Promise<string | undefined> {
   const options: vscode.InputBoxOptions = {
      prompt,
      placeHolder
   };

   let returnValue: string | undefined;

   await vscode.window.showInputBox(options).then(value => {
      if (!value) { return; }
      returnValue = value;
   });

   return returnValue;
}

export async function showQuickPick(placeHolder: string, canPickMany: boolean, matchOnDescription: boolean, items: vscode.QuickPickItem[]): Promise<vscode.QuickPickItem | undefined> {
   const options: vscode.QuickPickOptions = {
      placeHolder,
      canPickMany,
      matchOnDescription
   };

   let returnValue: vscode.QuickPickItem | undefined;

   await vscode.window.showQuickPick(items, options).then(async value => {
      if (value !== undefined) {
         if (!value) { return; }
         returnValue = value;
      }
   });

   return returnValue;
}