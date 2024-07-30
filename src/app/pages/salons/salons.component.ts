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
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-salons',
  templateUrl: './salons.component.html',
  styleUrls: ['./salons.component.scss']
})
export class SalonsComponent implements OnInit {
  @ViewChild('myModal2') public myModal2: ModalDirective;
  @ViewChild('imageZoomModal') public imageZoomModal: ModalDirective;
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
  lat: any = '';
  name: any = '';
  address: any = '';
  social: any = '';
  have_shop: any = false;
  service_at_home: any = false;
  have_stylist: any = false;
  lng: any = '';
  about: any = '';
  website: any = '';
  cityID: any = '';
  zipcode: any = '';
  zoomImage: any = '';
  zoomTitle: any = '';
  policy: any = '';
  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    allowSearchFilter: true
  };
  salons: any[] = [];
  dummySalons: any[] = [];

  salonId: any = '';
  salonUID: any = '';
  action: any = 'create';
  page: number = 1;
  rate: any = '';
  
  sort: any = [];
  itemsPerPage: number = 10;
  
  constructor(
    public api: ApiService,
    public util: UtilService,
  ) {
    this.getAllSalon();
    this.getAllCates();
    this.getAllCities();
  }

  ngOnInit(): void {
  }

  getAllSalon() {
    this.salons = [];
    this.dummySalons = Array(5);

    this.api.get_private('v1/salon/getAll').then((data: any) => {
      this.dummySalons = [];
      if (data && data.status && data.status == 200 && data.success) {
        if (data.data.length > 0) {
          this.salons = data.data;
        }
      }
    }, error => {
      this.dummySalons = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.dummySalons = [];
      this.util.apiErrorHandler(error);
    });
  }

  preview_banner(files: any) {
    if (files.length == 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    if (files) {
      this.util.show();
      this.api.uploadFile(files).subscribe((data: any) => {
        this.util.hide();
        if (data && data.data.image_name) {
          this.cover = data.data.image_name;
        }
      }, err => {
        this.util.hide();
      });
    } else {
    }
  }

  getAllCates() {
    ///getAll
    this.api.get_private('v1/category/getAll').then((data: any) => {
      if (data && data.status && data.status == 200 && data.success) {
        if (data.data.length > 0) {
          this.categories = data.data;
        }
      }
    }, error => {
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.apiErrorHandler(error);
    });
  }

  getAllCities() {
    this.api.get_private('v1/cities/getAll').then((data: any) => {
      if (data && data.status && data.status == 200 && data.success) {
        if (data.data.length > 0) {
          this.cities = data.data;
        }
      }
    }, error => {
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.apiErrorHandler(error);
    });
  }


  exportCSV() {

  }

  importCSV() {

  }

  createNew() {
    this.action = 'create';
    this.myModal2.show();
  }

  createSalon() {
    
    if (this.firstName == '' || this.lastName == '' || this.email == ''
      || this.password == '' || this.country_code == '' || this.mobile == ''
      || this.selectedItems.length <= 0 || this.cityID == '' || this.rate == ''
      || this.zipcode == '' || this.lat == '' || this.lng == '' || this.about == '' || this.address == ''
      || this.mobile == null || this.cover == '' || this.name == '') {
      this.util.error(this.util.translate('All Fields are required'));
      return false;
    }

    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!regex.test(this.email)) {
      this.util.error(this.util.translate('Please enter valid Email ID'));
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
      password: this.password
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
      about: this.about,
      images: 'NA',
      cid: this.cityID,
      zipcode: this.zipcode,
      rating: 0,
      total_rating: 0,
      website: "NA",
      timing: "NA",
      verified: 1,
      available: 1,
      have_shop: this.have_shop == true ? 1 : 0,
      service_at_home: this.service_at_home == true ? 1 : 0,
      have_stylist: this.have_stylist == true ? 1 : 0,
      popular: 0,
      in_home: 1,
      extra_field: 'NA',
      rate: this.rate,
      policy: this.policy,
      social: JSON.stringify(this.social),
    };
    this.util.show();
    this.api.post_private('v1/salon/create', body).then((data: any) => {
      this.util.hide();
      if (data && data.status && data.status == 200 && data.success) {
        this.myModal2.hide();
        this.getAllSalon();
        this.clearData();
        this.util.success(this.util.translate('Salon added !'));
      }
    }, error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }

  clearData() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.country_code = '';
    this.mobile = '';
    this.selectedItems = [];
    this.name = '';
    this.cityID = ''
    this.zipcode = '';
    this.lat = '';
    this.lng = '';
    this.about = '';
    this.cover = '';
    this.have_shop = false;
    this.have_stylist = false;
    this.service_at_home = false;
    this.rate = '';
    this.policy = '';
  }

  changeShop(item: any) {
    const body = {
      id: item.id,
      have_shop: item.have_shop == 0 ? 1 : 0
    };
    this.util.show();
    this.api.post_private('v1/salon/update', body).then((data: any) => {
      this.util.hide();
      if (data && data.status && data.status == 200 && data.success) {
        this.util.success(this.util.translate('Status Updated !'));
        this.getAllSalon();
      }
    }, error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }

  changeHome(item: any) {
    const body = {
      id: item.id,
      in_home: item.in_home == 0 ? 1 : 0
    };
    this.util.show();
    this.api.post_private('v1/salon/update', body).then((data: any) => {
      this.util.hide();
      if (data && data.status && data.status == 200 && data.success) {
        this.util.success(this.util.translate('Status Updated !'));
        this.getAllSalon();
      }
    }, error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }

  changePopular(item: any) {
    const body = {
      id: item.id,
      popular: item.popular == 0 ? 1 : 0
    };
    this.util.show();
    this.api.post_private('v1/salon/update', body).then((data: any) => {
      this.util.hide();
      if (data && data.status && data.status == 200 && data.success) {
        this.util.success(this.util.translate('Status Updated !'));
        this.getAllSalon();
      }
    }, error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }

  changeStylist(item: any) {
    const body = {
      id: item.id,
      have_stylist: item.have_stylist == 0 ? 1 : 0
    };
    this.util.show();
    this.api.post_private('v1/salon/update', body).then((data: any) => {
      this.util.hide();
      if (data && data.status && data.status == 200 && data.success) {
        this.util.success(this.util.translate('Status Updated !'));
        this.getAllSalon();
      }
    }, error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }

  changeServiceAtHome(item: any) {
    const body = {
      id: item.id,
      service_at_home: item.service_at_home == 0 ? 1 : 0
    };
    this.util.show();
    this.api.post_private('v1/salon/update', body).then((data: any) => {
      this.util.hide();
      if (data && data.status && data.status == 200 && data.success) {
        this.util.success(this.util.translate('Status Updated !'));
        this.getAllSalon();
      }
    }, error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }

  deleteItem(item: any) {
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
        const body = {
          id: item.id,
          uid: item.uid
        };
        this.util.show();
        this.api.post_private('v1/salon/destroy', body).then((data: any) => {
          this.util.hide();
          if (data && data.status && data.status == 200 && data.success) {
            this.util.success(this.util.translate('Status Updated !'));
            this.getAllSalon();
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

  updateInfo(id: any, uid: any) {
    this.salonId = id;
    this.salonUID = uid;

    this.util.show();
    this.api.post_private('v1/salon/getById', { id: uid }).then((data: any) => {
      this.util.hide();
      if (data && data.status && data.status == 200) {
        this.action = 'update';
        this.selectedItems = data.data.web_cates_data;
        this.cityID = data.data.cid;
        this.zipcode = data.data.zipcode;
        this.lat = data.data.lat;
        this.lng = data.data.lng;
        this.about = data.data.about;
        this.cover = data.data.cover;
        this.name = data.data.name;
        this.address = data.data.address;
        this.social = JSON.parse(data.data.social);
        this.have_shop = data.data.have_shop;
        this.have_stylist = data.data.have_stylist;
        this.service_at_home = data.data.service_at_home;
        this.policy = data.data.policy;
        this.myModal2.show();
      }
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
    }).then((data) => {
      if (data && data.value) {
        const body = {
          id: item.id,
          status: item.status == 0 ? 1 : 0
        };
        this.util.show();
        this.api.post_private('v1/salon/update', body).then((data: any) => {
          this.util.hide();
          if (data && data.status && data.status == 200 && data.success) {
            this.util.success(this.util.translate('Status Updated !'));
            this.getAllSalon();
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

  updateSalon() {
    if (this.cover == '' || this.name == '' || this.address == '' || this.rate == ''
      || this.about == '' || this.cityID == '' || this.zipcode == '' || this.lat == '' || this.lng == '') {
      this.util.error(this.util.translate('All Fields are required'));
      return false;
    }
    const ids = this.selectedItems.map((x: any) => x.id);
    const body = {
      id: this.salonId,
      name: this.name,
      lat: this.lat,
      lng: this.lng,
      cover: this.cover,
      categories: ids.join(),
      address: this.address,
      about: this.about,
      cid: this.cityID,
      zipcode: this.zipcode,
      have_shop: this.have_shop == true ? 1 : 0,
      service_at_home: this.service_at_home == true ? 1 : 0,
      have_stylist: this.have_stylist == true ? 1 : 0,
      rate: this.rate,
      policy: this.policy,
    };
    this.util.show();
    this.api.post_private('v1/salon/update', body).then((data: any) => {
      this.util.hide();
      if (data && data.status && data.status == 200 && data.success) {
        this.myModal2.hide();
        this.getAllSalon();
        this.clearData();
        this.util.success(this.util.translate('Salon updated !'));
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
    let sortedArray = (this.salons || []).sort((a,b)=>{
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
