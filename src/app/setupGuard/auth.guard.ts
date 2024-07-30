/*
  Authors : cosonas (Rahul Jograna)
  Website : https://cosonas.com/
  App Name : Bunitas Management Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://cosonas.com/license
  Copyright and Good Faith Purchasers © 2022-present cosonas.
*/
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SetupAuthGuard implements CanActivate {

  constructor(
    public api: ApiService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): any {
    return this.api.get_public('v1/users/get_admin').then((user: any) => {
      if (user && user.status == 200) {
        return true;
      } else {
        this.router.navigate(['/register']);
      }
    }).catch(error => {
      this.router.navigate(['/register']);
    });
  }
}
