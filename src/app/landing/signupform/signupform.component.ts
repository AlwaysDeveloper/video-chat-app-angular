import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {RequestErrorHandlerService} from '../../services/request-error-handler.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-signupform',
  templateUrl: './signupform.component.html',
  styleUrls: ['./signupform.component.css']
})
export class SignupformComponent implements OnInit {
  showErrorWarn: Subject<any> = new Subject<any>();
  @Output('signupSuccess') signupSuccess: EventEmitter<any> = new EventEmitter();
  signupForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    name: new FormControl('')
  });
  alert = false;
  constructor(private http: HttpClient, private requestError: RequestErrorHandlerService) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  getSignupAndConnection(event){
    event.preventDefault();
    this.http.post(`${environment.REQUEST_ADDRESS}/users/signup`, this.signupForm.value).subscribe((response) => {
      this.signupSuccess.emit(response);
    }, error => {
      this.requestError.getErrorMessage({comp: 'login', code: error.status});
      this.alert = true;
      this.showErrorWarn.next(this.requestError.error);
    });
  }
}
