import { InputRefDirective } from './../common/input-ref.directive';
import { ChangeDetectorRef, Component, OnInit, ContentChild, TemplateRef } from '@angular/core';
import * as Quagga from 'Quagga';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ngx-barcode-input',
  templateUrl: './ngx-barcode-input.component.html',
  styleUrls: ['./ngx-barcode-input.component.scss']
})
export class NgxBarcodeInputComponent implements OnInit {

  @ContentChild(InputRefDirective)
  input: InputRefDirective;

  public isiOS: boolean;
  public hasCamera: boolean;
  public barcode: string;
  public configQuagga: any;

  modalRef: BsModalRef;

  constructor(
    private ref: ChangeDetectorRef,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.hasCamera = 'mediaDevices' in navigator;
    this.isiOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    this.barcode = '';

    this.configQuagga = {
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: '#barcodeInput',
        constraints: {
          width: { max: 550 },
          height: { max: 300 },
          aspectRatio: { min: 1, max: 10 },
          facingMode: 'environment', // or user
        },
        singleChannel: false // true: only the red color-channel is read
      },
      locator: {
        patchSize: 'medium',
        halfSample: true
      },
      locate: true,
      numOfWorkers: navigator.hardwareConcurrency,
      decoder: {
        readers: ['code_128_reader']
      },
      src: null
    };
  }

  startScanner(template: TemplateRef<any>) {
    this.barcode = '';
    this.ref.detectChanges();

    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog modal-dialog-centered',
      keyboard: false
    });

    Quagga.onProcessed((result) => this.onProcessed(result));

    Quagga.onDetected((result) => this.logCode(result));

    Quagga.init(this.configQuagga, (err) => {
      if (err) {
        return console.log(err);
      }
      Quagga.start();
      console.log('Barcode: initialization finished. Ready to start');
    });
  }

  stopScanner() {
    Quagga.stop();
    this.modalRef.hide();
  }

  private onProcessed(result: any) {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width')), parseInt(drawingCanvas.getAttribute('height')));
        result.boxes.filter(function (box) {
          return box !== result.box;
        }).forEach(function (box) {
          Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 });
        });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 });
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
      }
    }
  }

  private logCode(result) {
    const code = result.codeResult.code;
    if (this.barcode !== code) {
      this.barcode = code;
      this.ref.detectChanges();
      console.log(this.barcode);
      this.stopScanner();
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
          reject('File Cannot be Decode, Please Try a Valid Barcode;');
        }
        resolve(result.codeResult.code);
      });
    });
  }

  detectedBarcode(result) {
    this.barcode = result.codeResult.code;
  }

}
