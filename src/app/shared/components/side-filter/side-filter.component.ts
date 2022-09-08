import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from 'src/app/features/customers/services/customer/customers.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-side-filter',
  templateUrl: './side-filter.component.html',
  styleUrls: ['./side-filter.component.css'],
})
export class SideFilterComponent implements OnInit {
  @Input() filterTitle!: string;
  searchForm!: FormGroup;
  @Output() filteredData: any = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder,
    private customersService: CustomersService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.createSearchForm();
  }

  createSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      nationalityId: ['', Validators.pattern('[0-9]{}')],
      customerId: ['', Validators.pattern('[0-9]{}')],
      accountNumber: ['', Validators.pattern('[0-9]{}')],
      gsmNumber: ['', Validators.pattern('[0-9]{}')],
      firstName: ['', Validators.pattern('[a-z]{}')],
      lastName: ['', Validators.pattern('[a-z]{}')],
      orderNumber: ['', Validators.pattern('[0-9]{}')],
    });
  }

  search() {
    let nationalityId = parseInt(this.searchForm.value.nationalityId);
    //console.warn(typeof nationalityId);
    const newSearchForm = {
      ...this.searchForm.value,
      nationalityId: nationalityId,
    };
    // if (this.searchForm.valid)
    //   this.messageService.add({
    //     detail: 'Customer not found!...',
    //     severity: 'danger',
    //     summary: 'error',
    //     key: 'etiya-custom',
    //   });
    console.warn(newSearchForm);
    this.customersService
      .getListByFilter(this.searchForm.value)
      .subscribe((data) => {
        this.filteredData.emit(data);
      });
  }
  clear() {
    this.createSearchForm();
  }
  isValid(event: any): boolean {
    console.log(event);
    const pattern = /[0-9]/;
    const char = String.fromCharCode(event.which ? event.which : event.keyCode);
    if (pattern.test(char)) return true;

    event.preventDefault();
    return false;
  }
}
