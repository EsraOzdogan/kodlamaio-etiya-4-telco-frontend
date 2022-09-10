import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCustomerBillingAccountComponent } from './update-customer-billing-account.component';

describe('UpdateCustomerBillingAccountComponent', () => {
  let component: UpdateCustomerBillingAccountComponent;
  let fixture: ComponentFixture<UpdateCustomerBillingAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCustomerBillingAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCustomerBillingAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
