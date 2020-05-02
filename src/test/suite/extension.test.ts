import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
   vscode.window.showInformationMessage('Start Extension tests.');

   test('should be present', () => {
      assert.ok(vscode.extensions.getExtension('NI.vscode-ni-python-dataplugins'));
   });

   test('should be able to activate the extension', function (done) {
      this.timeout(60 * 1000);
      const extension = vscode.extensions.getExtension('NI.vscode-ni-python-dataplugins');
      if (!extension?.isActive) {
         extension?.activate().then(() => {
            done();
         }, () => {
            done('Failed to activate extension');
         });
      } else {
         done();
      }
   });
});
