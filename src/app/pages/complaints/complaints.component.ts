/*
  Authors : cosonas (Rahul Jograna)
  Website : https://cosonas.com/
  App Name : Bunitas Management Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://cosonas.com/license
  Copyright and Good Faith Purchasers © 2022-present cosonas.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss']
})
export class ComplaintsComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  dummy: any[] = [];
  list: any[] = [];
  dummyList: any[] = [];
  page: number = 1;

  name: any = '';
  email: any = '';
  message: any = '';

  reply: any = '';
  id: any = '';
  
  sort: any = [];
  itemsPerPage: number = 10;

  issue_With: any[] = [
    '',
    this.util.translate('Order'),
    this.util.translate('Freelancer'),
    this.util.translate('Driver'),
    this.util.translate('Product'),
    this.util.translate('Service'),
    this.util.translate('Packages'),
  ];
  constructor(
    public api: ApiService,
    public util: UtilService
  ) {
    this.getForms();
  }

  ngOnInit(): void {
  }

  getForms() {
    this.list = [];
    this.dummy = Array(5);
    this.api.get_private('v1/complaints/getAll').then((data: any) => {
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.list = data.data;
        this.dummyList = data.data;
      }
    }, error => {
      this.dummy = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.dummy = [];
      this.util.apiErrorHandler(error);
    });
  }

  search(str: any) {
    this.resetChanges();
    this.list = this.filterItems(str);
  }

  protected resetChanges = () => {
    this.list = this.dummyList;
  }

  filterItems(searchTerm: any) {
    return this.list.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  setFilteredItems() {
    this.list = [];
    this.list = this.dummyList;
  }


  getDate(date: any) {
    return moment(date).format('ll');
  }
  openItem(item: any) {
    this.name = item.userInfo.first_name + ' ' + item.userInfo.last_name;
    this.email = item.userInfo.email;
    this.message = item.short_message;
    this.id = item.id;
    this.myModal.show();
  }

  sendMail() {
    if (this.reply == '' || !this.reply) {
      this.util.error(this.util.translate('Please add your reply text'));
      return false;
    }
    const param = {
      id: this.id,
      mediaURL: this.api.imageUrl,
      subject: this.util.appName + ' ' + this.util.translate('Replied on your complaints'),
      thank_you_text: this.util.translate('You have received new mail on your complaints'),
      header_text: this.util.appName + ' ' + this.util.translate('Replied on your complaints'),
      email: this.email,
      from_username: this.name,
      to_respond: this.reply
    };
    this.util.show();
    this.api.post_private('v1/complaints/replyContactForm', param).then((data: any) => {
      this.util.hide();
      this.reply = '';
      this.myModal.hide();
      this.util.success(this.util.translate('Mail sent'));
    }, error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    });


  }

  statusUpdate(item: any) {
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('To update this item?'),
      icon: 'question',
      showConfirmButton: true,
      confirmButtonText: this.util.translate('Yes'),
      showCancelButton: true,
      cancelButtonText: this.util.translate('Cancel'),
      backdrop: false,
      background: 'white'
    }).then((data: any) => {
      if (data && data.value) {
        const body = {
          id: item.id,
          status: item.status == 0 ? 1 : 0
        };
        this.util.show();
        this.api.post_private('v1/complaints/update', body).then((data: any) => {
          this.util.hide();
          if (data && data.status && data.status == 200 && data.success) {
            this.util.success(this.util.translate('Status Updated !'));
            this.getForms();
          }
        }, error => {
          this.util.hide();
          this.util.apiErrorHandler(error);
        }).catch(error => {
          this.util.hide();
          this.util.apiErrorHandler(error);
        });
      }
    });
  }
  
  sortOn(column: string) {
    this.sort[column] = (this.sort[column] == '' || this.sort[column] == 'desc') ? 'asc' : 'desc';
    this.sortByColumn(column, this.sort[column]);
  }

  sortByColumn(column:string, direction = 'desc'): any[] {
    let sortedArray = (this.list || []).sort((a,b)=>{
      if(a[column] > b[column]){
        return (direction === 'desc') ? 1 : -1;
      }
      if(a[column] < b[column]){
        return (direction === 'desc') ? -1 : 1;
      }
      return 0;
    })
    return sortedArray;
  }
}
