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

import { UsersDetailsRoutingModule } from './users-details-routing.module';
import { UsersDetailsComponent } from './users-details.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  declarations: [
    UsersDetailsComponent
  ],
  imports: [
    CommonModule,
    UsersDetailsRoutingModule,
    ModalModule.forRoot(),
    FormsModule,
    NgxSpinnerModule,
    NgxSkeletonLoaderModule.forRoot({ animation: 'progress-dark' }),
    NgxPaginationModule,
    TabsModule,
  ]
})
export class UsersDetailsModule { }
