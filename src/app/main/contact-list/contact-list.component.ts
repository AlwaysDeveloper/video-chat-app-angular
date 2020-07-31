import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ChatModel} from '../../models/chat.model';
import {SocketioService} from '../../services/socketio.service';
import {Fontawesome6Service} from '../../services/fontawesome6.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  chatFlag = 'pc';
  searchFlag = false;
  searchResults: any[];
  faSearch;
  @ViewChild('username', {static: true}) username: ElementRef<HTMLSpanElement>;
  @ViewChild('online', {static: true}) online: ElementRef<HTMLSpanElement>;
  @ViewChild('search', {static: true}) searchmode: ElementRef<HTMLDivElement>;
  @ViewChild('searchShow', {static: true}) searchshow: ElementRef<HTMLDivElement>;
  @Input() chatListPersonal: ChatModel[] = [];
  @Input() user: any;
  @Input() chatListGroup: ChatModel[] = [];
  @Output('selectedChat') chatSelected: EventEmitter<any> = new EventEmitter<any>();
  constructor(private socket: SocketioService, private fontawesome: Fontawesome6Service) {
    this.faSearch = this.fontawesome.getFontSolid('faSearch');
  }

  ngOnInit(): void {
    window.addEventListener('click', () => {
      if (this.searchFlag && this.searchshow.nativeElement.style.display === 'none')
      console.log(this.searchFlag, this.searchshow.nativeElement.style.display);
    });
    this.socket.searchComplete.subscribe( response => {
      this.searchResults = response;
    });
  }

  // tslint:disable-next-line:typedef
  activateChatType(type){
    this.chatFlag = type;
  }

  selectedChat(chat): void{
    this.chatSelected.emit(chat);
  }

  searchOn(): void{
    this.searchshow.nativeElement.style.display = 'none';
    this.searchmode.nativeElement.style.display = 'block';
    this.searchFlag = true;
  }

  searchFor(input): void{
    console.log(input);
    this.socket.doSearch(input.currentTarget.value);
  }
}
