import * as homedir from 'os';
import * as vscode from 'vscode';

export const userDocuments = homedir.homedir + '\\Documents';
export const dataPluginFolder = userDocuments + '\\NI_DataPlugin';
export const extPrefix: string = 'NI DataPlugins: ';
export const niConfig : vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('NI-DataPlugins');
export const exportPath : string | undefined = niConfig.get('PluginExportPath');