'use strict';
import * as vscode from 'vscode';
import { ComboMode } from './core/combo-mode';

export function activate(context: vscode.ExtensionContext) {

  const comboMode = new ComboMode();

  vscode.workspace.onDidChangeTextDocument(e => {
    comboMode.increaseCombo();
  });

  let enableComboModeDisposable = vscode.commands.registerCommand('extension.enableComboMode', () => {
    comboMode.enableComboMode();
    vscode.window.showInformationMessage('Combo Mode Enabled! Start Coding!', {modal: true});
  });

  let disableComboModeDisposable = vscode.commands.registerCommand('extension.disableComboMode', () => {
    comboMode.disableComboMode();
    vscode.window.showInformationMessage('Combo Mode Disabled! Relax!', {modal: true});
  });

  context.subscriptions.push(enableComboModeDisposable);
  context.subscriptions.push(disableComboModeDisposable);
}

export function deactivate() {}