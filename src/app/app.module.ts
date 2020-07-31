import { BrowserModule } from '@angular/platform-browser';
import {NgModule, Renderer2} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { ContactListComponent } from './main/contact-list/contact-list.component';
import {SocketioService} from './services/socketio.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LandingComponent } from './landing/landing.component';
import { HeaderComponent } from './header/header.component';
import { LoginformComponent } from './landing/loginform/loginform.component';
import { SignupformComponent } from './landing/signupform/signupform.component';
import {HttpClientModule} from '@angular/common/http';
import { AlterComponent } from './alter/alter.component';
import {CookieService} from 'ngx-cookie-service';
import { ChatComponent } from './main/contact-list/chat/chat.component';
import { VideoCallComponent } from './main/video-call/video-call.component';
import { NotificationComponent } from './main/notification/notification.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule} from 'angularx-social-login';
import { SocialInsComponent } from './landing/social-ins/social-ins.component';
import { ChatHolderComponent } from './main/chat-holder/chat-holder.component';
import {Router} from '@angular/router';
import { RoomLandingComponent } from './room-landing/room-landing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatGridListModule} from '@angular/material/grid-list';
import { VideoComponent } from './room-landing/video/video.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ContactListComponent,
    LandingComponent,
    HeaderComponent,
    LoginformComponent,
    SignupformComponent,
    AlterComponent,
    ChatComponent,
    VideoCallComponent,
    NotificationComponent,
    SocialInsComponent,
    ChatHolderComponent,
    RoomLandingComponent,
    VideoComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FontAwesomeModule,
        SocialLoginModule,
        BrowserAnimationsModule,
        MatGridListModule,
    ],
  providers: [
    SocketioService,
    CookieService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('993588126972-fhmuahctvrg32psc7mvprce6rl2gk7mq.apps.googleusercontent.com')
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('330464497985262')
          }
        ]
      } as SocialAuthServiceConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}

