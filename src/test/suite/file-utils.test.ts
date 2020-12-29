import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';
import * as fileutils from '../../file-utils';

suite('File-Utils Test Suite', () => {
   vscode.window.showInformationMessage('Start File-Utils tests.');

   test('should return correct values when reading file extension config', async () => {
      let fileExtensions: string;
      const filePath: string = path.join(__dirname, '.file-extensions');

      // tslint:disable-next-line
      fs.existsSync(filePath) && fs.unlinkSync(filePath);

      await assert.rejects(fileutils.readFileExtensionConfig(__dirname), /file not found/);

      await fs.writeFile(filePath, '*.csv,*.txt');
      fileExtensions = await fileutils.readFileExtensionConfig(__dirname);
      assert.ok(fileExtensions === '*.csv,*.txt');

      await fs.writeFile(filePath, '');
      fileExtensions = await fileutils.readFileExtensionConfig(__dirname);
      assert.ok(fileExtensions === '');
   }).timeout(10000);
});
