// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as homedir from 'os';
import * as open from 'open';
import * as yaml from 'js-yaml';

// import * as linter from 'vscode-linter';

import utils = require('./utils');

const usersdocuments = homedir.homedir + '\\Documents';
const DataPluginFolder = usersdocuments + '\\NI_DataPlugin';
const listPath = path.join(path.dirname(__dirname), 'scriptPathsList.yml');
let script: Script;
const prefix: string = "NI DataPlugins: ";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


   // register a command that is invoked when the status bar
   // item is selected
   const myCommandId = 'extension.new';
   context.subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
      let n = getNumberOfSelectedLines();

   }));

   // create a new status bar item that we can now manage
   myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
   myStatusBarItem.command = myCommandId;
   context.subscriptions.push(myStatusBarItem);

   // register some listener that make sure the status bar 
   // item always up-to-date
   context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
   context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(updateStatusBarItem));

   // update status bar item once at start
   updateStatusBarItem();

   function updateStatusBarItem(): void {
      if (vscode.window.activeTextEditor?.document.languageId === 'python') {
         myStatusBarItem.show();
         var b = getNumberOfSelectedLines();
         if (b !== undefined) {
            myStatusBarItem.text = b;
         }
      } else {
         myStatusBarItem.hide();
      }
   }

   function getNumberOfSelectedLines(): string | undefined {
      if (vscode.window.activeTextEditor?.document.getText.toString() !== undefined) {
         if (vscode.window.activeTextEditor?.document.languageId === 'python') {
            const cls: string = "class";
            const text = vscode.window.activeTextEditor?.document.getText();

            let result = text.match(new RegExp(cls + '\\s(\\w+)'));

            if (result !== null && result[1] !== null) {
               if (result[1] !== "Plugin") {
                  vscode.window.showInformationMessage(prefix + 'The class name must be "Plugin" !');

                  return (prefix + 'The class name must be "Plugin" !');
               } else if (result[1] === 'Plugin') {

                  return (prefix + 'All right.');
               }
            }
         } else {
            return (prefix + 'This is not a Python-DataPlugin file.');
         }
      }
      else {
         return (prefix + 'There is no document.');
      }
      return undefined;
   }


   Script.createFolder(DataPluginFolder);

   // The command has been defined in the package.json file
   // Now provide the implementation of the command with registerCommand
   // The commandId parameter must match the command field in package.json
   let disposable = vscode.commands.registerCommand('extension.createDataPlugin', async () => {

      // Waites for an input of the user
      const scriptName: string | undefined = await Script.showInputBox("DataPlugin name: ", "Please enter your DataPlugin name");

      const items: vscode.QuickPickItem[] = [
         {
            label: 'Direct',
            description: 'Creates a direct DataPlugin'
         },
         {
            label: 'Indirect',
            description: 'Creates an indirect DataPlugin'
         }];

      if (scriptName !== undefined) {
         let item = await Script.showQuickPick("Please choose your DataPlugin type", false, false, items);
         let direct: boolean = false;

         if (item !== undefined) {
            if (item.label === 'Direct') {
               direct = true;
            } else if (item.label === 'Indirect') {
               direct = false;
            }

            script = new Script(scriptName, direct, utils.language.Python);
         }
      }
   });

   let checkSyn = vscode.commands.registerCommand('extension.checkSyntax', async () => {
      if (vscode.window.activeTextEditor?.document.getText.toString() !== undefined) {
         if (vscode.window.activeTextEditor?.document.languageId === 'python') {
            const cls: string = "class";
            const text = vscode.window.activeTextEditor?.document.getText();

            var result = text.match(new RegExp(cls + '\\s(\\w+)'));
            if (result !== null && result[1] !== null) {
               if (result[1] !== "Plugin") {
                  vscode.window.showInformationMessage(prefix + 'The class name must be "Plugin" !');
               } else if (result[1] === 'Plugin') {
                  vscode.window.showInformationMessage(prefix + 'The class name is ok.');
               }
            }
         } else {
            vscode.window.showInformationMessage(prefix + 'This is not a Python-DataPlugin file.');
         }
      }
      else {
         vscode.window.showInformationMessage(prefix + 'There is no document.');
      }
   });

   let explorerExport = vscode.commands.registerCommand('extension.exportPluginExplorer', async (uri: vscode.Uri) => {
      const ur: vscode.Uri[] = [uri];
      const extensions = await Script.showInputBox('Please enter the file extensions your DataPlugin can handle in the right syntax: ', '*.tdm; *.xls ...');

      if (extensions !== undefined) {
         await Script.exportPlugin(ur, extensions.toString());
      }
   });

   let openLatest = vscode.commands.registerCommand('extension.openLatest', async () => {
      let scriptName = await Script.getLastScriptName();
      let scriptPath = await Script.getLastScriptPath();
      if (scriptName !== null && scriptPath !== null) {
         const items: vscode.QuickPickItem[] = [
            {
               label: scriptName.toString(),
               description: scriptPath.toString()
            }];

         let item = await Script.showQuickPick("Please choose a DataPlugin", false, false, items);

         if (item !== undefined && item.description !== undefined) {
            Script.showDataPluginInVSCode(item.label, item.description);
         }
      } else {
         vscode.window.showInformationMessage(prefix + 'No last used plugin was found.');
      }
   });

   let exportPlugin = vscode.commands.registerCommand('extension.exportPlugin', async () => {
      let optionsOpen: vscode.OpenDialogOptions = {
         defaultUri: vscode.Uri.parse(usersdocuments),
         filters: { 'Python': ['py'] },
         canSelectFolders: false,
         canSelectMany: false
      };
      const extensions = await Script.showInputBox('Please enter the file extensions your DataPlugin can handle in the right syntax: ', '*.tdm; *.xls ...');
      if (extensions !== undefined) {
         await vscode.window.showOpenDialog({ ...optionsOpen }).then(async fileUri => {
            if (fileUri && fileUri[0]) {
               if (extensions !== undefined) {
                  await Script.exportPlugin(fileUri, extensions.toString());
               }
            }
         });
      }
   });

   context.subscriptions.push(disposable, exportPlugin, explorerExport, openLatest, checkSyn);
}

