import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customer/customers.service';

@Component({
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css'],
})
export class CustomerInfoComponent implements OnInit {
  selectedCustomerId!: number;
  customer!: Customer;
  customerToDelete!: Customer;
  displayBasic!: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomersService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getCustomerById();
    this.messageService.clearObserver.subscribe((data) => {
      if (data == 'reject') {
        this.messageService.clear();
      } else if (data == 'confirm') {
        this.messageService.clear();
        this.messageService.add({
          key: 'message',
          severity: 'warn',
          detail:
            ' Customer cannot be deleted because the customer has active products',
        });

        this.remove();
      }
    });
  }

  getCustomerById() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) this.selectedCustomerId = params['id'];
    });
    if (this.selectedCustomerId == undefined) {
      //toast
    } else {
      this.customerService
        .getCustomerById(this.selectedCustomerId)
        .subscribe((data) => {
          this.customer = data;
        });
    }
  }

  getCustomerId(customer: Customer) {
    this.router.navigateByUrl(`/update-customer/${customer.id}`);
  }

  removePopup(customer: Customer) {
    this.customerToDelete = customer;
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      detail: 'Are you sure to delete this customer?',
    });
  }
  remove() {
    this.customerToDelete.billingAccounts?.forEach((bill) => {
      bill.orders.forEach((ord) => {
        ord.offers?.forEach((ofr) => {
          let findActiveProduct = ofr.products.find((product) => {
            product.status === 'active';
          });
          if (findActiveProduct) {
            this.displayBasic = true;
            return;
          } else {
            this.customerService
              .delete(this.customerToDelete.id as number)
              .subscribe((data) => {
                this.router.navigateByUrl(`/dashboard`);
              });
          }
        });
      });
    });
  }
}
