import {
  removeAddressInfo,
  updateAddressInfo,
} from './../../../../shared/store/customers/customerToAdd/customerToAdd.actions';
import {
  addAddressInfo,
  setContactMediumInfo,
  setDemographicInfo,
} from '../../../../shared/store/customers/customerToAdd/customerToAdd.actions';
import { Customer } from './../../models/customer';
import { map, Observable, Subject } from 'rxjs';
import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchCustomer } from '../../models/searchCustomer';
import { Store } from '@ngrx/store';
import { CustomerDemographicInfo } from '../../models/customerDemographicInfo';
import { Address } from '../../models/address';
import { ContactMedium } from '../../models/contactMedium';
import { CustomerBillingAccountComponent } from '../../pages/customer-billing-account/customer-billing-account/customer-billing-account.component';
import { BillingAccount } from '../../models/billingAccount';
import { SharedStoreState } from 'src/app/shared/store/shared.reducers';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  customerToAddModel$: Observable<Customer> = this.store.select(
    (state) => state.customerToAdd
  );

  apiControllerUrl: string = `${environment.apiUrl}/customers`;

  constructor(
    private httpClient: HttpClient,
    private store: Store<SharedStoreState>
  ) {}

  getList(): Observable<Customer[]> {
    return this.httpClient.get<Customer[]>(this.apiControllerUrl);
  }

  getListByFilter(searchCustomer: SearchCustomer): Observable<Customer[]> {
    const subject = new Subject<Customer[]>();
    this.httpClient.get<Customer[]>(this.apiControllerUrl).subscribe({
      next: (response) => {
        let filteredCustomers = response;
        if (searchCustomer.nationalityId) {
          filteredCustomers = filteredCustomers.filter((item) =>
            item.nationalityId
              ?.toString()
              .includes(searchCustomer.nationalityId.toString())
          );
        }
        if (searchCustomer.customerId) {
          filteredCustomers = filteredCustomers.filter(
            (item) => item.customerId == searchCustomer.customerId
          );
        }
        if (searchCustomer.accountNumber) {
          filteredCustomers = filteredCustomers.filter((item) =>
            item.billingAccounts!.find(
              (ba) => ba.accountNumber == searchCustomer.accountNumber
            )
          );
        }

        if (searchCustomer.gsmNumber) {
          filteredCustomers = filteredCustomers.filter((item) =>
            item
              .contactMedium!.mobilePhone.substr(1, 14)
              .split(' ')
              .join('')
              .includes(searchCustomer.gsmNumber)
          );
        }

        if (searchCustomer.firstName) {
          filteredCustomers = filteredCustomers.filter((item) =>
            item
              .firstName!.toLowerCase()
              .includes(searchCustomer.firstName.toLowerCase())
          );
        }
        if (searchCustomer.lastName) {
          filteredCustomers = filteredCustomers.filter((item) =>
            item
              .lastName!.toLowerCase()
              .includes(searchCustomer.lastName.toLowerCase())
          );
        }
        if (searchCustomer.orderNumber) {
          filteredCustomers = filteredCustomers.filter((item) =>
            item.billingAccounts!.find((ba) =>
              ba.orders.find((o) => o.id == searchCustomer.orderNumber)
            )
          );
        }
        subject.next(filteredCustomers);
      },
      error: (err) => {
        subject.error(err);
      },
      complete: () => {
        //en son calısan yer
        subject.complete();
      },
    });
    return subject.asObservable();
  }

  setDemographicInfoToStore(props: CustomerDemographicInfo) {
    this.store.dispatch(setDemographicInfo(props));
  }

  addAddressInfoToStore(props: Address, customers: Customer) {
    const newAddress: Address = {
      ...props,
      id: Math.floor(Math.random() * 100000),
    };
    this.store.dispatch(addAddressInfo(newAddress));
  }

  updateAddressInfoToStore(props: Address) {
    const newAddress: Address = {
      ...props,
    };
    this.store.dispatch(updateAddressInfo(newAddress));
  }

  setContactMediumInfoToStore(props: ContactMedium) {
    this.store.dispatch(setContactMediumInfo(props));
  }

  getCustomerById(selectedId: number): Observable<Customer> {
    const subject = new Subject<Customer>(); //backend simülasyonu
    this.httpClient
      .get<Customer[]>(this.apiControllerUrl + '?id=' + selectedId)
      .subscribe({
        next: (response) => {
          const customer: Customer = response[0];
          subject.next(customer);
        },
        error: (err) => {
          subject.error(err);
        },
        complete: () => {
          subject.complete();
        },
      });
    return subject.asObservable();
  }

  removeAdress(address: Address) {
    this.store.dispatch(removeAddressInfo(address));
  }

  add(customer: Customer): Observable<Customer> {
    const newCustomer: Customer = {
      ...customer,
      addresses: customer.addresses?.map((item, index) => ({
        ...item,
        id: index + 1,
      })),
      role: 'individual',
      customerId: 9999,
    };
    return this.httpClient.post<Customer>(this.apiControllerUrl, newCustomer);
  }

  delete(id: number): Observable<Customer> {
    return this.httpClient.delete<Customer>(`${this.apiControllerUrl}/${id}`);
  }

  update(customer: Customer): Observable<Customer> {
    return this.httpClient.put<Customer>(
      `${this.apiControllerUrl}/${customer.id}`,
      customer
    );
  }

  addAddress(address: Address, customer: Customer): Observable<Customer> {
    const newCustomer: Customer = {
      ...customer,
      addresses: [
        ...(customer.addresses || []),
        { ...address, id: Math.floor(Math.random() * 100000) },
      ],
    };
    return this.httpClient.put<Customer>(
      `${this.apiControllerUrl}/${customer.id}`,
      newCustomer
    );
  }

  updateAddress(
    addressToUpdate: Address,
    customer: Customer
  ): Observable<Customer> {
    const newCustomer: Customer = {
      ...customer,
    };
    const addressIndex = customer.addresses?.findIndex(
      (address) => address.id === addressToUpdate.id
    ) as number;
    newCustomer.addresses![addressIndex] = addressToUpdate;

    return this.httpClient.put<Customer>(
      `${this.apiControllerUrl}/${customer.id}`,
      newCustomer
    );
  }

  updateContactMedium(
    contactToUpdate: ContactMedium,
    customer: Customer
  ): Observable<Customer> {
    const newCustomer: Customer = {
      ...customer,
      contactMedium: contactToUpdate,
    };
    return this.httpClient.put<Customer>(
      `${this.apiControllerUrl}/${customer.id}`,
      newCustomer
    );
  }

  addBillingAccount(
    billingAccount: BillingAccount,
    customer: Customer
  ): Observable<Customer> {
    const newCustomer: Customer = {
      ...customer,
      billingAccounts: [
        ...(customer.billingAccounts || []),
        {
          ...billingAccount,
          id: Math.floor(Math.random() * 100000),
          accountNumber: Math.floor(
            1000000000 + Math.random() * 90000000
          ).toString(),
          status: 'active',
        },
      ],
    };
    return this.httpClient.put<Customer>(
      `${this.apiControllerUrl}/${customer.id}`,
      newCustomer
    );
  }

  deleteAddress(
    customer: Customer,
    deleteToAddress: Address
  ): Observable<Customer> {
    let newAddresses: any = [];
    if (customer.addresses) {
      newAddresses = customer.addresses.filter(
        (c) => c.id != deleteToAddress.id
      );
    }
    const newCustomer: Customer = {
      ...customer,
      addresses: [...(newAddresses as Address[])],
    };

    return this.httpClient.put<Customer>(
      `${this.apiControllerUrl}/${customer.id}`,
      newCustomer
    );
  }

  deleteBillingAccountAddress(
    customer: Customer,
    deleteToAddress: Address
  ): Observable<Customer> {
    let newAddresses: any = [];
    let acc: any = [];
    acc = customer.billingAccounts;
    let findDeleteAddress = customer.billingAccounts?.find((bill) => {
      bill.addresses.forEach((adr) => {
        return adr.id == deleteToAddress.id;
      });
    });
    if (findDeleteAddress)
      newAddresses = customer.billingAccounts?.filter((bill) => {
        bill.addresses.forEach((adr) => {
          adr.id != deleteToAddress.id;
        });
      });

    const newCustomer: Customer = {
      ...customer,

      billingAccounts: [
        ...(customer.billingAccounts || []),
        {
          ...acc,
          addresses: [...(newAddresses as Address[])],
        },
      ],
    };

    return this.httpClient.put<Customer>(
      `${this.apiControllerUrl}/${customer.id}`,
      newCustomer
    );
  }

  updateDemographicInfo(
    customerDemographicInfo: any,
    customer: Customer
  ): Observable<Customer> {
    const newCustomer: Customer = {
      ...customer,
      firstName: customerDemographicInfo.firstName,
      middleName: customerDemographicInfo.middleName,
      lastName: customerDemographicInfo.lastName,
      birthDate: customerDemographicInfo.birthDate,
      gender: customerDemographicInfo.gender,
      nationalityId: customerDemographicInfo.nationalityId,
      motherName: customerDemographicInfo.motherName,
      fatherName: customerDemographicInfo.fatherName,
    };
    return this.httpClient.put<Customer>(
      `${this.apiControllerUrl}/${customer.id}`,
      newCustomer
    );
  }

  removeBillingAccount(
    billingAccountToDelete: BillingAccount,
    customer: Customer
  ): Observable<Customer> {
    const newCustomer: Customer = {
      ...customer,
    };
    const newBillingAccount = customer.billingAccounts?.filter(
      (bill) => bill.id != billingAccountToDelete.id
    );
    newCustomer.billingAccounts = newBillingAccount;

    return this.httpClient.put<Customer>(
      `${this.apiControllerUrl}/${customer.id}`,
      newCustomer
    );
  }
}
