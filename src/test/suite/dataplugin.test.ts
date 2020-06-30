import * as assert from 'assert';
import * as vscode from 'vscode';
import * as config from '../../config';
import { DataPlugin } from '../../dataplugin';
import { Languages } from '../../plugin-languages.enum';

suite('DataPlugin Test Suite', () => {
   vscode.window.showInformationMessage('Start DataPlugin tests.');

   test('should be able to create class', () => {
      const directDataPlugin: DataPlugin = new DataPlugin('DirectDataPlugin', true, Languages.Python);
      const indirectDataPlugin: DataPlugin = new DataPlugin('IndirectDataPlugin', false, Languages.Python);

      assert.ok(directDataPlugin.name === 'DirectDataPlugin');
      assert.ok(directDataPlugin.exampleDataFile === `${config.dataPluginFolder}\\${directDataPlugin.name}\\Example.csv`);
      assert.ok(directDataPlugin.language === Languages.Python);
      assert.ok(directDataPlugin.direct === true);
      assert.ok(directDataPlugin.scriptPath === `${config.dataPluginFolder}\\${directDataPlugin.name}\\Main.py`);
      assert.ok(indirectDataPlugin.direct === false);
   });
});
