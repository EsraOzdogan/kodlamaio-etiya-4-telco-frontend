import { MessageService } from 'primeng/api';
import { Product } from './../../../features/customers/models/product';
import { Component, Input, OnInit } from '@angular/core';
import { BillingAccount } from 'src/app/features/customers/models/billingAccount';

@Component({
  selector: 'app-table-accordion',
  templateUrl: './table-accordion.component.html',
  styleUrls: ['./table-accordion.component.css'],
})
export class TableAccordionComponent implements OnInit {
  @Input() billingAccount!: BillingAccount;
  @Input() customerId!: number;
  //displayBasic!: boolean;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.messageService.clearObserver.subscribe((data) => {
      if (data == 'r') {
        this.messageService.clear();
      } else if (data == 'c') {
        this.removeBillingAccount();
      }
    });
  }

  removePopup(billingAccount: BillingAccount) {
    // if (this.billingAccount) {
    //   //this.displayBasic = true;
    //   return;
    // }
    //this.addressToDelete = address;
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      detail: 'Are you sure to delete this account?',
    });
  }

  removeBillingAccount() {
    //alert('aaaaaaaa');
  }
}
