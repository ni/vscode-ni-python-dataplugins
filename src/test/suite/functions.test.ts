import * as vscode from 'vscode';
import * as assert from 'assert';
import * as fs from 'fs';
import { DataPlugin } from '../../dataplugin';
import { Languages } from '../../plugin-languages.enum';

suite('Function Test Suite', () => {
   vscode.window.showInformationMessage('Start Function tests.');

   test('should be able to run command: nipy.writePlugin', async (done) => {
      const directDataPlugin: DataPlugin = new DataPlugin('default-script-direct-1234', 'default-script-direct', Languages.Python);
      directDataPlugin.pluginIsInitialized()
         .then(() => {
            const exportPath: string = directDataPlugin.folderPath + '\\DirectDataPlugin.uri';

            const pluginUri: vscode.Uri = vscode.Uri.file(directDataPlugin.scriptPath);
            const pluginUriArray: vscode.Uri[] = [pluginUri];
            // TODO test is stuck because info message cannot be clicked
            DataPlugin.writePlugin(pluginUriArray, '*.tdm', `${exportPath}`)
               .then(() => {
                  assert.ok(fs.existsSync(exportPath));
                  done();
               });
         });
   }).timeout(10000);
});