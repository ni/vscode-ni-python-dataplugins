export interface PythonScript {
    content: string;
    checksum: number;
}

export class UriTemplate {
    private readonly _templateString: string = '';
    /**
     * @param fileName file name of script
     * @param pythonScript full file path to script or file content and its crc32 checksum
     * @param fileExtensions supported file extensions of the DataPlugin
     */
    public constructor(
        fileName: string,
        pythonScript: string | PythonScript,
        fileExtensions: string
    ) {
        if (typeof pythonScript === 'string') {
            this._templateString =
                `<usireginfo><storetype name="${fileName}">` +
                '<type>python</type>' +
                `<alias>${fileName}</alias>` +
                `<description>${fileName}</description>` +
                '<filepath>uspTdmMarshaller.dll</filepath>' +
                '<exportsupported>NO</exportsupported>' +
                '<caching>YES</caching>' +
                `<easypluginparam><![CDATA[<dllpath>@USIBINDIR@\\PythonMarshaller\\uspPythonMarshaller.dll</dllpath><script>${pythonScript}</script>]]></easypluginparam>` +
                '<querysupported>0</querysupported>' +
                '<fastloadsupported>0</fastloadsupported>' +
                `<filefilters extension="${fileExtensions}"><description>${fileName} Files (${fileExtensions})</description></filefilters>` +
                '<platform>x64</platform></storetype></usireginfo>';
        } else {
            this._templateString =
                `<usireginfo><storetype name="${fileName}">` +
                '<type>python</type>' +
                `<alias>${fileName}</alias>` +
                `<description>${fileName}</description>` +
                '<filepath>uspTdmMarshaller.dll</filepath>' +
                '<exportsupported>NO</exportsupported>' +
                '<caching>YES</caching>' +
                `<easypluginparam><![CDATA[<dllpath>@USIBINDIR@\\PythonMarshaller\\uspPythonMarshaller.dll</dllpath><script>${pythonScript.content}</script>]]></easypluginparam>` +
                '<querysupported>0</querysupported>' +
                '<fastloadsupported>0</fastloadsupported>' +
                `<filefilters extension="${fileExtensions}"><description>${fileName} Files (${fileExtensions})</description></filefilters>` +
                '<platform>x64</platform></storetype></usireginfo>';
        }
    }

    /**
        Returns the uri template
     */
    public get templateString(): string {
        return this._templateString;
    }
}
