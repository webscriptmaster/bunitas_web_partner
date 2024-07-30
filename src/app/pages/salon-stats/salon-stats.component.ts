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
import * as moment from 'moment';

@Component({
  selector: 'app-salon-stats',
  templateUrl: './salon-stats.component.html',
  styleUrls: ['./salon-stats.component.scss']
})
export class SalonStatsComponent implements OnInit {
  freelancers: any[] = [];
  dummyFreelacer: any[] = [];

  freelancerUId: any = '';

  from: any = '';
  to: any = '';

  appointments: any[] = [];
  apiCalled: boolean;

  freelancerName: any = '';
  freelancerCommistion: any = 0;

  totalAmount: any = 0;
  commisionAmount: any = 0;
  toPay: any = 0;
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.getFreelancer();
  }


  ngOnInit(): void {
  }

  getFreelancer() {
    this.dummyFreelacer = Array(5);
    this.freelancers = [];
    this.api.get_private('v1/salon/getAll').then((data: any) => {
      this.dummyFreelacer = [];
      if (data && data.status && data.status == 200 && data.success) {
        if (data.data.length > 0) {
          this.freelancers = data.data;
        }
      }
    }, error => {
      this.dummyFreelacer = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.dummyFreelacer = [];
      this.util.apiErrorHandler(error);
    });
  }

  getStats() {
    if (this.from && this.to && this.freelancerUId) {
      const store = this.freelancers.filter(x => x.uid == this.freelancerUId);
      if (store && store.length) {
        this.freelancerName = store[0].name;
      }
      const param = {
        id: this.freelancerUId,
        from: moment(this.from, 'YYYY-MM-DD HH:mm A').utc(false).format('YYYY-MM-DD HH:mm'),
        to: moment(this.to, 'YYYY-MM-DD HH:mm A').utc(false).format('YYYY-MM-DD HH:mm'),
      };
      this.util.show();
      this.apiCalled = false;
      this.appointments = [];
      this.api.post_private('v1/salon/getAppointmentsSalonStats', param).then((data: any) => {
        this.apiCalled = true;
        this.util.hide();
        if (data && data.status == 200 && data.data.length) {
          this.freelancerCommistion = parseFloat(data.commission.rate).toFixed(2);
          let total = 0;
          data.data.forEach(async (element: any) => {
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.items)) {
              element.items = JSON.parse(element.items);
              element.save_date = moment(element.save_date).format('dddd, MMMM Do YYYY');
              if (element.status == 4) {
                if (element && element.items && element.items.services && element.items.services.length > 0) {
                  element.items.services.forEach((sub: any) => {
                    if (sub.off > 0) {
                      total = total + parseFloat(sub.off);
                    } else {
                      total = total + parseFloat(sub.price);
                    }
                  });
                }

                if (element && element.items && element.items.packages && element.items.packages.length > 0) {
                  element.items.packages.forEach((sub: any) => {
                    if (sub.off > 0) {
                      total = total + parseFloat(sub.off);
                    } else {
                      total = total + parseFloat(sub.price);
                    }
                  });
                }

              }
              this.appointments.push(element);
            }
          });

          setTimeout(() => {
            function percentage(num: any, per: any) {
              return (num / 100) * per;
            }
            const totalPrice = percentage(total, parseFloat(this.freelancerCommistion));
            this.commisionAmount = totalPrice.toFixed(2);
            this.totalAmount = total;
            this.toPay = this.commisionAmount;
          }, 1000);

        }
      }, error => {
        this.util.hide();
        this.apiCalled = true;
        this.util.error(this.util.translate('Something went wrong'));
      }).catch((error) => {
        this.util.hide();
        this.apiCalled = true;
        this.util.error(this.util.translate('Something went wrong'));
      });
    } else {
      this.util.error(this.util.translate('All Fields are required'));
      return false;
    }
  }

  getCommisions(total: any) {
    return ((parseFloat(total) * this.freelancerCommistion) / 100).toFixed(2);
  }

  donwloadPDF() {

  }
  today() {
    return moment().format('ll');
  }
  getDate(date: any) {
    return moment(date).format('ll');
  }
  getName() {
    return this.freelancerName + '_' + moment(this.from).format('DDMMYYYY') + '_' + moment(this.to).format('DDMMYYYY');
  }

}
