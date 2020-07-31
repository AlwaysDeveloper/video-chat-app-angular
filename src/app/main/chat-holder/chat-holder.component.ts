import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ChatModel} from '../../models/chat.model';
import {Subject} from 'rxjs';
import {SocketioService} from '../../services/socketio.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Fontawesome6Service} from '../../services/fontawesome6.service';
import {MessageModal} from '../../models/message.model';
import {FormControl, FormGroup} from '@angular/forms';
import {CommonDataHolderService} from '../../services/common-data-holder.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-chat-holder',
  templateUrl: './chat-holder.component.html',
  styleUrls: ['./chat-holder.component.css']
})
export class ChatHolderComponent implements OnInit {
  faPaperPlane;
  faUpload;
  faPhoneAlt;
  faPhoneSlash;
  imageLink: string;
  lastChat: string;
  @Input() selectedChat: Subject<ChatModel>;
  @ViewChild('fileSelector', {static: true}) fileInput: ElementRef<HTMLInputElement>;
  @ViewChild('textInput', {static: true}) textInput: ElementRef<HTMLTextAreaElement>;
  @ViewChild('chatArea', {static: true}) chatArea: ElementRef<HTMLDivElement>;
  messages: any[] = [];
  openedChat: any;
  messageForm = new FormGroup({
    textMessage: new FormControl(''),
    mediaMessage: new FormControl('')
  });
  constructor(
    private socket: SocketioService,
    private request: HttpClient,
    private fontawesome: Fontawesome6Service,
    private dataHolderService: CommonDataHolderService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.faPaperPlane = this.fontawesome.getFontRegular('faPaperPlane');
    this.faUpload = this.fontawesome.getFontSolid('faUpload');
    this.faPhoneAlt = this.fontawesome.getFontSolid('faPhoneAlt');
    this.faPhoneSlash = this.fontawesome.getFontSolid('faPhoneSlash');
  }

  ngOnInit(): void {
    this.selectedChat.subscribe(chat => {
      this.fetchMessages(chat._id);
      this.openedChat = chat;
      this.imageLink = chat.imageLink;
      document.getElementById(chat._id).style.backgroundColor = '#00ffad6b';
      if (this.lastChat){
        document.getElementById(this.lastChat).addEventListener('mouseover',  () => {
          document.getElementById(this.lastChat).style.backgroundColor = 'rgba(0,0,0,0.045)';
        });
        document.getElementById(this.lastChat).addEventListener('mouseout',  () => {
          document.getElementById(this.lastChat).style.backgroundColor = 'white';
        });
      }
      this.lastChat = chat._id;
    });

    this.dataHolderService.messageUpdater.subscribe(messages => {
      this.messages = messages;
    });
  }

  fetchMessages(selectedChat): void{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${document.cookie.split('jwt=')[1]}`);
    this.request.get(`${environment.REQUEST_ADDRESS}/users/getMessages?id=${selectedChat}&limit=${100}`, {headers}).subscribe(response => {
      this.dataHolderService.processMessages(response);
    });
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

  selectFile(): void{
    this.fileInput.nativeElement.click();
  }

  sendMessage(): void{
    const message = {
      message: this.messageForm.value.textMessage,
      timestamp: Math.ceil(Date.now() / 1000),
      to: this.openedChat._id,
      from: this.dataHolderService.currentUser.data._id,
      type: 'call'
    };
    this.socket.sendingMessage(message, this.socket.userSocketMapper[message.to]);
    // tslint:disable-next-line:forin
    this.fileInput.nativeElement.value = this.textInput.nativeElement.value = '';
  }

  scrollDown(id): void{
    if(document.getElementById(`${id}_text`)){
      document.getElementById(`${id}_text`).scrollIntoView();
    }else if(document.getElementById(`${id}_call`)){
      document.getElementById(`${id}_call`).scrollIntoView();
    }
  }

  sendCreateRoom(): void{
    const message = {
      message: 'testroom',
      timestamp: Math.ceil(Date.now() / 1000),
      to: this.openedChat._id,
      from: this.dataHolderService.currentUser.data._id,
      type: 'call'
    }
    this.socket.sendingMessage(message, this.socket.userSocketMapper[message.to]);
    // tslint:disable-next-line:forin
    this.fileInput.nativeElement.value = this.textInput.nativeElement.value = '';
  }

  toCall(room): void{
    this.router.navigate([]).then(result => {  window.open(`localhost:4200/call?room=${room}`); });
  }
}
