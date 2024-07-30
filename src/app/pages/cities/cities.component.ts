/*
  Authors : cosonas (Rahul Jograna)
  Website : https://cosonas.com/
  App Name : Bunitas Management Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://cosonas.com/license
  Copyright and Good Faith Purchasers © 2022-present cosonas.
*/
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  action = 'create';
  dummy = Array(5);
  cities: any[] = [];
  dummyCities: any[] = [];
  name: any = '';
  cityId: any = '';
  lat: any = '';
  lng: any = '';
  page: number = 1;
  sort: any = [];
  itemsPerPage: number = 10;
  
  constructor(
    public api: ApiService,
    public util: UtilService
  ) {
    this.getAllCities();
  }

  ngOnInit(): void {
  }

  getAllCities() {
    this.cities = [];
    this.dummy = Array(5);
    this.api.get_private('v1/cities/getAll').then((data: any) => {
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.success) {
        if (data.data.length > 0) {
          this.cities = data.data;
          this.dummyCities = data.data;
        }
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
    this.cities = this.filterItems(str);
  }

  protected resetChanges = () => {
    this.cities = this.dummyCities;
  }

  filterItems(searchTerm: any) {
    return this.cities.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  setFilteredItems() {
    this.cities = [];
    this.cities = this.dummyCities;
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
    }).then((data: any) => {
      if (data && data.value) {
        this.util.show();
        this.api.post_private('v1/cities/destroy', { id: item.id }).then((data: any) => {
          this.util.hide();
          if (data && data.status && data.status == 200) {
            this.getAllCities();
          }
        }).catch(error => {
          this.util.hide();
          this.util.apiErrorHandler(error);
        });
      }
    });

  }


  statusUpdate(val: any) {
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
        this.cityId = val.id;
        const body = {
          id: this.cityId,
          status: val.status == 0 ? 1 : 0
        };
        this.util.show();
        this.api.post_private('v1/cities/update', body).then((data: any) => {
          this.util.hide();
          if (data && data.status && data.status == 200 && data.success) {
            this.util.success(this.util.translate('Status Updated !'));
            this.getAllCities();
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

  updateInfo(id: any) {
    this.action = 'update';
    this.cityId = id;
    const body = {
      id: this.cityId,
    };
    this.util.show();
    this.api.post_private('v1/cities/getById', body).then((data: any) => {
      this.util.hide();
      if (data && data.status && data.status == 200 && data.success) {
        this.name = data.data.name;
        this.lat = data.data.lat;
        this.lng = data.data.lng;
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
    this.name = '';
    this.lat = '';
    this.lng = '';
  }


  createCity() {
    if (this.name == '' || this.name == null ||
      this.lat == '' || this.lng == '' || this.lat == null || this.lng == null) {
      this.util.error(this.util.translate('All Fields are required'));
    } else {
      const body = {
        name: this.name,
        status: 1,
        lat: this.lat,
        lng: this.lng
      };
      this.util.show();
      this.api.post_private('v1/cities/create', body).then((data: any) => {
        this.util.hide();
        if (data && data.status && data.status == 200 && data.success) {
          this.clearData();
          this.util.success(this.util.translate('City added !'));
          this.getAllCities();
        }
      }, error => {
        this.util.hide();
        this.util.apiErrorHandler(error);
      }).catch(error => {
        this.util.hide();
        this.util.apiErrorHandler(error);
      });
    }
  }

  updateCity() {
    if (this.name == '' || this.name == null ||
      this.lat == '' || this.lng == '' || this.lat == null || this.lng == null) {
      this.util.error(this.util.translate('All fields are required'));
    }
    else {

      const body = {
        id: this.cityId,
        name: this.name,
      };
      this.util.show();
      this.api.post_private('v1/cities/update', body).then((data: any) => {
        this.util.hide();
        if (data && data.status && data.status == 200 && data.success) {
          this.clearData();
          this.util.success(this.util.translate('City Updated !'));
          this.action = 'create';
          this.getAllCities();
        }
      }, error => {
        this.util.hide();
        this.util.apiErrorHandler(error);
      }).catch(error => {
        this.util.hide();
        this.util.apiErrorHandler(error);
      });
    }
  }
  sortOn(column: string) {
    this.sort[column] = (this.sort[column] == '' || this.sort[column] == 'desc') ? 'asc' : 'desc';
    this.sortByColumn(column, this.sort[column]);
  }

  sortByColumn(column:string, direction = 'desc'): any[] {
    let sortedArray = (this.cities || []).sort((a,b)=>{
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
