import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    void vscode.window.showInformationMessage('Start Extension tests.');

    test('should be present', () => {
        assert.ok(vscode.extensions.getExtension('NI.vscode-ni-python-dataplugins'));
    });

    test('should be able to activate the extension', done => {
        const extension = vscode.extensions.getExtension('NI.vscode-ni-python-dataplugins');
        if (!extension?.isActive) {
            extension?.activate().then(
                () => {
                    done();
                },
                () => {
                    done('Failed to activate extension');
                }
            );
        } else {
            done();
        }
    }).timeout(60000);
});
