import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCreateBillAccountAddressComponent } from './update-create-bill-account-address.component';

describe('UpdateCreateBillAccountAddressComponent', () => {
  let component: UpdateCreateBillAccountAddressComponent;
  let fixture: ComponentFixture<UpdateCreateBillAccountAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCreateBillAccountAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCreateBillAccountAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
