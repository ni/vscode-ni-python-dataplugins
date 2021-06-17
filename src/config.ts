import * as homedir from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

export const userDocuments = path.join(homedir.homedir(), 'Documents');
export const dataPluginFolder = path.join(userDocuments, 'NI-Python-DataPlugins');
export const extPrefix = 'NI DataPlugins: ';
// eslint-disable-next-line operator-linebreak
export const niConfig: vscode.WorkspaceConfiguration =
    vscode.workspace.getConfiguration('DataPlugins');
export const exportPath: string | undefined = niConfig.get('exportPath');
