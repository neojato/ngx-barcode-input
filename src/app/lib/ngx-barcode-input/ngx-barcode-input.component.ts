import { ChangeDetectorRef, Component, OnInit, AfterContentInit, ContentChild, TemplateRef } from '@angular/core';
import { InputRefDirective } from './../common/input-ref.directive';
import * as Quagga from 'Quagga';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ngx-barcode-input',
  templateUrl: './ngx-barcode-input.component.html',
  styleUrls: ['./ngx-barcode-input.component.scss']
})
export class NgxBarcodeInputComponent implements OnInit, AfterContentInit {

  @ContentChild(InputRefDirective)
  input: InputRefDirective;

  public isMobile: boolean;
  public hasCamera: boolean;
  public barcode: string;
  public configQuagga: any;

  modalRef: BsModalRef;

  constructor(
    private ref: ChangeDetectorRef,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.isMobile = window.matchMedia('only screen and (max-width: 760px)').matches;
    this.hasCamera = (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function');

    this.barcode = '';

    this.configQuagga = {
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: '#barcodeInput',
        constraints: {
          width: { max: 550 },
          height: { max: 300 },
          aspectRatio: { min: 1, max: 2 },
          facingMode: 'environment', // or user
        }
      },
      locator: {
        patchSize: 'medium',
        halfSample: true
      },
      locate: true,
      numOfWorkers: navigator.hardwareConcurrency,
      decoder: {
        readers: ['code_128_reader']
      }
    };
  }

  ngAfterContentInit() {
    if (!this.input) {
      console.error('the ngx-barcode-input component needs an input inside its content');
    }
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
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width'), 10), parseInt(drawingCanvas.getAttribute('height'), 10));
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

}
