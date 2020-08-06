import * as assert from 'assert';
import * as vscode from 'vscode';
import * as config from '../../config';
import * as vscu from '../../vscode-utils';
import * as path from 'path';
import { DataPlugin } from '../../dataplugin';
import { Languages } from '../../plugin-languages.enum';

suite('DataPlugin Test Suite', () => {
   vscode.window.showInformationMessage('Start DataPlugin tests.');

   test('should be able to create every template as class', () => {
      const examples: string[] = vscu.loadExamples();
      const examplesNames: string[] = new Array();
      for (let i = 0; i < examples.length; i++) {
         examplesNames[i] = path.basename(examples[i]);
         const dataPlugin: DataPlugin = new DataPlugin(examplesNames[i], examplesNames[i], Languages.Python);
         assert.ok(dataPlugin.name === examplesNames[i]);
         assert.ok(dataPlugin.language === Languages.Python);
         assert.ok(dataPlugin.example === examplesNames[i]);
         assert.ok(dataPlugin.scriptPath === `${config.dataPluginFolder}\\${dataPlugin.name}\\${examplesNames[i]}.py`);
      }
   });
});
