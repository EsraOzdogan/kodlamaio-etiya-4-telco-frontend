import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CityService } from './../../../city/services/city/city.service';
import { City } from './../../models/city';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Offer } from 'src/app/features/offers/models/offer';
import { OfferService } from 'src/app/features/offers/services/offer/offer.service';
import { OrderService } from 'src/app/features/orders/services/order/order.service';
import { ProductConfigDto } from 'src/app/features/products/models/productConfigDto';
import { Address } from '../../models/address';
import { BillingAccount } from '../../models/billingAccount';
import { Customer } from '../../models/customer';
import { Product } from '../../models/product';
import { CustomersService } from '../../services/customer/customers.service';

@Component({
  templateUrl: './configuration-product.component.html',
  styleUrls: ['./configuration-product.component.css'],
})
export class ConfigurationProductComponent implements OnInit {
  basket!: Offer[];

  selectedCustomerId!: number;
  billingAccountId!: number;
  customer!: Customer;
  billingAccountList!: BillingAccount[];
  billingAdress: Address[] = [];
  isShown: boolean = false;
  cityList!: City[];
  addressForm!: FormGroup;

  constructor(
    private offerService: OfferService,
    private activatedRoute: ActivatedRoute,
    private customersService: CustomersService,
    private orderService: OrderService,
    private cityService: CityService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getParams();
    this.listenBasket();
    this.getCityList();
    this.createAddressForm();
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

  listenBasket() {
    this.offerService.basket$.subscribe((data) => {
      this.basket = [...data];
    });
  }

  isTypeProduct(product: Product, type: string): boolean {
    return product.name.toLowerCase().includes(type);
  }
  handleConfigInput(
    event: any,
    offer: Offer,
    product: Product,
    configurationKey: string
  ) {
    const productConfigDto: ProductConfigDto = {
      key: configurationKey,
      value: event.target.value,
    };

    this.offerService.changeConfigOfProductInBasketInStore(
      offer,
      product,
      productConfigDto
    );
    console.log(event.target.value);
  }
  getConfigValueOfProduct(
    offer: Offer,
    product: Product,
    configurationKey: string
  ): string {
    const findProduct: Product = offer.products.find(
      (p) => p.id === product.id
    ) as Product;
    if (
      findProduct.config == undefined ||
      findProduct.config[configurationKey] == undefined
    )
      return '';

    return findProduct.config[configurationKey];
  }
  getParams() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) this.selectedCustomerId = params['id'];
      if (params['billingAccountId'])
        this.billingAccountId = params['billingAccountId'];
      this.getCustomerById();
    });
  }

  getCustomerById() {
    if (this.selectedCustomerId == undefined) {
      //toast
    } else {
      this.customersService
        .getCustomerById(this.selectedCustomerId)
        .subscribe((data) => {
          this.billingAccountList = data.billingAccounts || [];
          this.billingAccountList?.forEach((bill) => {
            if (this.billingAccountId == bill.id) {
              bill.addresses.forEach((adr) => {
                this.billingAdress.push(adr);
              });
            }
          });
        });
    }
  }
  isSelected(address: Address): boolean {
    if (this.billingAccountList === undefined) return false;
    return Boolean(
      this.billingAccountList.find((addressInList) =>
        addressInList.addresses.forEach((data) => {
          data == address;
        })
      )
    );
  }

  getAddressInfo(address: Address) {
    this.orderService.addAddressToOrderStore(address);
  }
  addOfferToOrder() {
    this.offerService.basket$.subscribe((basket) => {
      console.log('basket: ', basket);
      if (basket === undefined) return;
      this.orderService.addOfferToOrderStore([...basket]);
    });
  }
  handleConfigRadio(event: any) {
    this.billingAdress = this.billingAdress?.map((adr) => {
      const newAddress = { ...adr, isPrimary: false };
      return newAddress;
    });
    let findAddress = this.billingAdress?.find((adr) => {
      return adr.id == event.target.value;
    });
    findAddress!.isPrimary = true;
    this.customersService.update(this.customer).subscribe((data) => {
      this.getCustomerById();
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
    if (this.addressForm.valid) {
      const addressToAdd: Address = {
        ...this.addressForm.value,
        city: this.cityList.find(
          (city) => city.id == this.addressForm.value.city
        ),
      };
      this.billingAdress.push(addressToAdd);
      console.log(addressToAdd);
      this.isShown = false;
    } else {
    }
  }
}
