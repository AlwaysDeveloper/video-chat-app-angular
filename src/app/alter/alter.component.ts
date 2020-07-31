import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-alter',
  templateUrl: './alter.component.html',
  styleUrls: ['./alter.component.css']
})
export class AlterComponent implements OnInit {
  codeError: any = {
    message: '',
    color: ''
  };
  @Input()showEvent: Subject<any> ;
  constructor() {
  }

  ngOnInit(): void {
    this.showEvent.subscribe(EW => {
      this.codeError.color = EW.color;
      this.codeError.message = EW.message;
    });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy(): void{
    this.showEvent.unsubscribe();
  }
}
