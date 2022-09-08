import { Customer } from './../../models/customer';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from '../../models/address';
import { CustomersService } from '../../services/customer/customers.service';

@Component({
  templateUrl: './customer-address.component.html',
  styleUrls: ['./customer-address.component.css'],
})
export class CustomerAddressComponent implements OnInit {
  selectedCustomerId!: number;
  customerAddress: Address[] = [];
  isChecked!: boolean;
  customer!: Customer;
  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCustomerById();
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
          data.addresses?.forEach((adress) => {
            this.customerAddress.push(adress);
          });
        });
    }
  }

  addAddressBySelectedId() {
    this.router.navigateByUrl(
      `/dashboard/customers/${this.selectedCustomerId}/address/add`
    );
  }

  selectAddressId(addressId: number) {
    this.router.navigateByUrl(
      `/dashboard/customers/${this.selectedCustomerId}/address/update/${addressId}`
    );
  }
  removeAddress(adr: Address) {
    this.customerService.deleteAddress(this.selectedCustomerId);

    this.customerService.delete(adr.id).subscribe((data) => {
      //this.toastrService.success(data.description, " silindi")
      setTimeout(() => {
        location.reload();
      }, 5000);
    });
  }

  handleConfigInput(event: any) {
    this.customer.addresses = this.customer.addresses?.map((adr) => {
      const newAddress = { ...adr, isMain: false };
      return newAddress;
    });
    let findAddress = this.customer.addresses?.find((adr) => {
      return adr.id == event.target.value;
    });
    findAddress!.isMain = true;
    this.customerService.update(this.customer).subscribe((data) => {
      console.log(data);
    });
  }
}
