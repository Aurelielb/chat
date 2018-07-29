import { Component, OnInit } from '@angular/core';

import * as io from 'socket.io-client';

interface Message {
  message: string;
  nickname: string;
}
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  nickName: string;
  inputUser: string;
  messages: Message[] = [];
  inputMessage: string;
  users = [];
  socket: any;
  usersOnMobile: false;

  constructor() { }

  ngOnInit() {
  }

  /**
   * Get input message and add it to the room
   *
   * @param {Event} e
   * @memberof RoomComponent
   */
  sendMessage(e: Event): void {
    e.preventDefault();
    if (this.inputMessage.trim() !== '') {
      const data = { nickname: this.nickName, message: this.inputMessage };
      this.messages.push(data);
      this.socket.emit('message', data.message);
      this.inputMessage = '';
    }
  }

  /**
   * Log user in chat room and init message reception
   *
   * @memberof RoomComponent
   */
  initChat(): void {
    this.nickName = this.inputUser;
    this.connectToChat();
    this.socket.on('userlist', (data) => {
      this.users = Object.keys(data);
    });
    // todo if text overflow, keep scroll on bottom
    this.socket.on('message', (data) => {
      this.messages.push(data);
    });
    this.socket.on('disconnect', () => {
      this.connectToChat();
    });
  }

  /**
   * Connect to socket
   *
   * @memberof RoomComponent
   */
  connectToChat(): void {
    this.socket = io('http://localhost:8081');
    this.socket.emit('join', this.nickName);
  }

  /**
   * Get user Nickname and use it to init chat session
   *
   * @param {Event} e
   * @memberof RoomComponent
   */
  logUser(e: Event): void {
    e.preventDefault();
    if (this.inputUser.trim() !== '') {
      this.initChat();
    }
  }

}
