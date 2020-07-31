import { Injectable } from '@angular/core';
import {ChatModel} from '../models/chat.model';
import {MessageModal} from '../models/message.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonDataHolderService {
  currentUser: any = {};
  messages: MessageModal [] = [];
  contactHolder: ChatModel [] = [];
  messageUpdater: Subject<MessageModal[]> = new Subject<MessageModal[]>();
  constructor() { }

  processMessages(data): void{
    const {messages, _id} = data;
    messages.map(
      (message) => {
        let me = false
        if (message.from._id === _id){ me = true; }
        const newMessage = new MessageModal(
          message._id,
          message.message,
          'text',
          message.from.name,
          me,
          message.timestamp,
        );
        this.messages.push(newMessage);
        this.messageUpdater.next(this.messages);
      }
    );
  }

  updateMessages(message, me = false): void {
    console.log(message);
    const newMessage = new MessageModal(
      message._id,
      message.message,
      'text',
      message.from.name,
      me,
      message.timestamp,
    );

    this.messages.push(newMessage);
    this.messageUpdater.next(this.messages);
  }

  dateTimeConverter(timestamp): string{
    const months = {
      0: 'Jan',
      1: 'Feb',
      2: 'Mar',
      3: 'Api',
      4: 'May',
      5: 'Jun',
      6: 'Jul',
      7: 'Aug',
      8: 'Sep',
      9: 'Oct',
      10: 'Nov',
      11: 'Dec'
    }
    const date = new Date(timestamp * 1000);
// Hours part from the timestamp
    const hours = date.getHours();
// Minutes part from the timestamp
    const minutes = '0' + date.getMinutes();
// Seconds part from the timestamp
    const seconds = '0' + date.getSeconds();

// Will display time in 10:30:23 format
    return `${date.getDate()}-${months[date.getMonth() + 1] }-${date.getFullYear()} ${hours}:${ minutes.substr(-2)}:${seconds.substr(-2)}`;
  }
}
