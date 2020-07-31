import {Component, ElementRef, HostListener, Inject, OnInit, OnDestroy, PLATFORM_ID, ViewChild, Output, EventEmitter} from '@angular/core';
import {SocketioService} from '../services/socketio.service';
import {Subject} from 'rxjs';
import {UserServicesService} from '../services/user-services.service';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ChatModel} from '../models/chat.model';
import {CommonDataHolderService} from '../services/common-data-holder.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupChatModel} from '../models/group.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  LoggedInUser: any;
  chatListPersonal: ChatModel[] = [];
  chatListGroup: GroupChatModel[] = [];
  chatListPersonalMapper: any = {};
  @Output('selectedChat') selectedChat: Subject<ChatModel> = new Subject<ChatModel>();
  @ViewChild('videoElement', {static: true}) showVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('chatArea', {static: true}) chatArea: ElementRef<HTMLDivElement>;
  @ViewChild('ringtone', {static: true}) audio: ElementRef<HTMLAudioElement>;
  @HostListener('window:resize' , ['$event'])
  // tslint:disable-next-line:typedef
  onResize(event){
  if (event.target.innerWidth <= 680){
    this.chatArea.nativeElement.style.display = 'none';
  }
  else {
    this.chatArea.nativeElement.style.display = 'block';
  }
  }

  // tslint:disable-next-line:variable-name ban-types max-line-length
  constructor(@Inject(PLATFORM_ID) private _platform: Object,
              private socketService: SocketioService,
              private userServices: UserServicesService,
              private serverCall: HttpClient,
              private dataHolderService: CommonDataHolderService,
              private route: ActivatedRoute,
              private router: Router
              ) {
  }

  ngOnInit(): void {
    let headers;
    try {
      if (!document.cookie.includes('jwt')){
        this.logout();
      }
      headers = new HttpHeaders().set('Authorization', `Bearer ${document.cookie.split('jwt=')[1]}`);
      this.serverCall.get(`${environment.REQUEST_ADDRESS}/users/me`, {headers}).subscribe((response: HttpResponse<any>) => {
        this.dataHolderService.currentUser = response;
        this.socketService.getConnection(response);
        this.toCreateChatList(response);
        this.socketService.ringtone = this.audio.nativeElement;
      }, () => {
        this.logout();
      });
    }catch (e) {
      console.log(e);
    }
  }

  // tslint:disable-next-line:typedef
  toCreateChatList(response){
    response.data.contacts.map(
      (contact) => {
        const chat = new ChatModel(
          contact._id,
          contact.photo || '',
          contact.name,
          contact.email
        );
        this.chatListPersonalMapper[contact._id] = chat;
        this.chatListPersonal.push(chat);
      }
    );
    this.dataHolderService.contactHolder = this.chatListPersonal;
  }

  selectedChatRoom(chat): void{
    this.selectedChat.next(this.chatListPersonalMapper[chat]);
  }

  logout(): void{
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.router.navigate(['/']);
    return;
  }

}
