/*
  Authors : cosonas (Rahul Jograna)
  Website : https://cosonas.com/
  App Name : Bunitas Management Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://cosonas.com/license
  Copyright and Good Faith Purchasers © 2022-present cosonas.
*/
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(
    private classToggler: ClassToggleService,
    public util: UtilService,
    public api: ApiService,
    public router: Router) {
    super();
  }

  logout() {
    this.util.show();
    this.api.post_private('v1/profile/logout', {}).then((data) => {
      this.util.hide();
      localStorage.removeItem('uid');
      localStorage.removeItem('token');
      this.router.navigateByUrl('/login');
    }, error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }
}
