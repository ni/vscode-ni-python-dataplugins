import * as path from 'path';

export interface PythonScript {
    content: string;
    checksum: number;
    fullPath: string;
}

export class UriTemplate {
    private readonly _templateString: string = '';
    /**
     * @param dataPluginName name of DataPlugin and uri
     * @param pythonScript full file path to script or object of file content, crc32 and name
     * @param fileExtensions supported file extensions of the DataPlugin
     */
    public constructor(
        dataPluginName: string,
        pythonScript: string | PythonScript,
        fileExtensions: string
    ) {
        this._templateString =
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
            '<easypluginparam><![CDATA[<dllpath>@USIBINDIR@\\PythonMarshaller\\uspPythonMarshaller.dll</dllpath>';

        if (typeof pythonScript === 'string') {
            this._templateString += `<script>${pythonScript}</script>]]></easypluginparam>`;
        } else {
            const pyScriptName: string = path.basename(pythonScript.fullPath);
            this._templateString +=
                `<script>@USIPLUGINDIREX@DataPlugins\\${dataPluginName}\\${pyScriptName}</script>]]></easypluginparam>` +
                `<files><file name="${pyScriptName}"><![CDATA[${pythonScript.content}]]>` +
                `<checksum>${pythonScript.checksum}</checksum></file></files>`;
        }

        this._templateString += '</storetype></usireginfo>';
    }

    /**
        Returns the uri template
     */
    public get templateString(): string {
        return this._templateString;
    }
}
