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
  primaryAddres!: number;
  newAddress!: Address[];
  displayBasic!: boolean;
  addressToDelete!: Address;
  findToAddress!: Address;
  addressToUpdate!: any;
  selectedAddressId!: number;
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
    this.getPrimaryAddress();
    this.messageService.clearObserver.subscribe((data) => {
      if (data == 'reject') {
        this.messageService.clear();
      } else if (data == 'confirm') {
        this.remove();
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
      city: [this.addressToUpdate?.city?.id || 0, Validators.required],
      street: [this.addressToUpdate?.street || '', Validators.required],
      flatNumber: [this.addressToUpdate?.flatNumber || '', Validators.required],
      description: [
        this.addressToUpdate?.description || '',
        Validators.required,
      ],
    });
  }

  addNewAddressBtn() {
    this.isShown = true;
    this.createAddressForm();
  }

  selectAddressId(addressId: number) {
    this.isShown = true;
    this.selectedAddressId = addressId;
    this.addressToUpdate = this.billingAdress.find(
      (bill) => bill.id == addressId
    );
    console.warn(this.addressToUpdate);
    this.createAddressForm();
  }

  getCityList() {
    this.cityService.getList().subscribe((data) => {
      this.cityList = data;
    });
  }

  saveAddress() {
    if (this.selectedAddressId) {
      this.updateAddress();
    } else {
      this.addAddress();
    }
  }

  addAddress() {
    const addressToAdd: Address = {
      ...this.addressForm.value,
      city: this.cityList.find(
        (city) => city.id == this.addressForm.value.city
      ),
      isPrimary: false,
    };
    this.billingAdress.push(addressToAdd);
    this.isShown = false;
    this.newAddress = [...this.billingAdress, this.addresses];
    console.warn(this.newAddress);
  }
  updateAddress() {
    const addressIndex = this.billingAdress.findIndex((b) => {
      return b.id == this.addressToUpdate.id;
    });

    const addressToUpdate: Address = {
      ...this.addressForm.value,
      id: this.selectedAddressId,
      city: this.cityList.find(
        (city) => city.id == this.addressForm.value.city
      ),
      isPrimary: this.getSelectedisPrimary(),
    };

    console.warn(this.addressForm.value);
    this.billingAdress![addressIndex] = addressToUpdate;
    this.isShown = false;
  }
  getSelectedisPrimary() {
    let selectedAddress = this.billingAdress.find(
      (address) => address.id == this.selectedAddressId
    );
    return selectedAddress?.isPrimary;
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
  getPrimaryAddress() {
    this.customerService
      .getCustomerById(this.selectedCustomerId)
      .subscribe((data) => {
        data.addresses?.forEach((adr) => {
          if (adr.isPrimary == true) this.addresses = adr;
        });
      });
  }
  handleConfigInput(event: any) {
    this.primaryAddres = event.target.value;

    this.newAddress = this.newAddress?.map((adr) => {
      const newAddress = { ...adr, isPrimary: false };
      return newAddress;
    });
    let findAddressBill = this.newAddress.find((adr) => {
      return adr.id == event.target.value;
    });

    if (this.addresses === findAddressBill) {
      this.addresses.isPrimary = true;
    } else {
      this.addresses.isPrimary = false;
    }
    this.billingAdress.forEach((bill) => {
      if (bill.id === findAddressBill?.id) {
        bill.isPrimary = true;
      } else {
        bill.isPrimary = false;
      }
    });
    this.customerService.update(this.customer).subscribe((data) => {});
  }

  removePopup(address: Address) {
    // if (this.billingAdress && this.billingAdress?.length <= 1) {
    //   this.displayBasic = true;
    //   return;
    // }
    this.addressToDelete = this.newAddress.find((adr) => {
      return adr.id == address.id;
    }) as Address;
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      detail: 'Are you sure to delete this address?',
    });
  }
  remove() {
    this.billingAdress = this.billingAdress.filter(
      (b) => b.id != this.addressToDelete.id
    );
    this.messageService.clear('c');
  }
}
