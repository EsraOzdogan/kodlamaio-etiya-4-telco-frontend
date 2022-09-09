import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CityService } from 'src/app/features/city/services/city/city.service';
import { City } from '../../../models/city';
import { CustomersService } from '../../../services/customer/customers.service';
import { Address } from '../../../models/address';
import { Customer } from '../../../models/customer';
import { BillingAccount } from '../../../models/billingAccount';

@Component({
  templateUrl: './customer-billing-account.component.html',
  styleUrls: ['./customer-billing-account.component.css'],
})
export class CustomerBillingAccountComponent implements OnInit {
  accountForm!: FormGroup;
  addressForm!: FormGroup;
  isShown: boolean = false;
  cityList!: City[];
  selectedCustomerId!: number;
  customer!: Customer;
  billingAccount!: BillingAccount;
  billingAdress: Address[] = [];
  addresses!: Address;
  mainAddres!: number;
  newAddress!: Address[];
  displayBasic!: boolean;
  addressToDelete!: Address;
  findToAddress!: Address;

  constructor(
    private formBuilder: FormBuilder,
    private cityService: CityService,
    private customerService: CustomersService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getParams();
    this.getCityList();
    this.getMainAddress();
    this.messageService.clearObserver.subscribe((data) => {
      if (data == 'r') {
        this.messageService.clear();
      } else if (data == 'c') {
        this.removeAddress();
      }
    });
  }

  getParams() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) this.selectedCustomerId = Number(params['id']);
      this.getCustomerById();
    });
  }

  getCustomerById() {
    if (this.selectedCustomerId == undefined) {
      //toast
    } else {
      this.customerService
        .getCustomerById(this.selectedCustomerId)
        .subscribe((data) => {
          this.customer = data;
          this.createAddressForm();
          this.createAccountForm();
        });
    }
  }

  createAccountForm() {
    this.accountForm = this.formBuilder.group({
      accountName: ['', Validators.required],
      accountDescription: ['', Validators.required],
    });
  }

  createAddressForm() {
    this.addressForm = this.formBuilder.group({
      id: [Math.floor(Math.random() * 1000)],
      city: ['', Validators.required],
      street: ['', Validators.required],
      flatNumber: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  addNewAddressBtn() {
    this.isShown = true;
    this.createAddressForm();
  }

  getCityList() {
    this.cityService.getList().subscribe((data) => {
      this.cityList = data;
    });
  }

  addAddress() {
    const addressToAdd: Address = {
      ...this.addressForm.value,
      city: this.cityList.find(
        (city) => city.id == this.addressForm.value.city.id
      ),
      isMain: false,
    };
    this.billingAdress.push(addressToAdd);
    //console.log(this.billingAdress);
    this.isShown = false;
    this.newAddress = [...this.billingAdress, this.addresses];
  }

  add() {
    let newBillingAccount: BillingAccount = {
      ...this.accountForm.value,
      addresses: [...this.billingAdress, this.addresses],
    };
    this.customerService
      .addBillingAccount(newBillingAccount, this.customer)
      .subscribe();
    this.router.navigateByUrl(
      '/dashboard/customers/customer-billing-account-detail/' +
        this.selectedCustomerId
    );
  }
  getMainAddress() {
    this.customerService
      .getCustomerById(this.selectedCustomerId)
      .subscribe((data) => {
        data.addresses?.forEach((adr) => {
          if (adr.isMain == true) this.addresses = adr;
        });
      });
  }
  handleConfigInput(event: any) {
    this.mainAddres = event.target.value;

    this.newAddress = this.newAddress?.map((adr) => {
      const newAddress = { ...adr, isMain: false };
      return newAddress;
    });
    let findAddressBill = this.newAddress.find((adr) => {
      return adr.id == event.target.value;
    });

    if (this.addresses === findAddressBill) {
      this.addresses.isMain = true;
    } else {
      this.addresses.isMain = false;
    }
    this.billingAdress.forEach((bill) => {
      if (bill.id === findAddressBill?.id) {
        bill.isMain = true;
      } else {
        bill.isMain = false;
      }
    });
    this.customerService.update(this.customer).subscribe((data) => {
      //this.getCustomerById();
    });
  }

  selectAddressId(addressId: number) {
    this.router.navigateByUrl(
      `/dashboard/customers/${this.selectedCustomerId}/address/update/${addressId}`
    );
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

  removeAddress() {
    this.customerService
      .deleteAddress(this.customer, this.addressToDelete)
      .subscribe((data) => {
        this.getCustomerById();
        //location.reload();
      });
  }
}
