import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {NgxBarcodeInputModule} from 'ngx-barcode-input';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgxBarcodeInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
