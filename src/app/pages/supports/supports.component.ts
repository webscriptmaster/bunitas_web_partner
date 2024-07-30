/*
  Authors : cosonas (Rahul Jograna)
  Website : https://cosonas.com/
  App Name : Bunitas Management Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://cosonas.com/license
  Copyright and Good Faith Purchasers © 2022-present cosonas.
*/
import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-supports',
  templateUrl: './supports.component.html',
  styleUrls: ['./supports.component.scss']
})
export class SupportsComponent implements OnInit {
  @ViewChild('scrollMe', { static: false }) private myScrollContainer: ElementRef;
  @ViewChildren('messages') messagesList: QueryList<any>;
  users: any[] = [];
  dummy: any[] = [];
  dummyList = Array(5);
  id: any;
  message: any;
  messages: any[] = [];
  selectedId: any;
  name: any;
  avtar: any;
  type: any;
  interval: any;
  uid: any;
  roomId: any = '';
  @HostListener('window:beforeunload')
  canDeactivate(): any {
  };
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.uid = parseInt(localStorage.getItem('uid') || '0');
    this.getList();
    this.util.successEject().subscribe(() => {
      clearInterval(this.interval);
    })
  }

  getList() {
    this.users = [];
    this.dummy = [];
    this.getChatList();
  }


  getChatList() {
    this.dummyList = Array(5);
    this.api.post_private('v1/chats/getChatListBUid', { id: this.uid }).then((data: any) => {
      this.dummyList = [];
      if (data && data.status && data.data && data.data.length) {
        this.users = data.data;
      }
    }, error => {
      this.dummyList = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.dummyList = [];
      this.util.apiErrorHandler(error);
    });
  }

  ngOnInit(): void {
  }

  search(str: any) {
    console.log(str);
  }

  getChatRooms() {
    const param = {
      sender_id: this.uid,
      receiver_id: this.id
    };
    this.api.post_private('v1/chats/getChatRooms', param).then((data: any) => {
      if (data && data.status && data.status == 200) {
        if (data && data.data && data.data.id) {
          this.roomId = data.data.id;
        } else if (data && data.data2 && data.data2.id) {
          this.roomId = data.data2.id;
        }
        this.getMessageList();
        this.interval = setInterval(() => {
          this.getMessageList();
        }, 12000);
      } else {
        this.createChatRooms();
      }
    }, error => {
      this.createChatRooms();
    }).catch(error => {
      this.createChatRooms();
    });
  }

  createChatRooms() {
    const param = {
      sender_id: this.uid,
      receiver_id: this.id,
      status: 1
    };
    this.api.post_private('v1/chats/createChatRooms', param).then((data: any) => {

      if (data && data.status && data.status == 200 && data.data) {
        this.roomId = data.data.id;
        this.getMessageList();
        this.interval = setInterval(() => {
          this.getMessageList();
        }, 12000);
      }
    }, error => {
    }).catch(error => {
    });
  }


  chatUser(id: any, type: any, userName: any) {
    this.id = id;
    this.name = userName;
    this.getChatRooms();
  }

  getMessageList() {
    this.api.post_private('v1/chats/getById', { room_id: this.roomId }).then((data: any) => {
      if (data && data.status && data.status == 200 && data.data.length) {
        this.messages = data.data;
      }
    }, error => {
    }).catch(error => {
    });
  }

  send() {
    if (!this.message || this.message == '') {
      return false;
    }
    const msg = this.message;
    this.message = '';
    const param = {
      room_id: this.roomId,
      uid: this.uid,
      sender_id: this.uid,
      message: msg,
      message_type: 0,
      status: 1,
      reported: 0
    };

    this.api.post_private('v1/chats/sendMessage', param).then((data: any) => {
      if (data && data.status == 200) {
        this.getMessageList();
      }
    }, error => {
    });
  }
}
