import { InputRefDirective } from './../common/input-ref.directive';
import { Component, AfterContentInit, ContentChild, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ngx-barcode-input',
  templateUrl: './ngx-barcode-input.component.html',
  styleUrls: ['./ngx-barcode-input.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class NgxBarcodeInputComponent implements AfterContentInit {

  @ContentChild(InputRefDirective)
  input: InputRefDirective;

  ngAfterContentInit() {
    if (!this.input) {
      console.error('the ngx-barcode-input component needs an input inside its content');
    }
  }

  @HostBinding('class.input-focus')
  get isInputFocus() {
    return this.input ? this.input.focus : false;
  }

}