// this method is called when your extension is deactivated
export function deactivate() { }

let myStatusBarItem: vscode.StatusBarItem;



export class Script {
   private _name: string;
   private _scriptPath: string;
   private _examplePath: string;
   private _language: utils.language;
   private _direct: boolean;
   private _fileExtensions: utils.fileExtensions[] = new Array();

   constructor(name: string, direct: boolean, language: utils.language) {
      this._name = name;
      this._direct = direct;
      this._language = language;
      this._language = language;

      this._scriptPath = DataPluginFolder + '\\' + name + '\\Main.py';
      this._examplePath = DataPluginFolder + '\\' + name + '\\Example.csv';

      Script.createFolder(DataPluginFolder + '\\' + name);

      if (!fs.existsSync(this.scriptPath)) {
         //Reads the default-script-indirect.py and writes the content in the new file Main.py
         if (direct === false) {
            fs.readFile(path.join(path.dirname(__dirname), 'default-script-indirect.py'), async (err, content) => {
               if (err) { throw err; }
               fs.writeFile(path.join(this.scriptPath), content, async err => {
                  if (err) { return vscode.window.showErrorMessage(prefix + 'Failed to create indirect DataPlugin!'); }
                  // vscode.window.showInformationMessage(prefix + 'Successfully created indirect Main.py');
                  Script.updateList(this.name, this.scriptPath);
                  await Script.showDataPluginInVSCode(name, this._scriptPath);
               });
            });
         }
         //Reads the default-script-direct.py and writes the content in the new file Main.py
         if (direct === true) {
            fs.readFile(path.join(path.dirname(__dirname), 'default-script-direct.py'), (err, content) => {
               if (err) { throw err; }
               fs.writeFile(path.join(this.scriptPath), content, async err => {
                  if (err) { return vscode.window.showErrorMessage(prefix + 'Failed to create direct DataPlugin!'); }
                  vscode.window.showInformationMessage(prefix + 'Template files created');
                  Script.updateList(this.name, this.scriptPath);
                  await Script.showDataPluginInVSCode(name, this._scriptPath);
               });
            });
         }
         //Reads the example.csv and writes the content in the new file
         fs.readFile(path.join(path.dirname(__dirname), 'example.csv'), (err, content) => {
            if (err) { throw err; }
            fs.writeFile(path.join(this.examplePath), content, async err => {
               if (err) { return vscode.window.showErrorMessage(prefix + 'Failed to create example file!'); }
            });
         });
      } else {
         vscode.window.showInformationMessage(prefix + 'Example file already exists');
         Script.showDataPluginInVSCode(name, this._scriptPath);
      }
   }

   public static async exportPlugin(uri: vscode.Uri[], fileExtensions: string) {
      let options: vscode.SaveDialogOptions = {
         defaultUri: vscode.Uri.parse(DataPluginFolder),
         filters: { 'Uri': ['uri'] },
      };

      const pythonScriptPath = uri[0].fsPath;

      await vscode.window.showSaveDialog({ ...options }).then(fileInfos => {
         if (fileInfos !== undefined) {
            fs.readFile(uri[0].fsPath, (err, content) => {
               if (err) { throw err; }

               const fileName = path.basename(fileInfos.fsPath, path.extname(fileInfos.fsPath)); //Gets the fileName without extension and path.
               fs.writeFile(fileInfos.fsPath, `<usireginfo><storetype name="` + fileName + `"><type>python</type><alias>` + fileName + `</alias><description>` + fileName + `</description><filepath>uspTdmMarshaller.dll</filepath><exportsupported>NO</exportsupported><caching>YES</caching><easypluginparam><![CDATA[<dllpath>@USIBINDIR@\\PythonMarshaller\\uspPythonMarshaller.dll</dllpath><script>${pythonScriptPath}</script>]]></easypluginparam><querysupported>0</querysupported><fastloadsupported>0</fastloadsupported><filefilters extension="${fileExtensions}"><description>` + fileName + ` Dateien (` + fileExtensions + `)</description></filefilters><platform>x64</platform>`
                  , err => {
                     if (err) { return vscode.window.showErrorMessage(prefix + 'Failed to export DataPlugin!'); }
                     fs.appendFile(fileInfos.fsPath, "></storetype></usireginfo>", async err => {
                        if (err) { return vscode.window.showErrorMessage(prefix + 'Failed to export Python script!'); }

                        const result = await vscode.window.showInformationMessage(prefix + 'Sucessfully exported DataPlugin', 'Open in Explorer', 'Register DataPlugin');
                        if (result && result === 'Open in Explorer') {
                           await open(path.dirname(fileInfos.fsPath));
                        }
                        if (result && result === 'Register DataPlugin') {
                           await open(fileInfos.fsPath);
                        }
                     });
                  });
            });
         }
      });
   }

