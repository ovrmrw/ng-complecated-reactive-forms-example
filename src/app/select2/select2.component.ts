import { Component, OnInit, Input, Output, EventEmitter, ElementRef, OnDestroy, ViewEncapsulation, OnChanges, SimpleChange, forwardRef } from '@angular/core';
declare const jQuery: any;
import { ControlValueAccessor, NgControl, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GenericSelect2Model, PpApiSelect2GenericResultModel } from '../models';
import { FirebaseService } from '../firebase/firebase.service';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Select2Component),
  multi: true
};

@Component({
  selector: 'app-select2',
  templateUrl: './select2.component.html',
  styleUrls: ['./select2.component.css'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class Select2Component implements OnInit, OnChanges, ControlValueAccessor {

  @Output() change = new EventEmitter();
  @Output() open = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() select = new EventEmitter<GenericSelect2Model>();
  @Output() unselect = new EventEmitter<GenericSelect2Model>();

  @Input() options: {} = {};
  @Input() data: SelectModel[] = [{ id: '1', text: 'Hoge' }];
  @Input() initialIds: string[] = [];
  @Input() transport: (params, success: Function, failure: Function) => void;
  @Input() url = '';
  @Input() multiple = false;
  @Input() placeholder = '';
  @Input() maximumSelectionLength = 999;
  @Input() ajaxSearchFunction: (keyword?: string) => Promise<any>;
  @Input() ajaxGetFunction: (ids?: string[]) => Promise<any>;

  $select: any;
  isCreated = false;

  private _controlValue: string[];
  get controlValue(): string[] {
    return this._controlValue;
  }
  set controlValue(value: string[]) {
    if (value !== undefined) {
      this._controlValue = value instanceof Array ? value : [value];
      console.log('set controlValue', this._controlValue, this.onChangeValue);
      if (this.onChangeValue) {
        this.onChangeValue(this._controlValue);
      } else {
        setTimeout(() => {
          console.log('onChangeValue', this.onChangeValue);
          this.onChangeValue(this._controlValue);
        });
      }
    }
  }

  onChangeValue: (newValue: any) => void | undefined;

  constructor(
    private el: ElementRef,
    private firebase: FirebaseService,
  ) { }

  writeValue(value: string[]) {
    this._controlValue = value;
    setTimeout(() => {
      this.onChangeValue(this._controlValue);
    });
  }

  registerOnChange(fn: (newValue: any) => void) {
    console.log('registerOnChange', fn);
    this.onChangeValue = fn;
  }
  registerOnTouched(fn: () => boolean) {
    console.log('registerOnTouched', fn);
  }

  ngOnChanges(changes: { initialIds: SimpleChange }) {
    // console.log('control', this.control)
    console.log('innverValue', this._controlValue);
    // this.initializeSelect2();
  }

  ngOnInit() {
    console.log('innverValue', this._controlValue);
    this.initializeSelect2();
    setTimeout(() => {
      this.$select.val(this.controlValue).trigger('change');
    }, 500);
  }

  initializeSelect2() {
    if (!this.isCreated) {
      jQuery(this.el.nativeElement).ready(() => {
        this.createSelect2();
      });
      this.isCreated = true;
    }

    // Select2作成済みなら一旦削除する。
    if (this.isCreated && this.$select && this.$select.select2) {
      console.log('destroy');
      this.$select.select2('destroy');
      this.createSelect2();
    }
  }

  createSelect2() {
    const _selectElement = this.el.nativeElement.querySelector('select');
    this.$select = jQuery(_selectElement);
    this.$select
      .select2({
        ...this.options,
        placeholder: this.placeholder,
        multiple: this.multiple,
        data: this.data,
        // minimumInputLength: 1,
        maximumSelectionLength: this.maximumSelectionLength,
        // minimumResultsForSearch: Infinity,
        ajax: {
          processResults: function (data, params) {
            console.log('processResults', data, params);
            return {
              results: data
            };
          },
          transport: (params, success, failed) => {
            console.log('transport.params', params);
            console.log('transport.success', success);
            console.log('transport.failed', failed);
            console.log('term', params.data.term);
            this.ajaxSearchFunction(params.data.term)
              .then(result => success(result))
              .catch(err => failed());
          },
          cache: true
        }
      })
      .on('change', event => {
        const ids: string[] = this.$select.val();
        if (ids && ids.length) {
          this.onChangeValue(ids);
          this.hookCss();
        }
      });
    this.hookCss();
  }

  hookCss() {
    setTimeout(() => {
      const _inputNodes: HTMLInputElement[] = Array.from(this.el.nativeElement.querySelectorAll('input.select2-search__field') as any[]);
      _inputNodes.forEach(node => {
        if (!node.classList.contains('taskdriver-select')) {
          node.classList.add('taskdriver-select');
        }
      });

      const _choiceNodes: HTMLElement[] = Array.from(this.el.nativeElement.querySelectorAll('li.select2-selection__choice') as any[]);
      _choiceNodes.forEach(node => {
        if (!node.classList.contains('taskdriver-chip')) {
          node.classList.add('chip');
          node.classList.add('taskdriver-chip');
        }
      });
    });
  }

}


interface SelectModel {
  id: string;
  text: string;
  [key: string]: any;
}
