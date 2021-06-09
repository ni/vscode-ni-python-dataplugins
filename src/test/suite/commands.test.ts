import * as vscode from 'vscode';

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
});
