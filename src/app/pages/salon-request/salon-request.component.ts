/*
  Authors : cosonas (Rahul Jograna)
  Website : https://cosonas.com/
  App Name : Bunitas Management Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://cosonas.com/license
  Copyright and Good Faith Purchasers © 2022-present cosonas.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-salon-request',
  templateUrl: './salon-request.component.html',
  styleUrls: ['./salon-request.component.scss']
})
export class SalonRequestComponent implements OnInit {
  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('imageZoomModal') public imageZoomModal: ModalDirective;
  freelancers: any[] = [];
  dummyFreelacer: any[] = [];
  page: number = 1;
  firstName: any = '';
  lastName: any = '';
  email: any = '';
  password: any = '';
  country_code: any = '';
  mobile: any = '';
  gender: any = '1';
  cover: any = '';
  categories: any[] = [];
  selectedItems = [];
  cities: any[] = [];
  fee_start: any = '';
  lat: any = '';
  lng: any = '';
  dob: any = '';
  descriptions: any = '';
  cityID: any = '';
  zipcode: any = '';
  experience: any = '';
  freelancerId: any = '';
  rate: any = '';
  name: any = '';
  address: any = '';
  zoomImage: any = '';
  zoomTitle: any = '';
  id_card: any= '';
  qualification: any='';
  policy: any='';
  social: any='';
  type: any='';
  sub_type: any='';
  sort: any = [];
  itemsPerPage: number = 10;
  
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.getFreelancer();
  }

  ngOnInit(): void {
  }
  getFreelancer() {
    this.dummyFreelacer = Array(5);
    this.freelancers = [];
    this.api.get_private('v1/request/getSalonRequest').then((data: any) => {
      this.dummyFreelacer = [];
      if (data && data.status && data.status == 200 && data.success) {
        if (data.data.length > 0) {
          this.freelancers = data.data;
        }
      }
    }, error => {
      this.dummyFreelacer = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.dummyFreelacer = [];
      this.util.apiErrorHandler(error);
    });
  }

  reject(item: any) {
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
        this.api.post_private('v1/request/delete', { id: item.id, uid: item.uid }).then((data: any) => {
          this.util.hide();
          if (data && data.status && data.status == 200) {
            this.getFreelancer();
          }
        }).catch(error => {
          this.util.hide();
          this.util.apiErrorHandler(error);
        });
      }
    });
  }

  accept(item: any) {
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('To accept this request?'),
      icon: 'question',
      showConfirmButton: true,
      confirmButtonText: this.util.translate('Yes'),
      showCancelButton: true,
      cancelButtonText: this.util.translate('Cancel'),
      backdrop: false,
      background: 'white'
    }).then((data) => {
      if (data && data.value) {
        this.freelancerId = item.id;
        this.firstName = item.first_name;
        this.lastName = item.last_name;
        this.email = item.email;
        this.password = item.password;
        this.country_code = item.country_code;
        this.mobile = item.mobile;
        this.cityID = item.cid;
        this.dob = item.dob;
        this.cover = item.cover;
        this.descriptions = item.descriptions;
        this.gender = item.gender;
        this.selectedItems = item.web_cates_data;
        this.fee_start = item.hourly_price;
        this.lat = item.lat;
        this.lng = item.lng;
        this.experience = item.total_experience;
        this.zipcode = item.zipcode;
        this.address = item.address;
        this.name = item.name;
        this.id_card = item.id_card;
        this.qualification = item.qualification;
        this.policy = item.policy;
        this.type = item.type;
        this.sub_type = item.sub_type;
        this.social = item.social;
        this.largeModal.show();
      }
    });
  }

  acceptRequest() {
    if (this.rate == '' || this.rate == null) {
      this.util.error(this.util.translate('Please add commission rate'));
      return false;
    }
    const cc: string = (this.country_code).toString();
    if (!cc.includes('+')) {
      this.country_code = '+' + this.country_code
    };

    const param = {
      first_name: this.firstName,
      last_name: this.lastName,
      gender: this.gender,
      cover: this.cover,
      mobile: this.mobile,
      email: this.email,
      country_code: this.country_code,
      password: this.password,
      dob: this.dob,
      cid: this.cityID,
      type: this.type,
      sub_type: this.sub_type,
    };
    this.util.show();
    this.api.post_private('v1/auth/createSalonAccount', param).then((data: any) => {
      this.util.hide();
      if (data.status == 500) {
        this.util.error(data.message);
      }
      if (data && data.status && data.status == 200 && data.user && data.user.id) {
        this.saveSalonProfile(data.user.id);
      } else if (data && data.error && data.error.msg) {
        this.util.error(data.error.msg);
      } else if (data && data.error && data.error.message == 'Validation Error.') {
        for (let key in data.error[0]) {
          this.util.error(data.error[0][key][0]);
        }
      } else {
        this.util.error(this.util.translate('Something went wrong'));
      }
    }, error => {
      this.util.hide();
      if (error && error.error && error.error.status == 500 && error.error.message) {
        this.util.error(error.error.message);
      } else if (error && error.error && error.error.error && error.error.status == 422) {
        for (let key in error.error.error) {
          this.util.error(error.error.error[key][0]);
        }
      } else {
        this.util.error(this.util.translate('Something went wrong'));
      }
    }).catch(error => {
      this.util.hide();
      if (error && error.error && error.error.status == 500 && error.error.message) {
        this.util.error(error.error.message);
      } else if (error && error.error && error.error.error && error.error.status == 422) {
        for (let key in error.error.error) {
          this.util.error(error.error.error[key][0]);
        }
      } else {
        this.util.error(this.util.translate('Something went wrong'));
      }
    });
  }

  saveSalonProfile(uid: any) {
    const ids = this.selectedItems.map((x: any) => x.id);
    const body = {
      uid: uid,
      name: this.name,
      status: 1,
      lat: this.lat,
      lng: this.lng,
      cover: this.cover,
      categories: ids.join(),
      address: this.address,
      about: this.descriptions,
      images: 'NA',
      cid: this.cityID,
      zipcode: this.zipcode,
      rating: 0,
      total_rating: 0,
      website: "NA",
      timing: "NA",
      verified: 1,
      available: 1,
      have_shop: 0,
      service_at_home: 0,
      have_stylist: 0,
      popular: 0,
      in_home: 1,
      extra_field: 'NA',
      rate: this.rate,
      id_card: this.id_card,
      qualification: this.qualification,
      policy: JSON.stringify(this.policy),
      social: this.social,
    };
    this.util.show();
    this.api.post_private('v1/salon/create', body).then((data: any) => {
      this.util.hide();
      if (data && data.status && data.status == 200 && data.success) {
        this.largeModal.hide();
        this.util.success(this.util.translate('Salon added !'));
        this.util.show();
        this.api.post_private('v1/request/delete', { id: this.freelancerId }).then((data: any) => {
          this.util.hide();
          if (data && data.status && data.status == 200) {
            this.getFreelancer();
          }
        }).catch(error => {
          this.util.hide();
          this.util.apiErrorHandler(error);
        });
      }
    }, error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }

  clickZoom(imageUrl: any, type: any) {
    this.zoomImage = imageUrl;
    if (type == 0)
      this.zoomTitle = 'Id Card';
    else
      this.zoomTitle = 'Qualification';
    this.imageZoomModal.show();
  }
  sortOn(column: string) {
    this.sort[column] = (this.sort[column] == '' || this.sort[column] == 'desc') ? 'asc' : 'desc';
    this.sortByColumn(column, this.sort[column]);
  }

  sortByColumn(column:string, direction = 'desc'): any[] {
    let sortedArray = (this.freelancers || []).sort((a,b)=>{
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
