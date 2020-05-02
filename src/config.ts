import * as homedir from 'os';

export const userDocuments = homedir.homedir + '\\Documents';
export const dataPluginFolder = userDocuments + '\\NI_DataPlugin';
export const extPrefix: string = 'NI DataPlugins: ';