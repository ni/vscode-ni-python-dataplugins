import * as assert from 'assert';
import { Guid } from 'guid-typescript';
import { InputBox, Workbench, WebDriver, VSBrowser, SideBarView } from 'vscode-extension-tester';

/*
   API Reference: https://github.com/redhat-developer/vscode-extension-tester/wiki/Page-Object-APIs
*/

describe('Basic UI Tests', () => {
   let driver: WebDriver;

   before(() => {
      driver = VSBrowser.instance.driver;
   });

   it('Should create a new DataPlugin project', async () => {
      const randomName: string = Guid.create().toString();
      await new Promise(res => setTimeout(res, 5000)); // wait for loading vscode completely
      const workbench = new Workbench();
      await workbench.executeCommand('NI DataPlugins: Create new Python-DataPlugin');
      await new Promise(res => setTimeout(res, 500));

      // Input box requesting a DataPlugin name?
      const enterDataPluginNameInputBox = await driver.wait(() => { return new InputBox(); }, 1000);
      const placeholderText1 = await enterDataPluginNameInputBox.getPlaceHolder();
      assert.strictEqual('Please enter your DataPlugin name', placeholderText1);
      await enterDataPluginNameInputBox.setText(randomName);
      await enterDataPluginNameInputBox.confirm();
      await new Promise(res => setTimeout(res, 500));

      // Input box requesting a template?
      const chooseTemplateDropDown = await driver.wait(() => { return new InputBox(); }, 1000);
      const placeholderText2 = await chooseTemplateDropDown.getPlaceHolder();
      assert.strictEqual('Please choose a template to start with', placeholderText2);
      await new Promise(res => setTimeout(res, 500));
      await chooseTemplateDropDown.setText('hello_world');
      await chooseTemplateDropDown.confirm();

      // Project with correct name created in SideBar?
      const sideBarView = await driver.wait(() => { return new SideBarView(); }, 5000);
      await new Promise(res => setTimeout(res, 5000));
      const sideBarContent = await sideBarView.getContent().wait();
      const section = await sideBarContent.getSection('Untitled (Workspace)');
      const item = await section.findItem(randomName);
      assert.notStrictEqual(undefined, item);
   }).timeout(40000);
});