import * as assert from 'assert';
import * as vscode from 'vscode';
import { UriTemplate, PythonScript } from '../../uri-template';

suite('URI-Template Test Suite', () => {
    void vscode.window.showInformationMessage('Start URI template tests.');

    test('should correctly construct a uri template that references a script', async () => {
        const dataPluginName = 'MyDataPlugin';
        const scriptPath = 'C:/temp/script.py';
        const fileExtensions = '*.csv';

        const comparison =
            `<usireginfo><storetype name="${dataPluginName}">` +
            '<type>python</type>' +
            `<alias>${dataPluginName}</alias>` +
            `<description>${dataPluginName}</description>` +
            '<filepath>uspTdmMarshaller.dll</filepath>' +
            '<exportsupported>NO</exportsupported>' +
            '<caching>YES</caching>' +
            '<querysupported>0</querysupported>' +
            '<fastloadsupported>0</fastloadsupported>' +
            '<platform>x64</platform>' +
            `<filefilters extension="${fileExtensions}"><description>${dataPluginName} Files (${fileExtensions})</description></filefilters>` +
            '<easypluginparam><![CDATA[<dllpath>@USIBINDIR@\\PythonMarshaller\\uspPythonMarshaller.dll</dllpath>' +
            `<script>${scriptPath}</script>]]></easypluginparam>` +
            '</storetype></usireginfo>';

        const uriTemplate = new UriTemplate('MyDataPlugin', 'C:/temp/script.py', '*.csv');
        const templateString = uriTemplate.templateString;
        assert.strictEqual(comparison, templateString);
    }).timeout(10000);

    test('should correctly construct a uri template that embeds a script', async () => {
        const dataPluginName = 'MyDataPlugin';
        const scriptPath = 'C:/temp/script.py';
        const fileExtensions = '*.csv';
        const pythonScript: PythonScript = {
            content: 'class Plugin:',
            checksum: 1698750118,
            fullPath: scriptPath
        };

        const comparison =
            `<usireginfo><storetype name="${dataPluginName}">` +
            '<type>python</type>' +
            `<alias>${dataPluginName}</alias>` +
            `<description>${dataPluginName}</description>` +
            '<filepath>uspTdmMarshaller.dll</filepath>' +
            '<exportsupported>NO</exportsupported>' +
            '<caching>YES</caching>' +
            '<querysupported>0</querysupported>' +
            '<fastloadsupported>0</fastloadsupported>' +
            '<platform>x64</platform>' +
            `<filefilters extension="${fileExtensions}"><description>${dataPluginName} Files (${fileExtensions})</description></filefilters>` +
            '<easypluginparam><![CDATA[<dllpath>@USIBINDIR@\\PythonMarshaller\\uspPythonMarshaller.dll</dllpath>' +
            `<script>@USIPLUGINDIREX@DataPlugins\\${dataPluginName}\\script.py</script>]]></easypluginparam>` +
            `<files><file name="script.py"><![CDATA[${pythonScript.content}]]>` +
            `<checksum>${pythonScript.checksum}</checksum></file></files></storetype></usireginfo>`;

        const uriTemplate = new UriTemplate('MyDataPlugin', pythonScript, '*.csv');
        const templateString = uriTemplate.templateString;
        assert.strictEqual(comparison, templateString);
    }).timeout(10000);
});
