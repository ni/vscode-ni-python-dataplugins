import * as assert from 'assert';
import { Workbench, Notification, WebDriver, VSBrowser, NotificationType } from 'vscode-extension-tester';

describe('Open VSCode', () => {
   let driver: WebDriver;

   before(() => {
      driver = VSBrowser.instance.driver;
   });

   it('Open VSCode', async () => {
      const workbench = new Workbench();
      await workbench.executeCommand('NI DataPlugins: Create new Python-DataPlugin');
      // const notification = await driver.wait(() => { return notificationExists('Hello'); }, 2000) as Notification;
      assert.ok(true);
   }).timeout(10000);
});

async function notificationExists(text: string): Promise<Notification | undefined> {
   const notifications = await new Workbench().getNotifications();
   for (const notification of notifications) {
      const message = await notification.getMessage();
      if (message.indexOf(text) >= 0) {
         return notification;
      }
   }
}