import * as fs from 'fs-extra';
import * as path from 'path';
import * as readline from 'readline';
import CRC from './crc';
import { UriTemplate, PythonScript } from './uri-template';

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

/**
 * @param scriptPath full file path to script that is exported
 * @param fileExtensions supported file extensions of the DataPlugin
 * @param exportPath full path to
 * @param embedScript embed the script inside uri file
 */
export async function writeUriFile(
    scriptPath: string,
    fileExtensions: string,
    exportPath: string,
    embedScript = false
): Promise<void> {
    const pluginName = path.basename(path.dirname(scriptPath));

    let uriTemplate: UriTemplate;
    if (embedScript) {
        const fileContent = fs.readFileSync(scriptPath, { encoding: 'utf8' });
        const pyScript: PythonScript = {
            content: fileContent,
            checksum: CRC.crc32(fileContent),
            fullPath: scriptPath
        };
        uriTemplate = new UriTemplate(pluginName, pyScript, fileExtensions);
    } else {
        uriTemplate = new UriTemplate(pluginName, scriptPath, fileExtensions);
    }

    await fs.writeFile(exportPath, uriTemplate.templateString, { flag: 'w' });
}
