import * as path from 'path';
import * as fs from 'fs-extra';
import { UriTemplate } from './uri-template';

export function createFolderSync(folder: string) {
   if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
   }
}

export async function writeUriFile(scriptPath: string, fileExtensions: string, exportPath: string): Promise<void> {
   const dirName = path.basename(path.dirname(scriptPath));
   const uriTemplate = new UriTemplate(`${dirName}`, scriptPath, fileExtensions);

   try {
      return fs.writeFile(exportPath, uriTemplate.templateString, { flag: 'w' });
   } catch (e) {
      throw e;
   }
}