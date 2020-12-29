import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Guid } from 'guid-typescript';
import { ActivityBar, InputBox, Workbench, WebDriver, VSBrowser, SideBarView } from 'vscode-extension-tester';

/*
   API Reference: https://github.com/redhat-developer/vscode-extension-tester/wiki/Page-Object-APIs
*/

describe('Basic UI Tests', () => {
   let driver: WebDriver;

   before(() => {
      driver = VSBrowser.instance.driver;
   });

   it('Should export a DataPlugin from a sample workspace', async () => {
      await new Promise(res => setTimeout(res, 5000)); // wait for loading vscode completely
      
      const workspaceDir: string = path.join(__dirname, 'sample_workspace_1');
      fs.existsSync(workspaceDir) && fs.rmdirSync(workspaceDir, { recursive: true });
      fs.mkdirSync(workspaceDir);
      fs.writeFileSync(path.join(workspaceDir, 'dataplugin.py'), 'class Python:')

      const workbench = new Workbench();
      await workbench.executeCommand('Extest: Open Folder');
      await new Promise(res => setTimeout(res, 500));

      const enterFolderName = await driver.wait(() => { return new InputBox(); }, 1000);
      await enterFolderName.setText(workspaceDir);
      await enterFolderName.confirm();
      await new Promise(res => setTimeout(res, 2000));

      const sideBarView = new SideBarView();
      const content = sideBarView.getContent();
      const section = await content.getSection('Open Editors');
      const item = section.findItem('dataplugin.py');
      assert.notStrictEqual(undefined, item);
      // content.findElement()
      // const explorer = await new ActivityBar().getViewControl('Explorer');
      // const view1 = await explorer.openView();


   }).timeout(40000);
});