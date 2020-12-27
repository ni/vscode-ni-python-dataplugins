import * as config from './config';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as readline from 'readline';
import { UriTemplate } from './uri-template';

async function readFirstLineOfFile(filePath: string): Promise<string> {
   const rl = readline.createInterface({
      input: fs.createReadStream(filePath)
   });

   return new Promise((resolve) => {
      rl.on('line', (line) => {
         resolve(line);
      });

      rl.on('close', () => {
         resolve('');
      });
   });
}

export function createFolderSync(folder: string) {
   if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
   }
}

export async function readFileExtensionConfig(workspaceDir: string): Promise<string | undefined> {
   const filePath: string = path.join(workspaceDir, '.extensions');
   if (fs.existsSync(filePath)) {
      const head = await readFirstLineOfFile(filePath);
      return Promise.resolve(head != '' ? head : undefined);
   }

   return Promise.resolve(undefined);
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