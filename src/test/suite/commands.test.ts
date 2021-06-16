import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import * as vscu from '../../vscode-utils';

suite('Commands Test Suite', () => {
    void vscode.window.showInformationMessage('Start Commands tests.');

    test('should be able to run command: nipy.createDataPlugin', done => {
        try {
            void vscode.commands.executeCommand('nipy.createDataPlugin').then(() => {
                done();
            });
        } catch (error) {
            done(new Error(error));
        }
    }).timeout(60000);

    test('should be able to run command: nipy.exportPlugin', done => {
        try {
            void vscode.commands.executeCommand('nipy.exportPlugin').then(() => {
                done();
            });
        } catch (error) {
            done(new Error(error));
        }
    }).timeout(60000);

    test('should be able to run command: nipy.registerPlugin', done => {
        try {
            void vscode.commands.executeCommand('nipy.registerPlugin').then(() => {
                done();
            });
        } catch (error) {
            done(new Error(error));
        }
    }).timeout(60000);

    test('should be able to get the currently open python file', async () => {
        const pythonFile = vscode.Uri.file(
            `${__dirname}/../../../examples/hello_world/hello_world.py`
        );

        const mdFile = vscode.Uri.file(`${__dirname}/../../../examples/hello_world/README.md`);

        await vscode.commands.executeCommand('vscode.open', pythonFile);
        const openFile = vscu.getOpenPythonScript();
        assert.ok(!!openFile);
        assert.strictEqual(path.resolve(pythonFile.fsPath), path.resolve(openFile.fsPath));

        await vscode.commands.executeCommand('vscode.open', mdFile);
        const r = vscu.getOpenPythonScript();
        assert.ok(!r);
    }).timeout(60000);
});
