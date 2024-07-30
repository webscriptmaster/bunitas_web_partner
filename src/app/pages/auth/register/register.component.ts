/*
  Authors : cosonas (Rahul Jograna)
  Website : https://cosonas.com/
  App Name : Bunitas Management Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://cosonas.com/license
  Copyright and Good Faith Purchasers © 2022-present cosonas.
*/
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  first_name: any = '';
  last_name: any = '';
  email: any = '';
  password: any = '';
  mobile: any = '';
  country_code: any = '';
  confirm_password: any = '';
  submited: any = false;
  constructor(
    private router: Router,
    private location: Location,
    public api: ApiService,
    public util: UtilService
  ) {

  }

  onRegister() {
    this.submited = true;
    if (this.first_name == '' || this.last_name == '' || this.country_code == '' ||
      this.email == '' || this.mobile == '' || this.password == '' || this.confirm_password == '') {
      this.util.error(this.util.translate('All Fields are required'));
      return false;
    }
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!regex.test(this.email)) {
      this.util.error(this.util.translate('Please enter valid Email ID'));
      return false;
    }

    if (this.password !== this.confirm_password) {
      this.util.error(this.util.translate(`Password doesn't match..`));
      return false;
    }
    const cc: string = (this.country_code).toString();
    if (!cc.includes('+')) {
      this.country_code = '+' + this.country_code
    };
    const param = {
      first_name: this.first_name,
      last_name: this.last_name,
      mobile: this.mobile,
      email: this.email,
      country_code: this.country_code,
      password: this.password
    };
    this.util.show();
    this.api.post('v1/auth/create_admin_account', param).then((data: any) => {
      this.util.hide();
      if (data.status == 500) {
        this.util.error(data.message);
      }
      if (data && data.status && data.status == 200 && data.user && data.user.id) {
        this.util.success(this.util.translate('Account created successfully'));
        this.router.navigate(['login']);
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
}
