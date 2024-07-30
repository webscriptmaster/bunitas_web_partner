/*
  Authors : cosonas (Rahul Jograna)
  Website : https://cosonas.com/
  App Name : Bunitas Management Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://cosonas.com/license
  Copyright and Good Faith Purchasers © 2022-present cosonas.
*/
import { Component, OnInit, Renderer2  } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { map, scan } from 'rxjs/operators';

@Component({
  selector: 'app-categories',
  templateUrl: './Services.component.html',
  styleUrls: ['./Services.component.scss']
})
export class ServicesComponent implements OnInit {
  action = 'create';
  dummy = Array(5);
  list: any[] = [];
  dummyList: any[] = [];
  name: any = '';
  cover: any = '';
  page: number = 1;
  cateId: any = '';
  sort: any = [];
  itemsPerPage: number = 10;

  constructor(
    public api: ApiService,
    public util: UtilService,
    private renderer: Renderer2
  ) {
    this.getAll();
  }

  ngOnInit(): void {
  }

  getAll() {
    this.list = [];
    this.dummy = Array(5);
    this.api.get_private('v1/freelancer_services/getAll').then((data: any) => {
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.success) {
        if (data.data.length > 0) {
          this.list = data.data;
          this.dummyList = data.data;
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
    this.list = this.filterItems(str);
  }

  protected resetChanges = () => {
    this.list = this.dummyList;
  }

  filterItems(searchTerm: any) {
    return this.list.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  setFilteredItems() {
    this.list = [];
    this.list = this.dummyList;
  }

  sortOn(column: string) {
    this.sort[column] = (this.sort[column] == '' || this.sort[column] == 'desc') ? 'asc' : 'desc';
    this.sortByColumn(column, this.sort[column]);
  }

  sortByColumn(column:string, direction = 'desc'): any[] {
    let sortedArray = (this.list || []).sort((a,b)=>{
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
  // deleteItem(item: any) {
  //   Swal.fire({
  //     title: this.util.translate('Are you sure?'),
  //     text: this.util.translate('To delete this item?'),
  //     icon: 'question',
  //     showConfirmButton: true,
  //     confirmButtonText: this.util.translate('Yes'),
  //     showCancelButton: true,
  //     cancelButtonText: this.util.translate('Cancel'),
  //     backdrop: false,
  //     background: 'white'
  //   }).then((data) => {
  //     if (data && data.value) {
  //       console.log('update it');
  //       console.log(item);
  //       console.log(item);
  //       this.util.show();
  //       this.api.post_private('v1/category/destroy', { id: item.id }).then((data: any) => {
  //         console.log(data);
  //         this.util.hide();
  //         if (data && data.status && data.status == 200) {
  //           this.getAll();
  //         }
  //       }).catch(error => {
  //         console.log(error);
  //         this.util.hide();
  //         this.util.apiErrorHandler(error);
  //       });
  //     }
  //   });

  // }

  // preview_banner(files: any) {
  //   console.log('fle', files);
  //   if (files.length == 0) {
  //     return;
  //   }
  //   const mimeType = files[0].type;
  //   if (mimeType.match(/image\/*/) == null) {
  //     return;
  //   }

  //   if (files) {
  //     console.log('ok');
  //     this.util.show();
  //     this.api.uploadFile(files).subscribe((data: any) => {
  //       console.log('==>>>>>>', data.data);
  //       this.util.hide();
  //       if (data && data.data.image_name) {
  //         this.cover = data.data.image_name;
  //       }
  //     }, err => {
  //       console.log(err);
  //       this.util.hide();
  //     });
  //   } else {
  //     console.log('no');
  //   }
  // }


  // statusUpdate(val: any) {
  //   Swal.fire({
  //     title: this.util.translate('Are you sure?'),
  //     text: this.util.translate('To update this item?'),
  //     icon: 'question',
  //     showConfirmButton: true,
  //     confirmButtonText: this.util.translate('Yes'),
  //     showCancelButton: true,
  //     cancelButtonText: this.util.translate('Cancel'),
  //     backdrop: false,
  //     background: 'white'
  //   }).then((data) => {
  //     if (data && data.value) {
  //       console.log('update it');
  //       this.cateId = val.id;
  //       const body = {
  //         id: this.cateId,
  //         status: val.status == 0 ? 1 : 0
  //       };
  //       console.log("======", body);
  //       this.util.show();
  //       this.api.post_private('v1/category/update', body).then((data: any) => {
  //         this.util.hide();
  //         console.log("+++++++++++++++", data);
  //         if (data && data.status && data.status == 200 && data.success) {
  //           this.util.success(this.util.translate('Status Updated !'));
  //           this.getAll();
  //         }
  //       }, error => {
  //         this.util.hide();
  //         console.log('Error', error);
  //         this.util.apiErrorHandler(error);
  //       }).catch(error => {
  //         this.util.hide();
  //         console.log('Err', error);
  //         this.util.apiErrorHandler(error);
  //       });
  //     }
  //   });

  // }

  // updateInfo(id: any) {
  //   this.action = 'update';
  //   this.cateId = id;
  //   const body = {
  //     id: this.cateId,
  //   };
  //   console.log("CAT BY ID => ", body);
  //   this.util.show();
  //   this.api.post_private('v1/category/getById', body).then((data: any) => {
  //     console.log(data);
  //     this.util.hide();
  //     if (data && data.status && data.status == 200 && data.success) {
  //       this.name = data.data.name;
  //       this.cover = data.data.cover;
  //     }
  //   }, error => {
  //     this.util.hide();
  //     console.log('Error', error);
  //     this.util.apiErrorHandler(error);
  //   }).catch(error => {
  //     this.util.hide();
  //     console.log('Err', error);
  //     this.util.apiErrorHandler(error);
  //   });
  // }

  // clearData() {
  //   console.log("CLEAR DATA");
  //   this.cover = '';
  //   this.name = '';
  // }


  // createCategory() {
  //   if (this.name == '' || this.name == null || this.cover == '') {
  //     this.util.error(this.util.translate('All Fields are required'));
  //   } else {
  //     const body = {
  //       name: this.name,
  //       status: 1,
  //       cover: this.cover
  //     };
  //     this.util.show();
  //     this.api.post_private('v1/category/create', body).then((data: any) => {
  //       console.log("+++++++++++++++", data);
  //       this.util.hide();
  //       if (data && data.status && data.status == 200 && data.success) {
  //         this.clearData();
  //         this.util.success(this.util.translate('Added !'));
  //         this.getAll();
  //       }
  //     }, error => {
  //       this.util.hide();
  //       console.log('Error', error);
  //       this.util.apiErrorHandler(error);
  //     }).catch(error => {
  //       this.util.hide();
  //       console.log('Err', error);
  //       this.util.apiErrorHandler(error);
  //     });
  //   }
  // }

  // updateCategory() {
  //   if (this.name == '' || this.name == null || this.cover == '') {
  //     this.util.error(this.util.translate('All fields are required'));
  //   }
  //   else {

  //     const body = {
  //       id: this.cateId,
  //       name: this.name,
  //       cover: this.cover
  //     };
  //     console.log("======", body);
  //     this.util.show();
  //     this.api.post_private('v1/category/update', body).then((data: any) => {
  //       console.log("+++++++++++++++", data);
  //       this.util.hide();
  //       if (data && data.status && data.status == 200 && data.success) {
  //         this.clearData();
  //         this.util.success(this.util.translate('Updated !'));
  //         this.action = 'create';
  //         this.getAll();
  //       }
  //     }, error => {
  //       this.util.hide();
  //       console.log('Error', error);
  //       this.util.apiErrorHandler(error);
  //     }).catch(error => {
  //       this.util.hide();
  //       console.log('Err', error);
  //       this.util.apiErrorHandler(error);
  //     });
  //   }
  // }


}
