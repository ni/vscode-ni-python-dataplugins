import * as fileutils from './file-utils';
export class Example {
   private _folder: string;
   private _name: string;

   public get folder() {
      return this._folder;
   }

   public get name() {
      return this._name;
   }

   public getScriptPath() {
      return `${this._folder}\\${this._name}\\${this._name}.py`;
   }

   constructor(folder: string, name: string) {
      this._folder = folder;
      this._name = name;
   }

   public async getDetails(): Promise<string> {
      return (await fileutils.readFirstLineOfFile(this.getScriptPath())).substring(2);
   }
}