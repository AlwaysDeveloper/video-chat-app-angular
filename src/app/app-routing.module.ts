import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from './main/main.component';
import {LandingComponent} from './landing/landing.component';
import {LoginformComponent} from './landing/loginform/loginform.component';
import {SignupformComponent} from './landing/signupform/signupform.component';
import {RoomLandingComponent} from './room-landing/room-landing.component';


const routes: Routes = [
  {path: '', component: LandingComponent, children: [
      {path: '', component: LoginformComponent},
      {path: 'signup', component: SignupformComponent}
    ]},
  {path: 'chats', component: MainComponent},
  {path: 'call', component: RoomLandingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor() {
    // console.log(document.cookie);
  }
}
