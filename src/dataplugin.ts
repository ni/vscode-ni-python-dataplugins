
import * as fs from 'fs';
import * as path from 'path';
import * as open from 'open';
import * as vscode from 'vscode';
import * as config from './config';
import * as vscu from './vscode-utils';
import { FileExtensions } from './file-extensions.enum';
import { Languages } from './plugin-languages.enum';
import { UriTemplate } from './uri-template';

const dataPluginFolder = config.dataPluginFolder;
const dirNamePath = path.dirname(__dirname);

export class DataPlugin {
   private _name: string;
   private _scriptPath: string;
   private _exampleDataFile: string;
   private _language: Languages;
   private _direct: boolean;
   private _fileExtensions: FileExtensions[] = new Array();

   get name(): string {
      return this._name;
   }

   set name(name: string) {
      this._name = name;
   }

   get scriptPath(): string {
      return this._scriptPath;
   }

   set scriptPath(path: string) {
      this._scriptPath = path;
   }

   get exampleDataFile(): string {
      return this._exampleDataFile;
   }

   set exampleDataFile(path: string) {
      this._exampleDataFile = path;
   }

   get language(): Languages {
      return this._language;
   }

   set language(language: Languages) {
      this._language = language;
   }

   get direct(): boolean {
      return this._direct;
   }

   get fileExtensions(): FileExtensions[] {
      return this._fileExtensions;
   }

   set fileExtensions(fileExtensionss: FileExtensions[]) {
      this._fileExtensions = fileExtensionss;
   }

   constructor(name: string, direct: boolean, language: Languages) {
      this._name = name;
      this._direct = direct;
      this._language = language;
      this._scriptPath = `${dataPluginFolder}\\${name}\\Main.py`;
      this._exampleDataFile = `${dataPluginFolder}\\${name}\\Example.csv`;

      vscu.createFolder(`${dataPluginFolder}\\${name}`);

      if (fs.existsSync(this.scriptPath)) {
         vscode.window.showInformationMessage(config.extPrefix + 'Example file already exists');
         DataPlugin.showDataPluginInVSCode(dataPluginFolder, name, this._scriptPath);
      }
   }

   public static async exportPlugin(uri: vscode.Uri[], fileExtensions: string) {
      const options: vscode.SaveDialogOptions = {
         defaultUri: vscode.Uri.parse(dataPluginFolder),
         filters: { 'Uri': ['uri'] },
      };

      const pythonScriptPath = uri[0].fsPath;

      await vscode.window.showSaveDialog({ ...options }).then(fileInfos => {
         if (!fileInfos) {
            return;
         }

         fs.readFile(uri[0].fsPath, (err, content) => {
            if (err) { throw err; }

            const fileName = path.basename(fileInfos.fsPath, path.extname(fileInfos.fsPath)); // Gets the fileName without extension and path.
            const uriTemplate = new UriTemplate(fileExtensions, fileName, pythonScriptPath);
            fs.writeFile(fileInfos.fsPath, uriTemplate.templateString, async err => {
               if (err) {
                  return vscode.window.showErrorMessage(`${config.extPrefix} Failed to export DataPlugin!`);
               }

               const result = await vscode.window.showInformationMessage(`${config.extPrefix} Sucessfully exported DataPlugin`, 'Open in Explorer', 'Register DataPlugin');
               if (result === 'Open in Explorer') {
                  await open(path.dirname(fileInfos.fsPath));
               }
               if (result === 'Register DataPlugin') {
                  await open(fileInfos.fsPath);
               }
            });
         });
      });
   }

   public static async showDataPluginInVSCode(folder: string, name: string, path: string) {
      // Creates the DIAdem folder in the workspace.
      vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.file(`${folder}\\${name}`), name });

      // Opens the VSCode explorer
      await vscode.commands.executeCommand('workbench.view.explorer');
      await vscu.openDocumentAndShow(path);
   }

   public async createMainPy(): Promise<void> {
      const templatePy = this.direct ? 'default-script-direct.py' : 'default-script-indirect.py';
      fs.readFile(path.join(dirNamePath, 'templates', templatePy), (err, content) => {
         if (err) { throw err; }
         fs.writeFile(path.join(this.scriptPath), content, async err => {
            if (err) {
               vscode.window.showErrorMessage(config.extPrefix + 'Failed to create DataPlugin!');
            }

            vscode.window.showInformationMessage(config.extPrefix + 'Template files created');
            await DataPlugin.showDataPluginInVSCode(dataPluginFolder, this.name, this.scriptPath);
         });
      });
   }

   public async createExampleDataFile(): Promise<void> {
      fs.readFile(path.join(dirNamePath, 'templates', 'example.csv'), (err, content) => {
         if (err) { throw err; }
         fs.writeFile(path.join(this.exampleDataFile), content, async err => {
            if (err) {
               return vscode.window.showErrorMessage(config.extPrefix + 'Failed to create example file!');
            }
         });
      });
   }
}