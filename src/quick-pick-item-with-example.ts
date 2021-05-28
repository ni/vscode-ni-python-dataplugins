import * as vscode from 'vscode';
import { Example } from './example';

export interface QuickPickItemWithExample extends vscode.QuickPickItem {
   example?: Example;
}