import { StatusBarItem, window, TextDocument, workspace, env, StatusBarAlignment } from 'vscode';
import * as debounce from 'lodash.debounce';

export class ComboMode {

  private comboStatusBarItem: StatusBarItem;
  private recordStatusBarItem: StatusBarItem;
  private currentCombo: number;
  private currentComboRecord: number;
  private newRecord: boolean;
  private debounceEndCombo: any;
  private active: boolean;

  constructor() {

    this.currentComboRecord = this.getComboRecord(); 
    const comboTimeout = this.getComboTimeout();
    this.endCombo();
    this.debounceEndCombo = debounce(this.endCombo, comboTimeout);
    this.render();

  }

  public enableComboMode() {
    this.active = true;
    this.render();
  }

  public disableComboMode(){
    this.comboStatusBarItem.hide();
    this.recordStatusBarItem.hide();
    this.active = false;
  }
 
  public endCombo() {
    this.currentCombo = 0;
    this.newRecord = false;
    this.render();
  }

  public render() {
    this.renderCombo();
    this.renderComboRecord();
  }

  public renderCombo() {
    // Create a new status bar item if needed
    if (!this.comboStatusBarItem) {
      this.comboStatusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 0);
    }

    // Get active text editor
    let editor = window.activeTextEditor;
    if (!editor) {
      this.comboStatusBarItem.hide();
      return;
    }

    this.comboStatusBarItem.text = `COMBO: ${this.currentCombo}` ;

    if (this.currentCombo > 0) {
      this.comboStatusBarItem.color = 'white';
    }
    else {
      this.comboStatusBarItem.color = '#d1d1d1';
    }
    
    this.comboStatusBarItem.show();

  }

  public renderComboRecord() {
    // Create a new status bar item if needed
    if (!this.recordStatusBarItem) {
      this.recordStatusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 0);
    }

    // Get active text editor
    let editor = window.activeTextEditor;
    if (!editor) {
      this.recordStatusBarItem.hide();
      return;
    }

    this.recordStatusBarItem.text = `${this.newRecord ? 'NEW RECORD': 'RECORD'}: ${this.currentComboRecord}`;
    this.recordStatusBarItem.color = this.newRecord ? '#b6ff63' : 'white';
    
    this.recordStatusBarItem.show();

  }

  public getComboRecord(): number {
    return this.currentComboRecord || 0;
  }

  public increaseCombo() {
    if(!this.active) return;

    this.debounceEndCombo();

    this.currentCombo++;

    // verify record.
    if (this.currentCombo > this.currentComboRecord) {
      this.currentComboRecord = this.currentCombo;
      this.newRecord = true;
    }

    this.render();

  }

  public getComboTimeout() {
     return 1000 * ( workspace.getConfiguration('comboMode').get<number>('comboTimeout') || 2 );
  }

  dispose() {
    this.comboStatusBarItem.dispose();
  }

  

}