/*
  Authors : cosonas (Rahul Jograna)
  Website : https://cosonas.com/
  App Name : Bunitas Management Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://cosonas.com/license
  Copyright and Good Faith Purchasers © 2022-present cosonas.
*/
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { brandSet, flagSet, freeSet } from '@coreui/icons';
import { Title } from '@angular/platform-browser';
import { ApiService } from './services/api.service';
import { UtilService } from './services/util.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'Bunitas Management';

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
    private api: ApiService,
    public util: UtilService,
    private translate: TranslateService,
  ) {
    titleService.setTitle(this.title);

    // iconSet singleton
    iconSetService.icons = { ...brandSet, ...flagSet, ...freeSet };
    this.api.get_public('v1/settings/getDefault').then((data: any) => {
      if (data && data.status && data.status == 200) {
        const settings = data && data.data && data.data.settings ? data.data.settings : null;

        if (settings) {
          this.util.general = settings;
          this.util.appLogo = settings.logo;
          this.util.direction = settings.appDirection;
          this.util.app_status = settings.app_status == 1 ? true : false;
          this.util.app_color = settings.app_color;
          this.util.driver_assign = settings.driver_assign;
          this.util.cside = settings.currencySide;
          this.util.currecny = settings.currencySymbol;
          document.documentElement.dir = this.util.direction;

          const lng = localStorage.getItem('selectedLanguage');
          if (!lng || lng == null) {
            localStorage.setItem('selectedLanguage', 'en');
            localStorage.setItem('direction', 'ltr');
          }

          this.translate.use(localStorage.getItem('selectedLanguage') || 'en');
          const direaction = localStorage.getItem('direction') as string;
          document.documentElement.dir = direaction;

        }


      }
    }, error => {
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.apiErrorHandler(error);
    });

    this.api.getLocalAssets('country.json').then((data: any) => {
      this.util.countrys = data;
    }).catch(error => {
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }
}
