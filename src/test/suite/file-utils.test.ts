import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';
import * as fileutils from '../../file-utils'

suite('File-Utils Test Suite', () => {
   vscode.window.showInformationMessage('Start File-Utils tests.');

   test('should return correct values when reading file extension config', async () => {
      let fileExtensions: string | undefined;

      fs.unlinkSync(path.join(__dirname, '.file-extensions'));
      fileExtensions = await fileutils.readFileExtensionConfig(__dirname);
      assert.ok(fileExtensions === undefined);

      await fs.writeFile(path.join(__dirname, '.file-extensions'), '*.csv,*.txt');
      fileExtensions = await fileutils.readFileExtensionConfig(__dirname);
      assert.ok(fileExtensions === '*.csv,*.txt');

      await fs.writeFile(path.join(__dirname, '.file-extensions'), '');
      fileExtensions = await fileutils.readFileExtensionConfig(__dirname);
      assert.ok(fileExtensions === undefined);
   }).timeout(10000);
});
