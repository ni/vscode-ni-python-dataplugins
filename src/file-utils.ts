import * as fs from 'fs-extra';
import * as path from 'path';
import * as readline from 'readline';
import UriTemplate from './uri-template';

export async function readFirstLineOfFile(filePath: string): Promise<string> {
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath)
    });

    return new Promise(resolve => {
        rl.on('line', line => {
            resolve(line);
        });

        rl.on('close', () => {
            resolve('');
        });
    });
}

export function createFolderSync(folder: string): void {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
}

export async function readFileExtensionConfig(workspaceDir: string): Promise<string> {
    const filePath: string = path.join(workspaceDir, '.file-extensions');
    if (fs.existsSync(filePath)) {
        const head = await readFirstLineOfFile(filePath);
        return Promise.resolve(head);
    }

    return Promise.reject(new Error('file not found'));
}

export function storeFileExtensionConfig(workspaceDir: string, fileExtensions: string): void {
    const filePath: string = path.join(workspaceDir, '.file-extensions');
    if (fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, fileExtensions);
    }
}

export async function writeUriFile(
    scriptPath: string,
    fileExtensions: string,
    exportPath: string
): Promise<void> {
    const dirName = path.basename(path.dirname(scriptPath));
    const uriTemplate = new UriTemplate(`${dirName}`, scriptPath, fileExtensions);
    await fs.writeFile(exportPath, uriTemplate.templateString, { flag: 'w' });
}