   //Displays a InputBox dialog to the user.
   public static async showInputBox(prompt: string, placeHolder: string): Promise<string | undefined> {
      let options: vscode.InputBoxOptions = {
         prompt: prompt,
         placeHolder: placeHolder
      };
      let returnvalue: string | undefined = undefined;
      await vscode.window.showInputBox(options).then(value => {
         if (!value) { return; }
         returnvalue = value;
      });
      return returnvalue;
   }

   //Displays a QuickPick dialog to the user.
   public static async showQuickPick(placeHolder: string, canPickMany: boolean, matchOnDescription: boolean, items: vscode.QuickPickItem[]): Promise<vscode.QuickPickItem | undefined> {
      let options: vscode.QuickPickOptions = {
         placeHolder: placeHolder,
         canPickMany: canPickMany,
         matchOnDescription: matchOnDescription
      };
      let returnValue: vscode.QuickPickItem | undefined = undefined;
      await vscode.window.showQuickPick(items, options).then(async value => {
         if (value !== undefined) {
            if (!value) { return; }
            returnValue = value;
         }
      });
      return returnValue;
   }

   //Returns the content of "ScriptName" in the scriptPathsList.yml
   public static async getLastScriptName(): Promise<string[] | null> {
      let scriptName: string[] = new Array();
      try {
         const config = await yaml.safeLoad(fs.readFileSync(listPath, 'utf8'));
         scriptName = config.ScriptName;
         return scriptName;
      } catch (err) {
         console.log(err);
         return null;
      }
   }

   //Returns the content of "ScriptPath" in the scriptPathsList.yml
   public static async getLastScriptPath(): Promise<string[] | null> {
      let scriptPath: string[] = new Array();
      const listPath = path.join(path.dirname(__dirname), 'scriptPathsList.yml');
      try {
         const config = await yaml.safeLoad(fs.readFileSync(listPath, 'utf8'));
         scriptPath = config.ScriptPath;
         return scriptPath;
      } catch (err) {
         console.log(err);
         return null;
      }
   }

   //Replaces the scriptPathsList.yml file with name and path of the new DataPlugin
   public static async updateList(name: string, filepath: string) {
      let yamlNameStr = yaml.safeDump({ ScriptName: [name], ScriptPath: [filepath] });
      fs.writeFileSync(listPath, yamlNameStr, 'utf8');
   }

   public static async showDataPluginInVSCode(name: string, path: string) {
      //Creates the DIAdem folder in the workspace.
      vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.file(DataPluginFolder + '\\' + name), name: name });

      //Opens the VSCode explorer
      await vscode.commands.executeCommand('workbench.view.explorer');
      await Script.openFile(path);
   }

   //Creates a folder
   public static createFolder(folder: string) {
      if (!fs.existsSync(folder)) {
         fs.mkdirSync(folder);
      }
   }

   //Opens a file in the editor
   public static async openFile(path: string) {
      const textDocument = await vscode.workspace.openTextDocument(path);
      return await vscode.window.showTextDocument(textDocument);
   }


   public getInformation() {
      return ('Scriptpath: ' + this._scriptPath + ', Language: ' + this._language.toString() + ', Direct: ' + this._direct + ', FileExtensions: ' + this._fileExtensions.toString());
   }

   public get name(): string {
      return this._name;
   }
   public set name(name: string) {
      this._name = name;
   }
   public get scriptPath(): string {
      return this._scriptPath;
   }
   public set scriptPath(path: string) {
      this._scriptPath = path;
   }
   public get examplePath(): string {
      return this._examplePath;
   }
   public set examplePath(path: string) {
      this._examplePath = path;
   }
   public get language(): utils.language {
      return this._language;
   }
   public set language(language: utils.language) {
      this._language = language;
   }
   public get direct(): boolean {
      return this._direct;
   }
   public set direct(direct: boolean) {
      this._direct = direct;
   }
   public get fileExtensions(): utils.fileExtensions[] {
      return this._fileExtensions;
   }
   public set fileExtensions(fileExtensionss: utils.fileExtensions[]) {
      this._fileExtensions = fileExtensionss;
   }
}