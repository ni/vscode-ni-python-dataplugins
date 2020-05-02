import * as vscode from 'vscode';

suite('Commands Test Suite', () => {
   vscode.window.showInformationMessage('Start Commands tests.');

   test('should be able to run command: nipy.checkSyntax', function (done) {
      this.timeout(10 * 1000);
      try {
         vscode.commands.executeCommand('nipy.checkSyntax').then(() => {
            done();
         });

      } catch (error) {
         done(new Error(error));
      }
   });

   test('should be able to run command: nipy.createDataPlugin', function (done) {
      this.timeout(10 * 1000);
      try {
         vscode.commands.executeCommand('nipy.createDataPlugin').then(() => {
            done();
         });

      } catch (error) {
         done(new Error(error));
      }
   });

   test('should be able to run command: nipy.exportPlugin', function (done) {
      this.timeout(10 * 1000);
      try {
         vscode.commands.executeCommand('nipy.exportPlugin').then(() => {
            done();
         });

      } catch (error) {
         done(new Error(error));
      }
   });

   test('should be able to run command: nipy.exportPluginFromContextMenu', function (done) {
      this.timeout(10 * 1000);
      try {
         vscode.commands.executeCommand('nipy.exportPluginFromContextMenu').then(() => {
            done();
         });

      } catch (error) {
         done(new Error(error));
      }
   });
});
