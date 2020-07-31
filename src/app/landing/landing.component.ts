import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {SocketioService} from '../services/socketio.service';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  loggedInUser: Subject<any> = new Subject<any>();
  setUser: Subject<any> = new Subject<any>();
  navigate: any = {};
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socket: SocketioService,
    private location: Location,
    private request: HttpClient,
    ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe( params => {
      if (params.backFrom && params.backFrom.includes('call')){
        this.navigate = {bool: true, value: params.backFrom};
      }
    });
    console.log(document.cookie.includes('jwt'), document.cookie);
    if (document.cookie.includes('jwt')){
      let headers;
      if (document.cookie.startsWith('jwt')){
        headers = new HttpHeaders().set('Authorization', `Bearer ${document.cookie.split('=')[1]}`);
      }else {
        headers = new HttpHeaders().set('Authorization', `Bearer ${document.cookie.split('; ')[1].split('=')[1]}`);
      }
      this.request.get(`${environment.REQUEST_ADDRESS}/users/check`, {headers}).subscribe(response => { this.alreadyLoggedIn(response); });
    }
  }

  // tslint:disable-next-line:typedef
  onSuccess(event): void{
    console.log(event);
    this.loggedInUser = event.loginSuccess || event.signupSuccess || event.socialSuccess;
    this.loggedInUser.subscribe((response) => {
      if (response.status === 'success'){
          document.cookie = `jwt=${response.token}`;
          this.socket.from.user_id = response.data.user._id;
          if (this.navigate.bool && this.navigate.value) {
            this.router.navigate([this.navigate.value]).then(
              () => {
                this.loggedInUser.unsubscribe();
              }
            );
            return;
          }
          this.router.navigate(['chats']);
      }
    });
  }

  alreadyLoggedIn(response): void{
    if (response.status && response.lStatus){
      if (this.navigate.bool && this.navigate.value) {
        this.router.navigate([this.navigate.value]);
      }
      this.router.navigate(['/chats']);
    }
    return;
  }

}
