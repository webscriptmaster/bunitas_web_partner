/*
  Authors : cosonas (Rahul Jograna)
  Website : https://cosonas.com/
  App Name : Bunitas Management Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://cosonas.com/license
  Copyright and Good Faith Purchasers © 2022-present cosonas.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {
  dummy = Array(5);
  blogs: any[] = [];
  page = 1;
  sort: any = [];
  itemsPerPage: number = 10;

  constructor(
    private router: Router,
    public api: ApiService,
    public util: UtilService
  ) {
    this.getBanners();
  }

  ngOnInit(): void {
  }

  getBanners() {
    this.dummy = Array(5);
    this.blogs = [];
    this.api.get_private('v1/blogs/getAll').then((data: any) => {
      this.dummy = [];
      this.blogs = [];
      if (data && data.status == 200) {
        this.blogs = data.data;
      }
    }).catch((error: any) => {
    });
  }

  addNew() {
    this.router.navigate(['blogs-details']);
  }

  exportCSV() {

  }

  onChange(event: any) {
  }

  onEditorChange(event: any) {
  }

  getClass(item: any) {
    if (item == 1) {
      return 'btn btn-primary btn-round';
    } else if (item == 0) {
      return 'btn btn-danger btn-round';
    }
    return 'btn btn-warning btn-round';
  }

  changeStatus(item: any) {
    const text = item.status == 1 ? 'deactive' : 'active';
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('To ') + text + this.util.translate(' this banner!'),
      icon: 'question',
      showConfirmButton: true,
      confirmButtonText: this.util.translate('Yes'),
      showCancelButton: true,
      cancelButtonText: this.util.translate('Cancle'),
      backdrop: false,
      background: 'white'
    }).then((data: any) => {
      if (data && data.value) {
        const param = {
          id: item.id,
          status: item.status == 1 ? 0 : 1
        };
        this.util.show();
        this.api.post_private('v1/blogs/update', param).then((info) => {
          this.util.hide();
          this.getBanners();
        }, error => {
          this.util.hide();
        }).catch(error => {
          this.util.hide();
        });
      }
    });
  }
  view(item: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: item
      }
    };
    this.router.navigate(['blogs-details'], param);
  }

  deleteItem(item: any) {
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
        this.util.show();
        this.api.post_private('v1/blogs/destroy', { id: item.id }).then((data: any) => {
          this.util.hide();
          if (data && data.status && data.status == 200) {
            this.getBanners();
          }
        }).catch(error => {
          this.util.hide();
          this.util.apiErrorHandler(error);
        });
      }
    });

  }

  sortOn(column: string) {
    this.sort[column] = (this.sort[column] == '' || this.sort[column] == 'desc') ? 'asc' : 'desc';
    this.sortByColumn(column, this.sort[column]);
  }

  sortByColumn(column:string, direction = 'desc'): any[] {
    let sortedArray = (this.blogs || []).sort((a,b)=>{
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
