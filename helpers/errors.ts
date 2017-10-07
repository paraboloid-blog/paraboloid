export class ExprError extends Error {

  constructor(private m: string, private _status?: number) {
    super(m);
  }
  get status() {
    return this._status;
  }
}
