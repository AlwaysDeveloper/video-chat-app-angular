import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {RequestErrorHandlerService} from '../../services/request-error-handler.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-loginform',
  templateUrl: './loginform.component.html',
  styleUrls: ['./loginform.component.css']
})
export class LoginformComponent implements OnInit {
  showErrorWarn: Subject<any> = new Subject<any>();
  @Output('loginSuccess') loginSuccess = new EventEmitter();
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
  alert = false;
  constructor(private request: HttpClient, private requestError: RequestErrorHandlerService) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  getLoginAndConnection(event){
    event.preventDefault();
    // tslint:disable-next-line:no-unused-expression
    if (!this.loginForm.value.email || !this.loginForm.value.password) {
      this.requestError.getErrorMessage({comp: 'login', code: 'DataMissing'});
      this.alert = true;
      this.showErrorWarn.next(this.requestError.error);
    }else {
      this.request.post(`${environment.REQUEST_ADDRESS}/users/login`, this.loginForm.value).subscribe(response => {
       this.emitLoginSuccess(response);
      }, error => {
        this.requestError.getErrorMessage({comp: 'login', code: error.status});
        this.alert = true;
        this.showErrorWarn.next(this.requestError.error);
      });
    }
  }

  // tslint:disable-next-line:typedef
  emitLoginSuccess(response){
    this.loginSuccess.emit(response);
  }

}
