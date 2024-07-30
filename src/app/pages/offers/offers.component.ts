/*
  Authors : cosonas (Rahul Jograna)
  Website : https://cosonas.com/
  App Name : Bunitas Management Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://cosonas.com/license
  Copyright and Good Faith Purchasers © 2022-present cosonas.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import Swal from 'sweetalert2';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  @ViewChild('myModal2') public myModal2: ModalDirective;
  dummy: any[] = [];
  list: any[] = [];
  dummyList: any[] = [];
  page: number = 1;
  value: any = '';

  name: any = '';
  off: any = '';
  type: any = '';
  date_time: any = '';
  descriptions: any = '';
  upto: any = '';
  status: any = 1;
  max_usage: any = '';
  min_cart_value: any = '';
  user_limit_validation: any = '';
  action: any = '';
  expire: any = '';

  offerId: any = '';

  freelancers: any[] = [];

  sort: any = [];
  itemsPerPage: number = 10;


  dropdownMultiSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    allowSearchFilter: true,
    itemsShowLimit: 3,
  };
  constructor(
    public util: UtilService,
    public api: ApiService,
  ) {
    this.getList();
    this.getStores();
  }

  getStores() {
    this.api.get_private('v1/salon/getListForOffers').then((data: any) => {
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.freelancers = data.data;
      }
    }, error => {
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.apiErrorHandler(error);
    });
  }

  getList() {
    this.dummy = Array(5);
    this.list = [];
    this.dummyList = [];
    this.api.get_private('v1/offers/getAll').then((data: any) => {
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

  getDate(item: any) {
    return moment(item).format('lll');
  }

  ngOnInit(): void {
  }


  changeStatus(item: any) {
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
        this.api.post_private('v1/offers/updateStatus', body).then((data: any) => {
          this.util.hide();
          if (data && data.status && data.status == 200 && data.success) {
            this.util.success(this.util.translate('Status Updated !'));
            this.getList();
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


  addNew() {
    this.action = 'create';
    this.clearData();
    this.myModal2.show();
  }



  clearData() {
    this.name = '';
    this.off = '';
    this.min_cart_value = '';
    this.upto = '';
    this.type = '';
    this.descriptions = '';
    this.expire = '';
    this.action = 'create';
  }


  saveChanges() {

    if (this.name == '' || this.name == null || this.off == '' || this.off == null || this.upto == '' || this.upto == null ||
      this.type == '' || this.type == null || this.descriptions == null || this.descriptions == '' || this.expire == '' || this.expire == null ||
      this.max_usage == '' || this.max_usage == null || this.min_cart_value == '' || this.min_cart_value == null || this.user_limit_validation == '' || this.user_limit_validation == null) {
      this.util.error(this.util.translate('All Fields are required'));
      return false;
    }

    if (this.value == '' || this.value == null || this.value.length <= 0) {
      this.util.error(this.util.translate('Please select Freelancers'));
      return false;
    }
    let values = '';
    const ids = this.value.map((x: any) => x.id);
    if (ids && ids.length) {
      values = ids.join();
    }
    const param = {
      name: this.name,
      freelancer_ids: values,
      code: this.name,
      discount: this.off,
      max_usage: this.max_usage,
      min_cart_value: this.min_cart_value,
      validations: 1,
      user_limit_validation: this.user_limit_validation,
      type: this.type,
      expire: this.expire,
      manage: 0,
      short_descriptions: this.descriptions,
      status: 1,
      upto: this.upto,
      for: 1
    };

    this.util.show();
    this.api.post_private('v1/offers/create', param).then((data: any) => {
      this.util.hide();
      if (data && data.status && data.status == 200 && data.success) {
        this.clearData();
        this.myModal2.hide();
        this.util.success(this.util.translate('Added !'));
        this.getList();
      }
    }, error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    });

  }

  updateChanges() {
  
    if (this.name == '' || this.name == null || this.off == '' || this.off == null || this.upto == '' || this.upto == null ||
      this.descriptions == null || this.descriptions == '' || this.expire == '' || this.expire == null ||
      this.max_usage == '' || this.max_usage == null || this.min_cart_value == '' || this.min_cart_value == null || this.user_limit_validation == '' || this.user_limit_validation == null) {
      this.util.error(this.util.translate('All Fields are required'));
      return false;
    }

    if (this.value == '' || this.value == null || this.value.length <= 0) {
      this.util.error(this.util.translate('Please select Freelancers'));
      return false;
    }
    let values = '';
    const ids = this.value.map((x: any) => x.id);
    if (ids && ids.length) {
      values = ids.join();
    }
    const param = {
      name: this.name,
      freelancer_ids: values,
      code: this.name,
      discount: this.off,
      max_usage: this.max_usage,
      min_cart_value: this.min_cart_value,
      validations: 1,
      user_limit_validation: this.user_limit_validation,
      type: this.type,
      expire: this.expire,
      manage: 0,
      short_descriptions: this.descriptions,
      status: 1,
      upto: this.upto,
      id: this.offerId
    };

    this.util.show();
    this.api.post_private('v1/offers/update', param).then((data: any) => {
      this.util.hide();
      if (data && data.status && data.status == 200 && data.success) {
        this.clearData();
        this.myModal2.hide();
        this.util.success(this.util.translate('Updated !'));
        this.getList();
      }
    }, error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }


  openOffers(item: any) {
    this.offerId = item.id;
    this.util.show();
    this.api.post_private('v1/offers/getById', item).then((data: any) => {
      this.util.hide();
      if (data && data.status && data.status == 200 && data.success) {
        this.action = 'edit';
        const info = data.data;
        this.name = info.name;
        this.off = info.discount;
        this.upto = info.upto;
        this.type = info.type;
        this.descriptions = info.short_descriptions;
        this.max_usage = info.max_usage;
        this.min_cart_value = info.min_cart_value;
        this.user_limit_validation = info.user_limit_validation;
        this.expire = moment(info.expire).format('dd/mm/yyyy');
        this.value = info.freelancers;
        this.myModal2.show();
      }
    }, error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
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
