import { after } from 'mocha';
import { Guid } from 'guid-typescript';
import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import * as config from '../../config';
import * as vscu from '../../vscode-utils';
import Example from '../../example';
import DataPlugin from '../../dataplugin';
import Languages from '../../plugin-languages.enum';
import { ErrorType } from '../../dataplugin-error';

suite('DataPlugin Test Suite', () => {
    const dataPluginsToClean: DataPlugin[] = [];
    void vscode.window.showInformationMessage('Start DataPlugin tests.');

    after(() => {
        void vscode.window.showInformationMessage('All tests done!');
        dataPluginsToClean.forEach(dataPlugin => {
            void vscu.disposeDataPlugin(dataPlugin);
        });
    });

    test('should create class and initialize', async () => {
        const baseTemplate = 'hello_world';
        const randomName: string = Guid.create().toString();
        const dataPlugin: DataPlugin = await DataPlugin.createDataPlugin(
            randomName,
            baseTemplate,
            Languages.Python
        );
        dataPluginsToClean.push(dataPlugin);

        assert.ok(dataPlugin.name === randomName);
        assert.ok(dataPlugin.language === Languages.Python);
        assert.ok(dataPlugin.baseTemplate === baseTemplate);
        assert.ok(
            dataPlugin.scriptPath ===
                path.join(config.dataPluginFolder, dataPlugin.name, `${dataPlugin.name}.py`)
        );
    }).timeout(10000);

    test('should be able to create every template as class', async () => {
        const examples: Example[] = vscu.loadExamples();
        for (const example of examples) {
            const randomName: string = Guid.create().toString();
            const examplesName: string = example.name;
            // eslint-disable-next-line no-await-in-loop
            const dataPlugin: DataPlugin = await DataPlugin.createDataPlugin(
                randomName,
                examplesName,
                Languages.Python
            );

            dataPluginsToClean.push(dataPlugin);

            assert.ok(dataPlugin.name === randomName);
            assert.ok(dataPlugin.language === Languages.Python);
            assert.ok(dataPlugin.baseTemplate === examplesName);
            assert.ok(
                dataPlugin.scriptPath ===
                    path.join(config.dataPluginFolder, dataPlugin.name, `${dataPlugin.name}.py`)
            );
        }
    }).timeout(10000);

    test('should throw FileExistsError', async () => {
        const randomName: string = Guid.create().toString();
        await DataPlugin.createDataPlugin(randomName, 'hello_world', Languages.Python);
        try {
            // eslint-disable-next-line no-new
            await DataPlugin.createDataPlugin(randomName, 'hello_world', Languages.Python);
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            assert.strictEqual(e.errorType, ErrorType.FILEEXISTS);
        }
    });
});
