import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Fontawesome6Service} from '../../services/fontawesome6.service';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-social-ins',
  templateUrl: './social-ins.component.html',
  styleUrls: ['./social-ins.component.css']
})
export class SocialInsComponent implements OnInit {
  faGoogle;
  faFaceBook;
  faLinkedIN;
  faTwitter;
  faInstagram;
  @Output('socialSuccess') socialSuccess: EventEmitter<any> = new EventEmitter();
  constructor(private fontawesome: Fontawesome6Service, private OAuth: SocialAuthService, private request: HttpClient) {
    this.faGoogle = this.fontawesome.getFontBrands('faGoogle');
    this.faFaceBook = this.fontawesome.getFontBrands('faFacebookF');
    this.faInstagram = this.fontawesome.getFontBrands('faInstagram');
    this.faLinkedIN = this.fontawesome.getFontBrands('faLinkedinIn');
    this.faTwitter = this.fontawesome.getFontBrands('faTwitter');
  }

  ngOnInit(): void {
  }

  getLoginBySocials(event): void{
    let platfromUsing;
    const using = event.currentTarget.id.split('_')[1];
    switch (using) {
      case 'google':
        platfromUsing = GoogleLoginProvider.PROVIDER_ID;
        break;
      case 'facebook':
        platfromUsing = FacebookLoginProvider.PROVIDER_ID;
        break;
    }

    this.OAuth.signIn(platfromUsing).then((data) => {
      console.log(data);
      this.request.post(`${environment.REQUEST_ADDRESS}/users/googleAPI`, data).subscribe((response) => {
        this.socialSuccess.emit(response);
      });
    });
  }

}
