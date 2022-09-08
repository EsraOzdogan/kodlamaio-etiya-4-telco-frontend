import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customer/customers.service';
import { Address } from '../../models/address';

@Component({
  selector: 'app-list-address-info',
  templateUrl: './list-address-info.component.html',
  styleUrls: ['./list-address-info.component.css'],
})
export class ListAddressInfoComponent implements OnInit {
  customer!: Customer;
  addressToDelete!: Address;
  displayBasic!: boolean;
  constructor(
    private customersService: CustomersService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.customersService.customerToAddModel$.subscribe((state) => {
      this.customer = state;
    });
    this.messageService.clearObserver.subscribe((data) => {
      if (data == 'r') {
        this.messageService.clear();
      } else if (data == 'c') {
        this.remove();
      }
    });
  }
  selectAddressId(id: number) {
    let address = this.customer.addresses?.find((c) => c.id == id);
    this.router.navigateByUrl(`update-address-info/${address?.id}`);
  }
  removePopup(address: Address) {
    if (this.customer.addresses && this.customer.addresses?.length <= 1) {
      this.displayBasic = true;
      return;
    }
    this.addressToDelete = address;
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      detail: 'Are you sure to delete this address?',
    });
  }
  remove() {
    this.customersService.removeAdress(this.addressToDelete);
  }
  handleConfigInput(event: any) {
    console.warn(event.isTrusted);
    this.customer.addresses?.forEach((adr) => {
      if (adr.id == event.target.value) adr.isMain = true;
      else {
        adr.isMain = false;
      }
    });
    console.warn(this.customer.addresses);
  }
}
