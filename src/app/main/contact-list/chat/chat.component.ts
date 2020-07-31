import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChatModel} from '../../../models/chat.model';
import {SocketioService} from '../../../services/socketio.service';
import {Fontawesome6Service} from '../../../services/fontawesome6.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() chat: ChatModel;
  @Output('selectedChat') chatSelected: EventEmitter<any> = new EventEmitter<any>()
  faOnline;
  faOffline;
  constructor(private socket: SocketioService, private fontawesome: Fontawesome6Service) {
    this.faOnline = this.fontawesome.getFontSolid('faCircle');
    this.faOffline = this.fontawesome.getFontRegular('faCircle');
  }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  selectAndCall(event){
    this.chatSelected.emit(event.currentTarget.id);
  }
}
