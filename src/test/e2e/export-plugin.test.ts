import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ActivityBar, EditorView, InputBox, SideBarView, Workbench, WebDriver, VSBrowser } from 'vscode-extension-tester';

/*
   API Reference: https://github.com/redhat-developer/vscode-extension-tester/wiki/Page-Object-APIs
*/

describe('Basic UI Tests', () => {
   let browser: VSBrowser;
   let driver: WebDriver;

   before(() => {
      browser = VSBrowser.instance;
      driver = VSBrowser.instance.driver;
   });

   it('Should export a DataPlugin from a sample workspace', async () => {
      await new Promise(res => setTimeout(res, 5000)); // wait for loading vscode completely

      // Prepare Workspace
      const workspaceDir: string = path.join(__dirname, 'sample_workspace_1');
      fs.existsSync(workspaceDir) && fs.rmdirSync(workspaceDir, { recursive: true });
      fs.mkdirSync(workspaceDir);
      fs.writeFileSync(path.join(workspaceDir, 'dataplugin.py'), 'class Plugin:')

      // init
      const workbench = new Workbench();

      // Open Workspace      
      await workbench.executeCommand('Extest: Open Folder');
      await new Promise(res => setTimeout(res, 500));

      // Enter Workspace path
      const enterFolderName = await driver.wait(() => { return new InputBox(); }, 1000);
      await enterFolderName.setText(workspaceDir);
      await enterFolderName.confirm();
      await new Promise(res => setTimeout(res, 2000));

      // Open Explorer side bar
      const sideBarView = new SideBarView();
      const explorer = await new ActivityBar().getViewControl('Explorer');
      await explorer.openView();

      // Find python file
      const content = await sideBarView.getContent();
      const section = await content.getSection('Untitled (Workspace)');
      await section.openItem('sample_workspace_1');
      const item = await section.findItem('dataplugin.py');
      assert.notStrictEqual(undefined, item);
      await new Promise(res => setTimeout(res, 2000));

      // Ensure the remaining workflow is not disrupted by popping editor tabs from other extensions
      const editorView = new EditorView();
      await editorView.closeAllEditors();
      await new Promise(res => setTimeout(res, 2000));

      // Delete file extensions settings
      const fileExtension = path.join(workspaceDir, '.file-extensions');
      fs.existsSync(fileExtension) && fs.unlinkSync(fileExtension);

      // Open ContextMenu and click Export
      const menu = await item?.openContextMenu();
      const menuItem = await menu?.getItem('NI DataPlugins: Export DataPlugin');
      assert.notStrictEqual(undefined, menuItem);
      await menuItem?.select();

      // Choose File Extension
      const fileExtensionInputBox = await driver.wait(() => { return new InputBox(); }, 1000);
      const placeholderText = await fileExtensionInputBox.getPlaceHolder();
      assert.strictEqual('*.tdm; *.xls ...', placeholderText);
      await fileExtensionInputBox.setText('*.csv');
      await fileExtensionInputBox.cancel();

      // Write .file-extensions file      
      fs.writeFileSync(fileExtension, '*.csv')

      // Click Export again, this time no file extension prompt should show up
      const menu2 = await item?.openContextMenu();
      const menuItem2 = await menu2?.getItem('NI DataPlugins: Export DataPlugin');
      await menuItem2?.select();
      const checkForInputBoxAgain = await driver.wait(() => { return new InputBox(); }, 1000);
      const isDisplayed = await checkForInputBoxAgain.isDisplayed();
      assert.strictEqual(false, isDisplayed);

   }).timeout(40000);
});