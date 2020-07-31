import { Injectable } from '@angular/core';

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class RequestErrorHandlerService {
  componentToError = {
    login: {
      401: {message: 'Incorrect Email or Password', color: 'red'},
      DataMissing: {message: 'Please enter both email and password', color: 'yellow'}
    }
  };
  error: any = {
    message: '',
    color: ''
  };
  constructor() { }

  // tslint:disable-next-line:typedef
  getErrorMessage(errorCase){
    this.error = this.componentToError[errorCase.comp][errorCase.code];
  }
}
