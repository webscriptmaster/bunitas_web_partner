/*
  Authors : cosonas (Rahul Jograna)
  Website : https://cosonas.com/
  App Name : Bunitas Management Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://cosonas.com/license
  Copyright and Good Faith Purchasers © 2022-present cosonas.
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  styleUrls: ['./users-details.component.scss']
})
export class UsersDetailsComponent implements OnInit {
  uid: any = '';
  name: any = '';
  cover: any = '';
  email: any = '';
  phone: any = '';
  cid: any = '';
  dob: any = '';

  appointments: any[] = [];
  productsOrders: any[] = [];
  address: any[] = [];
  ratings: any[] = [];
  ratingsProducts: any[] = [];
  constructor(
    public util: UtilService,
    public api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((data: any) => {
      if (data && data.id) {
        this.uid = data.id;
        this.getUserInfo();
      }
    });
  }



  getUserInfo() {
    this.util.show();
    this.api.post_private('v1/users/userInfoAdmin', { id: this.uid }).then((data: any) => {
      this.util.hide();
      if (data && data.status && data.status == 200) {
        const info = data.data;
        this.name = info.user.first_name + ' ' + info.user.last_name;
        this.cover = info.user.cover;
        this.email = info.user.email;
        this.phone = info.user.country_code + info.user.mobile;
        this.cid = info.user.cid;
        this.dob = info.user.dob;
        info.appointments.forEach((element: any) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.items)) {
            element.items = JSON.parse(element.items);
            element.created_at = moment(element.created_at).format('dddd, MMMM Do YYYY');
          }
        });
        info.productsOrders.forEach((element: any) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
          }
        });
        this.appointments = info.appointments;
        this.productsOrders = info.productsOrders;
        this.address = info.address;
        this.ratings = info.rating;
        this.ratingsProducts = info.ratingProducts;
      }
    }, error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }
  ngOnInit(): void {
  }

  getImage() {
    return this.api.imageUrl + this.cover;
  }

  viewData(id: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: id
      }
    }
    this.router.navigate(['appointments-details'], param);
  }

  viewDataProduct(id: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: id
      }
    }
    this.router.navigate(['orders-details'], param);
  }

  getTitle(num: any) {
    const title = [this.util.translate('Home'), this.util.translate('Work'), this.util.translate('Others')];
    return title[num];
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
            // this.getList();
            this.address = this.address.filter(x => x.id! = item.id);
          }
        }).catch(error => {
          this.util.hide();
          this.util.apiErrorHandler(error);
        });
      }
    });
  }

  getDate(date: any) {
    return moment(date).format('lll');
  }
}
