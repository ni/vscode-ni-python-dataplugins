import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import * as config from '../../config';
import * as vscu from '../../vscode-utils';
import { after } from 'mocha';
import { DataPlugin } from '../../dataplugin';
import { ErrorType } from '../../dataplugin-error';
import { Guid } from 'guid-typescript';
import { Languages } from '../../plugin-languages.enum';

suite('DataPlugin Test Suite', () => {
   const dataPluginsToClean: DataPlugin[] = [];
   vscode.window.showInformationMessage('Start DataPlugin tests.');

   after(() => {
      vscode.window.showInformationMessage('All tests done!');
      dataPluginsToClean.forEach((dataPlugin) => {
         vscu.disposeDataPlugin(dataPlugin);
      });
   });

   test('should create class and initialize', async () => {
      const baseTemplate: string = 'hello-world';
      const randomName: string = Guid.create().toString();
      const dataPlugin: DataPlugin = new DataPlugin(randomName, baseTemplate, Languages.Python);
      await dataPlugin.pluginIsInitialized();
      dataPluginsToClean.push(dataPlugin);

      assert.ok(dataPlugin.name === randomName);
      assert.ok(dataPlugin.language === Languages.Python);
      assert.ok(dataPlugin.baseTemplate === baseTemplate);
      assert.ok(dataPlugin.scriptPath === `${config.dataPluginFolder}\\${dataPlugin.name}\\${baseTemplate}.py`);
   }).timeout(10000);

   test('should be able to create every template as class', async () => {
      const examples: string[] = vscu.loadExamples();
      for (const example of examples) {
         const randomName: string = Guid.create().toString();
         const examplesName: string = path.basename(example);
         const dataPlugin: DataPlugin = new DataPlugin(randomName, examplesName, Languages.Python);
         await dataPlugin.pluginIsInitialized();
         dataPluginsToClean.push(dataPlugin);

         assert.ok(dataPlugin.name === randomName);
         assert.ok(dataPlugin.language === Languages.Python);
         assert.ok(dataPlugin.baseTemplate === examplesName);
         assert.ok(dataPlugin.scriptPath === `${config.dataPluginFolder}\\${dataPlugin.name}\\${examplesName}.py`);
      }
   }).timeout(10000);

   test('should throw FileExistsError', async () => {
      const randomName: string = Guid.create().toString();
      const dataPlugin: DataPlugin = new DataPlugin(randomName, 'hello-world', Languages.Python);
      await dataPlugin.pluginIsInitialized();
      try {
         // tslint:disable-next-line: no-unused-expression
         new DataPlugin(randomName, 'hello-world', Languages.Python);
      } catch (e) {
         assert.equal(e.errorType, ErrorType.FILEEXISTS);
      }
   });
});
