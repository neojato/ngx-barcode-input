import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxBarcodeInputComponent } from './ngx-barcode-input.component';

describe('NgxBarcodeInputComponent', () => {
  let component: NgxBarcodeInputComponent;
  let fixture: ComponentFixture<NgxBarcodeInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxBarcodeInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxBarcodeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
