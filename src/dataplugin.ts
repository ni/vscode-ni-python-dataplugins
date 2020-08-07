
import * as fs from 'fs-extra';
import * as path from 'path';
import * as config from './config';
import { FileExistsError } from './dataplugin-error';
import { FileExtensions } from './file-extensions.enum';
import { Languages } from './plugin-languages.enum';

const dataPluginFolder = config.dataPluginFolder;
const dirNamePath = path.dirname(__dirname);

export class DataPlugin {
   private _name: string;
   private _folderPath: string;
   private _scriptPath: string;
   private _language: Languages;
   private _baseTemplate: string;
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

   set folderPath(folderPath: string) {
      this._folderPath = folderPath;
   }

   get scriptPath(): string {
      return this._scriptPath;
   }

   set scriptPath(scriptPath: string) {
      this._scriptPath = scriptPath;
   }

   get language(): Languages {
      return this._language;
   }

   set language(language: Languages) {
      this._language = language;
   }

   get baseTemplate(): string {
      return this._baseTemplate;
   }

   get fileExtensions(): FileExtensions[] {
      return this._fileExtensions;
   }

   set fileExtensions(fileExtensionss: FileExtensions[]) {
      this._fileExtensions = fileExtensionss;
   }

   constructor(name: string, baseTemplate: string, language: Languages) {
      this._name = name;
      this._baseTemplate = baseTemplate;
      this._language = language;
      this._folderPath = `${dataPluginFolder}\\${name}`;
      this._scriptPath = `${dataPluginFolder}\\${name}\\${baseTemplate}.py`;

      if (fs.existsSync(this.scriptPath)) {
         throw new FileExistsError(config.extPrefix + 'Example file already exists');
      } else {
         this.createMainPy();
      }
   }

   // public static async exportPlugin(uri: vscode.Uri[], fileExtensions: string) {
   //    const pluginName = path.basename(path.dirname(uri[0].fsPath));
   //    const options: vscode.SaveDialogOptions = {
   //       defaultUri: vscode.Uri.parse(`${dataPluginFolder}\\${pluginName}`),
   //       filters: { 'Uri': ['uri'] },
   //    };

   //    if (`${config.exportPath}` !== '') {
   //       fileutils.createFolderSync(`${config.exportPath}`);
   //       this.writeUriFile(uri, fileExtensions, undefined);
   //    } else {
   //       await vscode.window.showSaveDialog({ ...options }).then(fileInfos => {
   //          if (!fileInfos) {
   //             return;
   //          }
   //          this.writeUriFile(uri, fileExtensions, fileInfos.fsPath);
   //       });
   //    }
   // }

   // public static async writeUriFile(uri: vscode.Uri[], fileExtensions: string, newExportPath: string | undefined): Promise<string> {
   //    const pythonScriptPath = uri[0].fsPath;
   //    const dirName = path.basename(path.dirname(pythonScriptPath));
   //    let exportPath: string;

   //    if (newExportPath === undefined) {
   //       exportPath = `${config.exportPath}\\${dirName}.uri`;
   //    } else {
   //       exportPath = newExportPath;
   //    }

   //    const uriTemplate = new UriTemplate(fileExtensions, `${dirName}.uri`, pythonScriptPath);

   //    try {
   //       await fs.writeFile(exportPath, uriTemplate.templateString, { flag: 'w' });
   //    } catch (e) {
   //       throw new Error(`${config.extPrefix} Failed to export DataPlugin!`);
   //    }

   //    const result = await vscode.window.showInformationMessage(`${config.extPrefix} Sucessfully exported DataPlugin`, 'Open in Explorer', 'Register DataPlugin');
   //    if (result === 'Open in Explorer') {
   //       await open(path.dirname(exportPath));
   //    }
   //    if (result === 'Register DataPlugin') {
   //       await open(exportPath);
   //    }

   //    return Promise.resolve(exportPath);
   // }

   public async createMainPy(): Promise<void> {
      try {
         return fs.copy(path.join(dirNamePath, 'examples', this.baseTemplate), path.join(this.folderPath));
      } catch (e) {
         throw new Error(config.extPrefix + 'Failed to create DataPlugin!');
      }
   }

   public pluginIsInitialized(): Promise<boolean> {
      return new Promise((resolve, reject) => {
         let isInitialized: boolean = fs.existsSync(this.scriptPath);

         const interval = setInterval(() => {
            if (!isInitialized) {
               isInitialized = fs.existsSync(this.scriptPath);
            } else {
               clearInterval(interval);
               resolve(true);
            }
         }, 500);
      });
   }
}