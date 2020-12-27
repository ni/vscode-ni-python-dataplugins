
import * as fs from 'fs-extra';
import * as path from 'path';
import * as config from './config';
import { FileExistsError } from './dataplugin-error';
import { Languages } from './plugin-languages.enum';

const dataPluginFolder = config.dataPluginFolder;
const dirNamePath = path.dirname(__dirname);

export class DataPlugin {
   private _name: string;
   private _folderPath: string;
   private _scriptPath: string;
   private _language: Languages;
   private _baseTemplate: string;

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

   constructor(name: string, baseTemplate: string, language: Languages) {
      this._name = name;
      this._baseTemplate = baseTemplate;
      this._language = language;
      this._folderPath = `${dataPluginFolder}\\${name}`;
      this._scriptPath = `${dataPluginFolder}\\${name}\\${baseTemplate}.py`;

      if (fs.existsSync(this.scriptPath)) {
         throw new FileExistsError(config.extPrefix + 'DataPlugin already exists');
      } else {
         this.createMainPy();
      }
   }

   public async createMainPy(): Promise<void> {
      try {
         const extensionsFile = '.extensions';
         const launchFile = 'launch.json';
         const loadFile = 'diadem_load.py';
         const assetFolder: string = path.join(dirNamePath, 'assets');
         const exampleFolder: string = path.join(dirNamePath, 'examples', this.baseTemplate);

         await fs.copy(exampleFolder, this.folderPath);
         await fs.copy(path.join(assetFolder, extensionsFile), path.join(this.folderPath, extensionsFile));
         await fs.copy(path.join(assetFolder, loadFile), path.join(this.folderPath, '.ni', loadFile));
         await fs.copy(path.join(assetFolder, launchFile), path.join(this.folderPath, '.vscode', launchFile));

         return Promise.resolve();
      } catch (e) {
         throw new Error(config.extPrefix + 'Failed to create DataPlugin!');
      }
   }

   public async pluginIsInitialized(): Promise<boolean> {
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