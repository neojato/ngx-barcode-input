import {InputRefDirective} from './../common/input-ref.directive';
import {ChangeDetectorRef, Component, OnInit, ContentChild, TemplateRef} from '@angular/core';
import * as Quagga from 'quagga';

@Component({
  selector: 'ngx-barcode-input',
  templateUrl: './ngx-barcode-input.component.html',
  styleUrls: ['./ngx-barcode-input.component.scss']
})
export class NgxBarcodeInputComponent implements OnInit {

  @ContentChild(InputRefDirective)
  input: InputRefDirective;

  public barcode = '';

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() { }

  private onProcessed(result: any) {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width')), parseInt(drawingCanvas.getAttribute('height')));
        result.boxes.filter(function (box) {
          return box !== result.box;
        }).forEach(function (box) {
          Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: 'green', lineWidth: 2});
        });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: '#00F', lineWidth: 2});
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
      }
    }
  }

  onChange(e) {
    if (e.target.files && e.target.files.length) {
      Quagga.onProcessed((result) => this.onProcessed(result));

      Quagga.onDetected((result) => this.detectedBarcode(result));

      this.onDecodeSingle(URL.createObjectURL(e.target.files[0]));
    }
  }

  onDecodeSingle(img_src) {
    const config = {
      locate: true,
      locator: {
        patchSize: 'medium',
        halfSample: true
      },
      decoder: {
        readers: ['code_128_reader']
      },
      src: img_src
    };

    // Promisify DecodeSingle method from Quagga
    return new Promise((resolve, reject) => {
      Quagga.decodeSingle(config, result => {
        if (!result || typeof result.codeResult === 'undefined') {
          reject('Barcode Cannot be Decoded, Please Try a Valid Barcode and/or a Clear Photo of Barcode');
        } else {
          resolve(result.codeResult.code);
        }
      });
    }).catch((error) => {
      console.error(error);
      alert(error);
    });
  }

  detectedBarcode(result) {
    this.barcode = result.codeResult.code;
  }

}
