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
  selector: 'app-product-sub-category',
  templateUrl: './product-sub-category.component.html',
  styleUrls: ['./product-sub-category.component.scss']
})
export class ProductSubCategoryComponent implements OnInit {
  action = 'create';
  dummy = Array(10);
  list: any[] = [];
  dummyList: any[] = [];
  name: any = '';
  cover: any = '';
  page: number = 1;
  mainCateId: any = '';
  subCateId: any = '';
  category: any[] = [];
  
  sort: any = [];
  itemsPerPage: number = 10;
  
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.getCategories();
    this.getAll();
  }
  ngOnInit(): void {
  }

  getCategories() {
    this.api.get_private('v1/product_categories/getAll').then((data: any) => {
      if (data && data.status && data.status == 200 && data.success) {
        if (data.data.length > 0) {
          this.category = data.data;
        }
      }
    }, error => {
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.apiErrorHandler(error);
    });
  }

  getAll() {
    ///getAll
    this.list = [];
    this.dummy = Array(10);
    this.api.get_private('v1/product_sub_categories/getAll').then((data: any) => {
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
    }).then((data) => {
      if (data && data.value) {
        this.util.show();
        this.api.post_private('v1/product_sub_categories/destroy', { id: item.id }).then((data: any) => {
          this.util.hide();
          if (data && data.status && data.status == 200) {
            this.getAll();
          }
        }).catch(error => {
          this.util.hide();
          this.util.apiErrorHandler(error);
        });
      }
    });

  }

  preview_banner(files: any) {
    if (files.length == 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    if (files) {
      this.util.show();
      this.api.uploadFile(files).subscribe((data: any) => {
        this.util.hide();
        if (data && data.data.image_name) {
          this.cover = data.data.image_name;
        }
      }, err => {
        this.util.hide();
      });
    } else {
    }
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
    }).then((data) => {
      if (data && data.value) {
        this.subCateId = val.id;
        const body = {
          id: this.subCateId,
          status: val.status == 0 ? 1 : 0
        };
        this.util.show();
        this.api.post_private('v1/product_sub_categories/update', body).then((data: any) => {
          this.util.hide();
          if (data && data.status && data.status == 200 && data.success) {
            this.util.success(this.util.translate('Status Updated !'));
            this.getAll();
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
    this.subCateId = id;
    const body = {
      id: this.subCateId,
    };
    this.util.show();
    this.api.post_private('v1/product_sub_categories/getById', body).then((data: any) => {
      this.util.hide();
      if (data && data.status && data.status == 200 && data.success) {
        this.name = data.data.name;
        this.cover = data.data.cover;
        this.mainCateId = data.data.cate_id;
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
    this.cover = '';
    this.name = '';
    this.mainCateId = '';
  }


  createCategory() {
    if (this.name == '' || this.name == null || this.cover == '' || this.mainCateId == '') {
      this.util.error(this.util.translate('All Fields are required'));
    } else {
      const body = {
        name: this.name,
        cate_id: this.mainCateId,
        cover: this.cover
      };
      this.util.show();
      this.api.post_private('v1/product_sub_categories/create', body).then((data: any) => {
        this.util.hide();
        if (data && data.status && data.status == 200 && data.success) {
          this.clearData();
          this.util.success(this.util.translate('Added !'));
          this.getAll();
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

  updateCategory() {
    if (this.name == '' || this.name == null || this.cover == '' || this.mainCateId == '') {
      this.util.error(this.util.translate('All fields are required'));
    }
    else {
      const body = {
        id: this.subCateId,
        name: this.name,
        cate_id: this.mainCateId,
        cover: this.cover
      };
      this.util.show();
      this.api.post_private('v1/product_sub_categories/update', body).then((data: any) => {
        this.util.hide();
        if (data && data.status && data.status == 200 && data.success) {
          this.clearData();
          this.util.success(this.util.translate('Updated !'));
          this.action = 'create';
          this.getAll();
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
}
