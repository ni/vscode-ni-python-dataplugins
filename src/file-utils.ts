import * as fs from 'fs';

export function createFolderSync(folder: string) {
   if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
   }
}