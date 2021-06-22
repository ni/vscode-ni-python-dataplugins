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

    test('should correctly reference script and not embed it', async () => {
        const testScript: string = path.join(__dirname, 'test.py');
        const outputUri = path.join(__dirname, 'output.uri');

        if (fs.existsSync(testScript)) {
            fs.unlinkSync(testScript);
        }

        await fs.writeFile(testScript, 'class Plugin:');
        await fileutils.writeUriFile(testScript, '*.csv', outputUri);

        const fileContent = fs.readFileSync(outputUri, { encoding: 'utf8' });
        assert.ok(fileContent.includes('CDATA[class Plugin:]') === false);
        assert.ok(fileContent.includes('1698750118') === false);
    }).timeout(10000);

    test('should correctly embed script in uri file', async () => {
        const testScript: string = path.join(__dirname, 'test.py');
        const outputUri = path.join(__dirname, 'output.uri');

        if (fs.existsSync(testScript)) {
            fs.unlinkSync(testScript);
        }

        await fs.writeFile(testScript, 'class Plugin:');
        await fileutils.writeUriFile(testScript, '*.csv', outputUri, true);

        const fileContent = fs.readFileSync(outputUri, { encoding: 'utf8' });
        assert.ok(fileContent.includes('CDATA[class Plugin:]'));
        assert.ok(fileContent.includes('1698750118'));
    }).timeout(10000);

    test('should correctly replace a string in the main DataPlugin script', async () => {
        const testScript: string = path.join(__dirname, 'test.py');

        if (fs.existsSync(testScript)) {
            fs.unlinkSync(testScript);
        }

        await fs.writeFile(testScript, 'class Plugin:');
        fileutils.replaceStringInScript(testScript, 'class', 'ssalc');

        const fileContent = fs.readFileSync(testScript, { encoding: 'utf8' });
        assert.ok(fileContent.includes('ssalc Plugin:'));
    }).timeout(10000);
});
