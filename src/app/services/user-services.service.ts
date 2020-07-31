import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {
  isLoggedIn = false;
  constructor() { }
}
