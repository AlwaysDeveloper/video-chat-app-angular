import {ElementRef, Injectable, Renderer2, RendererFactory2} from '@angular/core';
// @ts-ignore
import * as io from '../../../node_modules/socket.io-client';
import {environment} from '../../environments/environment';
import {CommonDataHolderService} from './common-data-holder.service';
import {of, Subject} from 'rxjs';
import {Fontawesome6Service} from './fontawesome6.service';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  private render: Renderer2;
  socket;
  myPeerConnections: any = {};
  receivingPeerConnections: any = {};
  mediaSender: any = {};
  isAlreadyCallMap: any = {};
  duplexMap: any = {};
  conferenceCallArray: Subject<any> = new Subject<any>();
  ringtone: any;
  from: any = {};
  to: string;
  videoArea: ElementRef<HTMLDivElement>;
  searchComplete: Subject<any> = new Subject<any>();
  userSocketMapper: any = {};
  stream: MediaStream;
  callNotification: Subject<any> = new Subject<any>();
  constructor(
    private dataHolder: CommonDataHolderService,
    private fontawesome: Fontawesome6Service,
    private rendererFactory2: RendererFactory2
  ) {
    this.render = this.rendererFactory2.createRenderer(null, null);
  }

  getConnection(user): void{
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.setSocketEvents();
    this.socket.emit('confirm-connection', {
      _id: user.data._id,
      _contacts: user.data.contacts
    });
  }

  getConferenceConnection(): void{
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.setSocketEvents();
  }

  setSocketEvents(): void {
    this.socket.on('user-online', data => {
      this.userSocketMapper[data._id] = data._socket;
      document.getElementById(`${data._id}_online`).style.display = 'block';
      document.getElementById(`${data._id}_offline`).style.display = 'none';
    });

    this.socket.on('acknowledged', data => {
      this.userSocketMapper = data;
      // tslint:disable-next-line:forin
      for (const contact in data) {
        document.getElementById(`${contact}_online`).style.display = 'block';
        document.getElementById(`${contact}_offline`).style.display = 'none';
      }
    });

    this.socket.on('user-gone', data => {
      delete this.userSocketMapper[data._contact];
      delete this.myPeerConnections[data._socket];
      delete this.receivingPeerConnections[data._socket];
      const elementToRemove = document.getElementById(`${data._socket}_show_video`).parentNode;
      this.render.removeChild(document.getElementById('videoArea'), elementToRemove);
      if (data._contact) {
        document.getElementById(`${data._contact}_online`).style.display = 'none';
        document.getElementById(`${data._contact}_offline`).style.display = 'block';
      }
    });

    this.socket.on('new-joining', data => {
      this.createNewPeer(data);
      this.socket.emit('join-acknowledge', {to: data.socket});
    });

    this.socket.on('start-call', async data => {
      this.createNewPeer(data);
      await this.addTracks(data.socket).then(
        async () => {
          await this.createSendOffer(data.socket);
        }
      );
    })

    this.socket.on('do-connect', async data => {
      await this.createSendAnswer(data);
    });

    this.socket.on('connect-done', async data => {
      try {
        await this.myPeerConnections[data.socket].setRemoteDescription(
          new RTCSessionDescription(data.answer)
        ).then(
          () => {
            this.socket.emit('init-duplex', {
              to: data.socket
            });
          }
        );
        if (!this.isAlreadyCallMap[data.socket] || !this.duplexMap[data.socket]){
          this.createSendOffer(data.socket);
          if(!this.isAlreadyCallMap[data.socket]) {
            this.isAlreadyCallMap[data.socket] = true;
          }else if (!this.duplexMap[data.socket]){
            this.duplexMap[data.socket] = true;
          }
        }
      }catch (e) {
        console.log(e.message);
      }
    });

    this.socket.on('duplex-init', async data => {
     await this.addTracks(data.socket).then(
       async () => {
         if (!this.duplexMap[data.socket]){
           await this.createSendOffer(data.socket);
         }
       }
     );
    });

    this.socket.on('room-leaved', data => {
      const elementToRemove = document.getElementById(`${data.socket}_show_video`).parentNode;
      this.render.removeChild(document.getElementById('videoArea'), elementToRemove);
    });
  }

  async createSendOffer(socket): Promise<void>{
    const offer = await this.myPeerConnections[socket].createOffer();
    await this.myPeerConnections[socket].setLocalDescription(
      offer
    ).then(
      () => {
        this.socket.emit('please-connect', {
          offer,
          socket
        });
      }
    );
  }

  async createSendAnswer(data): Promise<void>{
    await this.receivingPeerConnections[data.socket].setRemoteDescription(
      new RTCSessionDescription(data.offer)
    ).then(
      async () => {
        const answer = await this.receivingPeerConnections[data.socket].createAnswer();
        await this.receivingPeerConnections[data.socket].setLocalDescription(
          new RTCSessionDescription(answer)
        ).then(
          () => {
            this.socket.emit('ok-connected', {
              answer,
              socket: data.socket
            });
          }
        );
      }
    );
  }

  // tslint:disable-next-line:variable-name
  async addTracks(socket): Promise<void> {
    try {
      this.stream.getTracks().forEach((track) => {
        this.myPeerConnections[socket].addTrack(track, this.stream);
      });
    }catch (e) {
      console.log(e.message);
    }
  }

  joinRoom(roomId): void{
    this.socket.emit('join-room', {
      room: roomId
    });
  }

  createNewPeer(data): void{
    this.isAlreadyCallMap[data.socket] = false;
    this.duplexMap[data.socket] = false;
    if (!this.receivingPeerConnections[data.socket]){
      const videoDiv = this.render.createElement('div');
      this.render.addClass(videoDiv, 'card');
      this.render.addClass(videoDiv, 'col-sm-3');
      this.render.addClass(videoDiv, '_videoDiv');
      this.render.setAttribute(videoDiv, 'style', 'background-color: black');
      const videoTag = this.render.createElement('video');
      this.render.setAttribute(videoTag, 'id', `${data.socket}_show_video`);
      this.render.setAttribute(videoTag, 'height', `300px`);
      videoTag.autoplay = true;
      videoTag.muted = true;
      this.render.appendChild(videoDiv, videoTag);
      this.render.appendChild(document.getElementById('videoArea'), videoDiv);
    }
    this.myPeerConnections[data.socket] = new RTCPeerConnection();
    this.receivingPeerConnections[data.socket] = new RTCPeerConnection();
    this.receivingPeerConnections[data.socket].ontrack = (event) => {
      if (event.track.kind === 'video'){
        const display = (document.getElementById(`${data.socket}_show_video`) as HTMLVideoElement);
        display.srcObject = event.streams[0];
      }
    };
  }

  leavingRoom(roomID): void{
    try {
      navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(
        (stream) => {
          stream.getTracks().forEach((track) => {
            track.stop();
            track.enabled = false;
          });
        }
      );
    }catch (e) {
      console.log(e.message);
    }
    this.myPeerConnections = this.receivingPeerConnections = {};
    this.socket.emit('leaving-room', {room: roomID});
    document.location.reload();
  }

  sendingMessage(message, socket): void{
    this.socket.emit('message-to', {
      message,
      _to: socket
    });
  }

  doSearch(search): void{
    this.socket.emit('do-search', {
      search
    });
  }
}
