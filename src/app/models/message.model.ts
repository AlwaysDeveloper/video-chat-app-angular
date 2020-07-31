export class MessageModal {
  // tslint:disable-next-line:variable-name
  _id: string;
  message: string;
  type: string;
  from: string;
  me: boolean;
  timestamp: number;

  constructor(id: string, message: string, type: string = 'text', from: string = '', me: boolean, timestamp: number) {
    this._id = id;
    this.message = message;
    this.type = type;
    this.from = from;
    this.me = me;
    this.timestamp = timestamp;
  }
}
