import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CityService } from 'src/app/features/city/services/city/city.service';
import { Address } from '../../models/address';
import { City } from '../../models/city';
import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customer/customers.service';

@Component({
  templateUrl: './update-create-bill-account-address.component.html',
  styleUrls: ['./update-create-bill-account-address.component.css']
})
export class UpdateCreateBillAccountAddressComponent implements OnInit {
  addressForm!: FormGroup;
  selectedCustomerId!: number;
  selectedAddressId!: number;
  customer!: Customer;
  addressToUpdate!: Address;
  cityList!: City[];

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomersService,
    private router: Router,
    private messageService: MessageService,
    private cityService: CityService
  ) {}

  ngOnInit(): void {
    
  }


  createAddressForm() {
    this.addressForm = this.formBuilder.group({
      city: [this.addressToUpdate?.city.id || 0, Validators.required],
      street: [this.addressToUpdate?.street || '', Validators.required],
      flatNumber: [this.addressToUpdate?.flatNumber || '', Validators.required],
      description: [
        this.addressToUpdate?.description || '',
        Validators.required,
      ],
    });
  }

  getCityList() {
    this.cityService.getList().subscribe((data) => {
      this.cityList = data;
    });
  }

  save(){
    
  }
 

}
