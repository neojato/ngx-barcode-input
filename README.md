# ngx-barcode-input

This module contains an Angular input box component with a button that allows to scan a barcode when viewed from a mobile device (ex Android/iOS), which then records the scanned string of data into the input field for form submission.

### Features:

- The component has minimal styling
- There is no need to include a component-specific external stylesheet
- As the input component takes a plain input and projects it, this means that by design the component supports all standard HTML input attributes, including custom attributes (data-), all the accessiblity properties, etc.
- This also means that these components are compatible with Angular Forms 
- This repo is designed as a library in the [Angular Package Format v4.0](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/edit#heading=h.k0mh3o8u5hx).
- This means that this module is compatible with AOT, and includes UMD bundles for use with SystemJs

# Demo

https://ngxbarcodeinput.firebaseapp.com/

# Installation

This is how to install the components:

```bash
npm install ngx-barcode-input
```

or 

```bash
yarn add ngx-barcode-input
```


And on your application module:

```ts
import { NgxBarcodeInputModule } from 'ngx-barcode-input';

@NgModule({
  declarations: [ ...],
  imports: [
    BrowserModule,
    ....,
     NgxBarcodeInputModule
],
})
export class AppModule { }
```

See below for SystemJs / UMD installation.

# Using the Barcode Input

Use the Barcode Input like this:

```html
<div class="form-row">
  <label>Barcode Input:</label>
  <ngx-barcode-input></ngx-barcode-input>
</div>
```

        
# Running the Demo Application
This command will build and start the demo application:

```bash
npm start
```

# Building Module for Production
These commands will build, package, and deploy for NPM

```bash
npm run build
npm run packagr
npm publish dist
```

# Running the Tests 

The tests can be executed with the following commands:

```bash
npm test
npm integration
```

## Using SystemJs via the UMD bundle ?

Make sure to add this to your `map` configuration, if you need the module served from a CDN:

```javascript
map: {
   ...
   'ngx-barcode-input': 'https://unpkg.com/ngx-barcode-input@<version number>/ngx-barcode-input.umd.min.js'
}
```

Otherwise if serving from `node_modules`directly:

```javascript
map: {
   ...
   'ngx-barcode-input': 'node_modules/ngx-barcode-input/bundles/ngx-barcode-input.umd.min.js'
}
```

And in our packages property:

```javascript
packages: {
   ...
  'ngx-barcode-input': {
    main: 'index.js',
    defaultExtension: 'js'
  }

}
```


# License 

[MIT](https://opensource.org/licenses/MIT)
