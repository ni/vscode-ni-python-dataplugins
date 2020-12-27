export class UriTemplate {

   private _templateString: string = '';
   constructor(fileName: string, pythonScriptPath: string, fileExtensions: string) {
      this._templateString = `<usireginfo><storetype name="${fileName}">` +
         '<type>python</type>' +
         `<alias>${fileName}</alias>` +
         `<description>${fileName}</description>` +
         '<filepath>uspTdmMarshaller.dll</filepath>' +
         '<exportsupported>NO</exportsupported>' +
         '<caching>YES</caching>' +
         `<easypluginparam><![CDATA[<dllpath>@USIBINDIR@\\PythonMarshaller\\uspPythonMarshaller.dll</dllpath><script>${pythonScriptPath}</script>]]></easypluginparam>` +
         '<querysupported>0</querysupported>' +
         '<fastloadsupported>0</fastloadsupported>' +
         `<filefilters extension="${fileExtensions}"><description>${fileName} Files (${fileExtensions})</description></filefilters>` +
         '<platform>x64</platform></storetype></usireginfo>';
   }

   get templateString(): string {
      return this._templateString;
   }
}