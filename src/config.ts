import * as homedir from 'os';
import * as vscode from 'vscode';

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
export const userDocuments = `${homedir.homedir}\\Documents`;
export const dataPluginFolder = `${userDocuments}\\NI_DataPlugin`;
export const extPrefix = 'NI DataPlugins: ';
// eslint-disable-next-line operator-linebreak
export const niConfig: vscode.WorkspaceConfiguration =
    vscode.workspace.getConfiguration('NI-DataPlugins');
export const exportPath: string | undefined = niConfig.get('PluginExportPath');
