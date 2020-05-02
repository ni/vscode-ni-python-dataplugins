
import * as fs from 'fs';
import * as path from 'path';
import * as open from 'open';
import * as vscode from 'vscode';
import * as yaml from 'js-yaml';
import * as config from './config';
import * as vscu from './vscode-utils';
import { FileExtensions } from './file-extensions.enum';
import { Languages } from './plugin-languages.enum';

const DataPluginFolder = config.dataPluginFolder;
const listPath = path.join(path.dirname(__dirname), 'scriptPathsList.yml');

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
      this._scriptPath = `${DataPluginFolder}\\${name}\\Main.py`;
      this._exampleDataFile = `${DataPluginFolder}\\${name}\\Example.csv`;

      vscu.createFolder(`${DataPluginFolder}\\${name}`);

      if (!fs.existsSync(this.scriptPath)) {
         // Reads the default-script-indirect.py and writes the content in the new file Main.py
         if (direct === false) {
            fs.readFile(path.join(path.dirname(__dirname), 'default-script-indirect.py'), async (err, content) => {
               if (err) { throw err; }
               fs.writeFile(path.join(this.scriptPath), content, async err => {
                  if (err) { return vscode.window.showErrorMessage(config.extPrefix + 'Failed to create indirect DataPlugin!'); }
                  // vscode.window.showInformationMessage(prefix + 'Successfully created indirect Main.py');
                  DataPlugin.updateList(this.name, this.scriptPath);
                  await DataPlugin.showDataPluginInVSCode(DataPluginFolder, name, this._scriptPath);
               });
            });
         }
         // Reads the default-script-direct.py and writes the content in the new file Main.py
         if (direct === true) {
            fs.readFile(path.join(path.dirname(__dirname), 'default-script-direct.py'), (err, content) => {
               if (err) { throw err; }
               fs.writeFile(path.join(this.scriptPath), content, async err => {
                  if (err) { return vscode.window.showErrorMessage(config.extPrefix + 'Failed to create direct DataPlugin!'); }
                  vscode.window.showInformationMessage(config.extPrefix + 'Template files created');
                  DataPlugin.updateList(this.name, this.scriptPath);
                  await DataPlugin.showDataPluginInVSCode(DataPluginFolder, name, this._scriptPath);
               });
            });
         }
         // Reads the example.csv and writes the content in the new file
         fs.readFile(path.join(path.dirname(__dirname), 'example.csv'), (err, content) => {
            if (err) { throw err; }
            fs.writeFile(path.join(this.exampleDataFile), content, async err => {
               if (err) { return vscode.window.showErrorMessage(config.extPrefix + 'Failed to create example file!'); }
            });
         });
      } else {
         vscode.window.showInformationMessage(config.extPrefix + 'Example file already exists');
         DataPlugin.showDataPluginInVSCode(DataPluginFolder, name, this._scriptPath);
      }
   }

   public static async exportPlugin(uri: vscode.Uri[], fileExtensions: string) {
      const options: vscode.SaveDialogOptions = {
         defaultUri: vscode.Uri.parse(DataPluginFolder),
         filters: { 'Uri': ['uri'] },
      };

      const pythonScriptPath = uri[0].fsPath;

      await vscode.window.showSaveDialog({ ...options }).then(fileInfos => {
         if (fileInfos !== undefined) {
            fs.readFile(uri[0].fsPath, (err, content) => {
               if (err) { throw err; }

               const fileName = path.basename(fileInfos.fsPath, path.extname(fileInfos.fsPath)); // Gets the fileName without extension and path.
               fs.writeFile(fileInfos.fsPath, `<usireginfo><storetype name="${fileName}"><type>python</type><alias>${fileName}</alias><description>${fileName}</description><filepath>uspTdmMarshaller.dll</filepath><exportsupported>NO</exportsupported><caching>YES</caching><easypluginparam><![CDATA[<dllpath>@USIBINDIR@\\PythonMarshaller\\uspPythonMarshaller.dll</dllpath><script>${pythonScriptPath}</script>]]></easypluginparam><querysupported>0</querysupported><fastloadsupported>0</fastloadsupported><filefilters extension="${fileExtensions}"><description>${fileName} Dateien (' + fileExtensions + ')</description></filefilters><platform>x64</platform>`
                  , err => {
                     if (err) { return vscode.window.showErrorMessage(`${config.extPrefix} Failed to export DataPlugin!`); }
                     fs.appendFile(fileInfos.fsPath, '></storetype></usireginfo>', async err => {
                        if (err) { return vscode.window.showErrorMessage(`${config.extPrefix} Failed to export Python script!`); }

                        const result = await vscode.window.showInformationMessage(`${config.extPrefix} Sucessfully exported DataPlugin`, 'Open in Explorer', 'Register DataPlugin');
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

   // Replaces the scriptPathsList.yml file with name and path of the new DataPlugin
   public static async updateList(name: string, filepath: string) {
      const yamlNameStr = yaml.safeDump({ ScriptName: [name], ScriptPath: [filepath] });
      fs.writeFileSync(listPath, yamlNameStr, 'utf8');
   }

   public static async showDataPluginInVSCode(folder: string, name: string, path: string) {
      // Creates the DIAdem folder in the workspace.
      vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.file(`${folder}\\${name}`), name });

      // Opens the VSCode explorer
      await vscode.commands.executeCommand('workbench.view.explorer');
      await vscu.openDocumentAndShow(path);
   }
}