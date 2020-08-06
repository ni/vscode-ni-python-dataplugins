import * as vscode from 'vscode';
import * as assert from 'assert';
import * as fs from 'fs';
import { DataPlugin } from '../../dataplugin';
import { Languages } from '../../plugin-languages.enum';

suite('Function Test Suite', () => {
    vscode.window.showInformationMessage('Start Function tests.');

    test('should be able to run command: nipy.writePlugin', async () => {
        const directDataPlugin: DataPlugin = new DataPlugin('default-script-direct', 'default-script-direct', Languages.Python);

        const exportPath: string = directDataPlugin.folderPath + '\\DirectDataPlugin.uri';

        const pluginUri: vscode.Uri = vscode.Uri.file(directDataPlugin.scriptPath);
        const pluginUriArray: vscode.Uri[] = [pluginUri];

        DataPlugin.writePlugin(pluginUriArray, '*.tdm', `${exportPath}`).then(() => {
            assert.ok(fs.existsSync(exportPath));
        });
    });
});