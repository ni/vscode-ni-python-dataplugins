import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';
import * as fileutils from '../../file-utils';

suite('File-Utils Test Suite', () => {
    void vscode.window.showInformationMessage('Start File-Utils tests.');

    test('should return correct values when reading file extension config', async () => {
        let fileExtensions: string;
        const filePath: string = path.join(__dirname, '.file-extensions');

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await assert.rejects(fileutils.readFileExtensionConfig(__dirname), /file not found/);

        await fs.writeFile(filePath, '*.csv,*.txt');
        fileExtensions = await fileutils.readFileExtensionConfig(__dirname);
        assert.ok(fileExtensions === '*.csv,*.txt');

        await fs.writeFile(filePath, '');
        fileExtensions = await fileutils.readFileExtensionConfig(__dirname);
        assert.ok(fileExtensions === '');
    }).timeout(10000);

    test('should correctly return the first line of a file', async () => {
        const filePath: string = path.join(__dirname, '../../../', 'package.json');
        const firstLine: string = await fileutils.readFirstLineOfFile(filePath);
        assert.ok(firstLine === '{');
    }).timeout(10000);

    test('should correctly return the file extension from a given file', () => {
        const filePath: string = path.join(__dirname, '../../../', 'package.json');
        const fileExtension = fileutils.getFileExtensionFromFileName(filePath);
        assert.ok(fileExtension === 'json');
        const undefinedExtension = fileutils.getFileExtensionFromFileName('package');
        assert.ok(undefinedExtension === undefined);
    });
});
