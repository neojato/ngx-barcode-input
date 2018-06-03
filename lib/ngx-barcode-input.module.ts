import {InputRefDirective} from './common/input-ref.directive';
import {NgxBarcodeInputComponent} from './ngx-barcode-input/ngx-barcode-input.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [NgxBarcodeInputComponent, InputRefDirective],
  exports: [NgxBarcodeInputComponent, InputRefDirective]
})
export class NgxBarcodeInputModule { }
