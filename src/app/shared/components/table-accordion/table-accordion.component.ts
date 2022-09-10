import { Product } from 'src/app/features/customers/models/product';
import { Customer } from 'src/app/features/customers/models/customer';
import { Router } from '@angular/router';
import { CustomersService } from 'src/app/features/customers/services/customer/customers.service';
import { MessageService } from 'primeng/api';
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
  customer!: Customer;
  finder: Object[] = [];
  activeProduct!: Product[];
  billingAccountToDelete!: BillingAccount;
  constructor(
    private messageService: MessageService,
    private customerService: CustomersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCustomerById();
    this.messageService.clearObserver.subscribe((data) => {
      if (data == 'reject') {
        this.messageService.clear();
      } else if (data == 'confirm') {
        this.customer.billingAccounts?.forEach((bill) => {
          bill.orders.forEach((ord) => {
            ord.offers?.forEach((ofr) => {
              this.activeProduct = ofr.products.filter((pro) => {
                return pro.status == 'active';
              });
              console.warn(this.activeProduct);
              if (this.activeProduct.length != 0)
                this.finder.push(this.activeProduct);
            });
          });
        });

        if (this.finder.length == 0) {
          this.messageService.clear();
          this.messageService.add({
            key: 'etiya-custom',
            severity: 'warn',
            detail: 'Customer account deleted successfully',
          });
          setTimeout(() => {
            this.messageService.clear();
          }, 3000);
          this.remove();
        } else {
          this.getActiveProductMessage();
        }
      }
    });
  }
  getCustomerById() {
    if (this.customerId == undefined) {
      //toast
    } else {
      this.customerService
        .getCustomerById(this.customerId)
        .subscribe((data) => {
          this.customer = data;
        });
    }
  }
  removePopup(billingAccount: BillingAccount) {
    this.billingAccountToDelete = billingAccount;
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      detail: 'Are you sure to delete this account?',
    });
  }

  remove() {
    this.customerService
      .removeBillingAccount(this.billingAccountToDelete, this.customer)
      .subscribe((data) => {
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
  }

  getActiveProductMessage() {
    this.messageService.clear();
    this.messageService.add({
      key: 'message',
      severity: 'warn',
      detail:
        'There is a product belonging to the account, this account cannot be deleted',
    });
    setTimeout(() => {
      this.messageService.clear();
    }, 5000);
  }

  updateBillingAccount(billingAccount: BillingAccount) {
    this.router.navigateByUrl(
      `/dashboard/customers/${this.customerId}/customer-bill/update/${billingAccount.id}`
    );
  }
}
