import * as assert from 'assert';
import { InputBox, Workbench, Notification, WebDriver, VSBrowser, NotificationType } from 'vscode-extension-tester';

/*
   API Reference: https://github.com/redhat-developer/vscode-extension-tester/wiki/Page-Object-APIs
*/

describe('Basic UI Tests', () => {
   let driver: WebDriver;

   before(() => {
      driver = VSBrowser.instance.driver;
   });

   it('Should show input box that waits for DataPlugin name to be entered', async () => {
      const workbench = new Workbench();
      await workbench.executeCommand('NI DataPlugins: Create new Python-DataPlugin');
      const enterDataPluginNameInputBox = await driver.wait(() => { return new InputBox(); });
      const placeholderText = await enterDataPluginNameInputBox.getPlaceHolder();
      assert.equal('Please enter your DataPlugin name', placeholderText);
   }).timeout(10000);
});