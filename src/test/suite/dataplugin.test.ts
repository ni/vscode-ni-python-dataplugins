import * as assert from 'assert';
import * as fs from 'fs-extra';
import { Guid } from 'guid-typescript';
import * as vscode from 'vscode';
import * as config from '../../config';
import * as vscu from '../../vscode-utils';
import * as path from 'path';
import { DataPlugin } from '../../dataplugin';
import { Languages } from '../../plugin-languages.enum';

suite('DataPlugin Test Suite', () => {
   vscode.window.showInformationMessage('Start DataPlugin tests.');

   test('should be able to create every template as class', async () => {
      const examples: string[] = vscu.loadExamples();
      const examplesNames: string[] = new Array();
      for (let i = 0; i < examples.length; i++) {
         examplesNames[i] = path.basename(examples[i]);
         const dataPlugin: DataPlugin = new DataPlugin(examplesNames[i], examplesNames[i], Languages.Python);
         await dataPlugin.pluginIsInitialized();
         assert.ok(dataPlugin.name === examplesNames[i]);
         assert.ok(dataPlugin.language === Languages.Python);
         assert.ok(dataPlugin.baseTemplate === examplesNames[i]);
         assert.ok(dataPlugin.scriptPath === `${config.dataPluginFolder}\\${dataPlugin.name}\\${examplesNames[i]}.py`);
      }
   }).timeout(10000);

   // test('should be able to write plugin', async () => {
   //    const randomName : string = Guid.create().toString();
   //    const dataPlugin: DataPlugin = new DataPlugin(`plugin-${randomName}`, 'default-script-direct', Languages.Python);
   //    await dataPlugin.pluginIsInitialized();
   //    const exportPath: string = `${dataPlugin.folderPath}\\plugin-${randomName}.uri`;

   //    const pluginUri: vscode.Uri = vscode.Uri.file(dataPlugin.scriptPath);
   //    const pluginUriArray: vscode.Uri[] = [pluginUri];
   //    // TODO test is stuck because info message cannot be clicked
   //    await DataPlugin.writeUriFile(pluginUriArray, '*.tdm', `${exportPath}`);
   //    assert.ok(fs.existsSync(exportPath));
   // }).timeout(10000);
});
