import { v7 } from 'uuid';

export class Todo {
  public readonly id: string;
  private _title: string;
  private _description: string;
  private _isComplete: boolean = false;

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get isComplete(): boolean {
    return this._isComplete;
  }

  constructor(title: string, description: string) {
    this.id = v7();
    this._title = title;
    this._description = description;
  }
}
