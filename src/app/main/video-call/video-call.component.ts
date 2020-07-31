import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SocketioService} from '../../services/socketio.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoCallComponent implements OnInit {
  @ViewChild('videoElement', {static: true}) video: ElementRef<HTMLVideoElement>;
  constructor(private socket: SocketioService) { }

  ngOnInit(): void {
  }

}
