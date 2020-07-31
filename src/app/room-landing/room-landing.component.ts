import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SocketioService} from '../services/socketio.service';
import {Fontawesome6Service} from '../services/fontawesome6.service';
import {browser} from 'protractor';
import {environment} from '../../environments/environment';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-room-landing',
  templateUrl: './room-landing.component.html',
  styleUrls: ['./room-landing.component.css']
})

export class RoomLandingComponent implements OnInit {
  joined = false;
  stream;
  mediaPermission = {video: true, audio: true};
  faVideoSlash;
  faMicrophoneSlash;
  faPhoneSlash;
  @ViewChild ('mediaCheck') videoLanding: ElementRef<HTMLVideoElement>;
  @ViewChild('audioPermit') audioPermit: ElementRef<HTMLButtonElement>;
  @ViewChild('videoPermit') videoPermit: ElementRef<HTMLButtonElement>;
  @ViewChild('lobby') lobby: ElementRef<HTMLDivElement>;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socket: SocketioService,
    private request: HttpClient,
    private fontawesome: Fontawesome6Service
  ) {
    this.faVideoSlash = this.fontawesome.getFontSolid('faVideoSlash');
    this.faMicrophoneSlash = this.fontawesome.getFontSolid('faMicrophoneSlash');
    this.faPhoneSlash = this.fontawesome.getFontSolid('faPhoneSlash');
  }

  ngOnInit(): void {
    let headers;
    if (!document.cookie.includes('jwt')){
      this.notLoggedIn();
      return;
    }
    try{
      headers = new HttpHeaders().set('Authorization', `Bearer ${document.cookie.split('jwt=')[1]}`);
      this.request.get(`${environment.REQUEST_ADDRESS}/users/check`,{headers}).subscribe(response => {
        console.log(response);
      });
    }catch (e) {
      console.log(e.message);
    }
    this.socket.videoArea = this.lobby;
    this.getMediaToCheck();
    this.socket.getConferenceConnection();
  }

  joinRoomCall(): void{
    this.joined = true;
    this.route.params.subscribe(data => {
      this.socket.joinRoom(data.id);
    });
  }

  gotoChats(): void{
    try {
      this.socket.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }catch (e) {
      console.log(e.message);
    }
    this.router.navigate(['chats']);
  }

  leaveRoomCall(): void{
    this.route.params.subscribe(data => {
      this.socket.leavingRoom(data.id);
    });
  }

  async getMediaToCheck(): Promise<void>{
    try{
        navigator.mediaDevices.getUserMedia(this.mediaPermission).then(
        (stream) => {
          this.socket.stream = stream;
          this.videoLanding.nativeElement.muted = true;
          this.videoLanding.nativeElement.srcObject = stream;
        }
      );
    }catch (e) {
      console.log(e.message);
    }
  }

  resetMedia(media): void{
    if (this.mediaPermission[media]){
      this.socket.stream.getTracks().forEach(
        (track) => {
          if (track.kind === media){
            track.enabled = false;
          }
          console.log(media, track);
        }
      )
      this.mediaPermission[media] = false;
    }else {
      this.socket.stream.getTracks().forEach(
        (track) => {
          track.enabled = true;
        }
      )
      this.mediaPermission[media] = true;
    }
  }

  notLoggedIn(): void{
    console.log(this.route.url);
    this.router.navigate(['/'], {queryParams: {backFrom: 'call'}});
  }

}
