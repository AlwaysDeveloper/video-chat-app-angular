export class GroupChatModel {
  // tslint:disable-next-line:variable-name
  _id: string;
  imageLink: string;
  name: string;

  constructor(id: string, image: string, name: string, email: string) {
    this._id = id;
    this.imageLink = image;
    this.name = name;
  }
}
