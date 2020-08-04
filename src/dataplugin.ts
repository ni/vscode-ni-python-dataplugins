
import * as fs from 'fs-extra';
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
   private _folderPath: string;
   private _scriptPath: string;
   private _language: Languages;
   private _example: string;
   private _fileExtensions: FileExtensions[] = new Array();

   get name(): string {
      return this._name;
   }

   set name(name: string) {
      this._name = name;
   }

   get folderPath(): string {
      return this._folderPath;
   }

   set folderPath(path: string) {
      this._folderPath = path;
   }

   get scriptPath(): string {
      return this._scriptPath;
   }

   set scriptPath(path: string) {
      this._scriptPath = path;
   }

   get language(): Languages {
      return this._language;
   }

   set language(language: Languages) {
      this._language = language;
   }

   get example(): string {
      return this._example;
   }

   get fileExtensions(): FileExtensions[] {
      return this._fileExtensions;
   }

   set fileExtensions(fileExtensionss: FileExtensions[]) {
      this._fileExtensions = fileExtensionss;
   }

   constructor(name: string, example: string, language: Languages) {
      this._name = name;
      this._example = example;
      this._language = language;
      this._folderPath = `${dataPluginFolder}\\${name}`;
      this._scriptPath = `${dataPluginFolder}\\${name}\\${example}.py`;

      vscu.createFolder(`${dataPluginFolder}\\${name}`);

      if (fs.existsSync(this.scriptPath)) {
         vscode.window.showInformationMessage(config.extPrefix + 'Example file already exists');
         DataPlugin.showDataPluginInVSCode(dataPluginFolder, name, this._scriptPath);
      }
   }

   public static async writePlugin(uri: vscode.Uri[], fileExtensions: string, newExportPath: string | undefined) {
      const pythonScriptPath = uri[0].fsPath;
      const dirName = path.basename(path.dirname(pythonScriptPath));
      let exportPath: string;

      fs.readFile(uri[0].fsPath, (err, content) => {
         if (err) { throw err; }
         if (newExportPath === undefined) {
            exportPath = `${config.exportPath}\\${dirName}.uri`;
         } else {
            exportPath = newExportPath;
         }

         const uriTemplate = new UriTemplate(fileExtensions, `${dirName}.uri`, pythonScriptPath);

         fs.writeFile(exportPath, uriTemplate.templateString, async err => {
            if (err) {
               return vscode.window.showErrorMessage(`${config.extPrefix} Failed to export DataPlugin!`);
            }

            const result = await vscode.window.showInformationMessage(`${config.extPrefix} Sucessfully exported DataPlugin`, 'Open in Explorer', 'Register DataPlugin');
            if (result === 'Open in Explorer') {
               await open(path.dirname(exportPath));
            }
            if (result === 'Register DataPlugin') {
               await open(exportPath);
            }
         });
      });
   }

   public static async exportPlugin(uri: vscode.Uri[], fileExtensions: string) {
      const pluginName = path.basename(path.dirname(uri[0].fsPath));
      const options: vscode.SaveDialogOptions = {
         defaultUri: vscode.Uri.parse(`${dataPluginFolder}\\${pluginName}`),
         filters: { 'Uri': ['uri'] },
      };

      if (`${config.exportPath}` !== '') {
         vscu.createFolder(`${config.exportPath}`);
         this.writePlugin(uri, fileExtensions, undefined);
      } else {
         await vscode.window.showSaveDialog({ ...options }).then(fileInfos => {
            if (!fileInfos) {
               return;
            }
            const fileName = path.basename(fileInfos.fsPath, path.extname(fileInfos.fsPath));
            this.writePlugin(uri, fileExtensions, fileInfos.fsPath);
         });
      }
   }

   public static async showDataPluginInVSCode(folder: string, name: string, path: string) {
      // Creates the DIAdem folder in the workspace.
      vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.file(`${folder}\\${name}`), name });

      // Opens the VSCode explorer
      await vscode.commands.executeCommand('workbench.view.explorer');
      await vscu.openDocumentAndShow(path);
   }

   public async createMainPy(): Promise<void> {
      const templatePy = `${this.example}.py`;

      fs.copy(path.join(dirNamePath, 'examples', this.example), path.join(this.folderPath), async err => {
         if (err) {
            vscode.window.showErrorMessage(config.extPrefix + 'Failed to create DataPlugin!');
         }
         vscode.window.showInformationMessage(config.extPrefix + 'Template files created');
         await DataPlugin.showDataPluginInVSCode(dataPluginFolder, this.name, this.scriptPath);
       });
   }
}