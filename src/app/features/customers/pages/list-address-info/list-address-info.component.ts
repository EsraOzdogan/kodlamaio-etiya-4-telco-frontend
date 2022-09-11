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
  isChecked!: boolean;
  findAddress!: Address;
  address!: Address[];
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
      if (data == 'reject') {
        this.messageService.clear();
      } else if (data == 'confirm') {
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
      this.messageService.clear();
      this.messageService.add({
        key: 'message',
        severity: 'warn',
        detail:
          'The address cannot be deleted because the customer only has one address',
      });
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
    this.customer.addresses?.forEach((adr) => {
      adr.isPrimary = false;
    });
    //console.log(this.customer.addresses);
    const addressIndex = this.address?.findIndex(
      (address) => address.id === event.target.value
    ) as number;

    // this.findAddress = this.address?.find((adr) => {
    //   return adr.id == event.target.value;
    // }) as Address;
    this.customer.addresses![addressIndex].isPrimary = true;
    //this.findAddress!.isPrimary = true;
    this.isChecked = true;

    this.address.forEach((adr) => {
      const address = { ...adr };
      this.customer.addresses?.push(address);
    });

    console.warn(this.customer.addresses);
    this.customersService.updateAddressInfoToStore(this.findAddress);
  }
}
