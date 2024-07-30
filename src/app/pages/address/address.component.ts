/*
  Authors : cosonas (Rahul Jograna)
  Website : https://cosonas.com/
  App Name : Bunitas Management Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://cosonas.com/license
  Copyright and Good Faith Purchasers © 2022-present cosonas.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  @ViewChild('myModal3') public myModal3: ModalDirective;
  dummy: any[] = [];
  list: any[] = [];
  dummyList: any[] = [];
  page: number = 1;
  sort: any = [];
  itemsPerPage: number = 10;

  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.getList();
  }

  getList() {
    this.dummy = Array(5);
    this.list = [];
    this.dummyList = [];
    this.api.get_private('v1/address/getAll').then((data: any) => {
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
  ngOnInit(): void {
  }


  deleteAddress(item: any) {
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('To delete this item?'),
      icon: 'question',
      showConfirmButton: true,
      confirmButtonText: this.util.translate('Yes'),
      showCancelButton: true,
      cancelButtonText: this.util.translate('Cancel'),
      backdrop: false,
      background: 'white'
    }).then((data) => {
      if (data && data.value) {

        this.util.show();
        this.api.post_private('v1/address/delete', { id: item.id }).then((data: any) => {
          this.util.hide();
          if (data && data.status && data.status == 200) {
            this.getList();
          }
        }).catch(error => {
          this.util.hide();
          this.util.apiErrorHandler(error);
        });
      }
    });
  }


  getTitle(num: any) {
    const title = [this.util.translate('Home'), this.util.translate('Work'), this.util.translate('Others')];
    return title[num];
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
