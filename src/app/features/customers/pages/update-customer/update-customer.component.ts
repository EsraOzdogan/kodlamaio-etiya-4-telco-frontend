import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customer/customers.service';
import { formatDate } from '@angular/common';

@Component({
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.css'],
})
export class UpdateCustomerComponent implements OnInit {
  updateCustomerForm!: FormGroup;
  selectedCustomerId!: number;
  customer!: Customer;
  today: Date = new Date();
  futureDate: Boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomersService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getCustomerById();
  }

  createFormUpdateCustomer() {
    let bDate = new Date();
    if (this.customer.birthDate) {
      bDate = new Date(this.customer.birthDate);
    }
    this.updateCustomerForm = this.formBuilder.group({
      firstName: [this.customer.firstName, Validators.required],
      middleName: [this.customer.middleName],
      lastName: [this.customer.lastName, Validators.required],
      birthDate: [
        formatDate(new Date(bDate), 'yyyy-MM-dd', 'en'),
        Validators.required,
      ],
      gender: [this.customer.gender, Validators.required],
      fatherName: [this.customer.fatherName],
      motherName: [this.customer.motherName],
      nationalityId: [
        this.customer.nationalityId,
        [Validators.pattern('^[0-9]{11}$'), Validators.required],
      ],
    });
  }
  onDateChange(event: any) {
    let date = new Date(event.target.value);
    if (date.getFullYear() > this.today.getFullYear()) {
      this.updateCustomerForm.get('birthDate')?.setValue('');
      this.futureDate = true;
    } else {
      this.futureDate = false;
    }
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

          this.createFormUpdateCustomer();
        });
    }
  }

  updateCustomer() {
    const customer: Customer = Object.assign(
      { id: this.customer.id },
      this.updateCustomerForm.value
    );
    this.customerService
      .updateDemographicInfo(customer, this.customer)
      .subscribe(() => {
        this.router.navigateByUrl(
          `/dashboard/customers/customer-info/${customer.id}`
        );
        this.messageService.add({
          detail: 'Sucsessfully updated',
          severity: 'success',
          summary: 'Update',
          key: 'etiya-custom',
        });
      });
  }

  checkInvalid() {
    if (this.updateCustomerForm.invalid) {
      this.messageService.add({
        detail: 'Error created',
        severity: 'danger',
        summary: 'Error',
        key: 'etiya-custom',
      });
      return;
    }
    if (
      this.updateCustomerForm.value.nationalityId ===
      this.customer.nationalityId
    )
      this.updateCustomer();
    else this.checkTcNum(this.updateCustomerForm.value.nationalityId);
  }
  checkTcNum(id: number) {
    this.customerService.getList().subscribe((response) => {
      let matchCustomer = response.find((item) => {
        return item.nationalityId == id;
      });
      if (matchCustomer) {
        this.messageService.add({
          detail: 'Error created',
          severity: 'danger',
          summary: 'Error',
          key: 'etiya-custom',
        });
      } else this.updateCustomer();
    });
  }
  update() {
    this.checkInvalid();
  }
}
