import {Component, ElementRef, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Fontawesome6Service} from '../../services/fontawesome6.service';
import {SocketioService} from '../../services/socketio.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  callNotifyTemplate = ' <div class="col-sm-12"><div class="row">\n' +
    '        <div class="col-sm-2">\n' +
    '          <img height="35px" src="https://img.icons8.com/ios-filled/50/000000/cat-profile.png"/>\n' +
    '        </div>\n' +
    '        <div class="col-sm-8" style="display: flex; justify-content: center; align-items: center; margin: 5px;">#Call</div>\n' +
    '      </div></div>'
  faPhoneAlt;
  faPhoneSlash;
  @ViewChild('notificationBody', {static: false}) notificationBody: ElementRef<HTMLDivElement>;
  @ViewChild('infoArea', {static: false}) infobox: ElementRef<HTMLDivElement>;
  constructor(private fontawesome: Fontawesome6Service, private socket: SocketioService) {
    this.faPhoneAlt = this.fontawesome.getFontSolid('faPhoneAlt');
    this.faPhoneSlash = this.fontawesome.getFontSolid('faPhoneSlash');
  }

  ngOnInit(): void {
    this.socket.callNotification.subscribe( call => {
     this.callComing(call.from);
    });
  }

  // tslint:disable-next-line:typedef
  callComing(call){
    let height = 0;
    if (call){this.infobox.nativeElement.innerHTML = this.callNotifyTemplate.replace(/#Call/, `${call.name} calling.......`);}
    this.notificationBody.nativeElement.style.display = 'block';
    setInterval(() => {
      if (height <= 20){
        height += 1;
        this.notificationBody.nativeElement.style.height = `${height}vh`;
      }else if (height === 20){
        clearInterval();
      }
    }, 10);
  }

  pickCall(): void{
    this.hideNotification();
  }

  cutCall(): void{
    this.hideNotification();
  }

  // tslint:disable-next-line:typedef
  hideNotification(){
    let height = 20;
    this.infobox.nativeElement.innerHTML = '';
    setInterval(() => {
      if (height > 0){
        height -= 1;
        this.notificationBody.nativeElement.style.height = `${height}vh`;
      }else if (height === 0){
        clearInterval();
        this.notificationBody.nativeElement.style.display = 'none';
      }
    }, 10);
  }

  // tslint:disable-next-line:align no-unused-expression use-lifecycle-interface
  ngOnDestroy(): void{
  this.socket.callNotification.unsubscribe();
  }
}
