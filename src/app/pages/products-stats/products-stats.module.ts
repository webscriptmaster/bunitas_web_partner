/*
  Authors : cosonas (Rahul Jograna)
  Website : https://cosonas.com/
  App Name : Bunitas Management Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://cosonas.com/license
  Copyright and Good Faith Purchasers © 2022-present cosonas.
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsStatsRoutingModule } from './products-stats-routing.module';
import { ProductsStatsComponent } from './products-stats.component';
import { NgxPrintModule } from 'ngx-print';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProductsStatsComponent
  ],
  imports: [
    CommonModule,
    ProductsStatsRoutingModule,
    NgxPrintModule,
    NgxSpinnerModule,
    FormsModule
  ]
})
export class ProductsStatsModule { }
