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
            `<usireginfo version="${UriTemplate.usiCompatibilityVersion}"><storetype name="${dataPluginName}">` +
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
            `<script>${scriptPath}</script><lastexporttime>123</lastexporttime>]]></easypluginparam>` +
            '</storetype></usireginfo>';

        const uriTemplate = new UriTemplate('MyDataPlugin', 'C:/temp/script.py', '*.csv', 123);
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
            `<usireginfo version="${UriTemplate.usiCompatibilityVersion}"><storetype name="${dataPluginName}">` +
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
            `<script>@USIPLUGINDIREX@DataPlugins\\${dataPluginName}\\script.py</script><lastexporttime>123</lastexporttime>]]></easypluginparam>` +
            `<files><file name="script.py"><![CDATA[${pythonScript.content}]]>` +
            `<checksum>${pythonScript.checksum}</checksum></file></files></storetype></usireginfo>`;

        const uriTemplate = new UriTemplate('MyDataPlugin', pythonScript, '*.csv', 123);
        const templateString = uriTemplate.templateString;
        assert.strictEqual(comparison, templateString);
    }).timeout(10000);

    test('should return a USI compatibility version with semantic formatting', () => {
        const usiCompatibilityVersion = UriTemplate.usiCompatibilityVersion;
        const split = usiCompatibilityVersion.split('.');
        assert.strictEqual(split.length, 3);
    });
});
