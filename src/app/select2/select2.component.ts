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
export class Select2Component implements OnInit, OnDestroy, ControlValueAccessor {

  @Output() change = new EventEmitter<string[]>();
  @Input() options: {} = {};
  @Input() url = '';
  @Input() multiple = false;
  @Input() placeholder = '';
  @Input() minimumInputLength = 0;
  @Input() maximumSelectionLength = 999;
  @Input() ajaxSearchFunction: (keyword?: string) => Promise<SelectModel[]>;
  @Input() ajaxGetFunction: (ids?: string[]) => Promise<SelectModel[]>;

  $select: any;
  data: SelectModel[] = [];

  onChangeValue: (newValue: string[]) => void = (v) => { };

  private _controlValue: string[];
  get controlValue(): string[] {
    return this._controlValue;
  }

  constructor(
    private el: ElementRef,
    // private firebase: FirebaseService,
  ) { }

  // formControlNameのvalueが変わる度に発火する。
  writeValue(value: string[]) {
    this._controlValue = value != null ? value : [];
    if (this.$select) {
      this.$select.val(this._controlValue).trigger('change');
    }
  }

  registerOnChange(fn: (newValue: any) => void) {
    console.log('registerOnChange', fn);
    this.onChangeValue = fn;
  }
  registerOnTouched(fn: () => boolean) {
    console.log('registerOnTouched', fn);
  }

  ngOnInit() {
    jQuery(this.el.nativeElement).ready(async () => {
      let initialData: SelectModel[] = [];

      if (this.controlValue && this.controlValue.length && this.controlValue instanceof Array) {
        const ids: string[] = this.controlValue;
        initialData = await this.ajaxGetFunction(ids);
      }

      const _selectElement = this.el.nativeElement.querySelector('select');
      this.$select = jQuery(_selectElement);
      this.$select
        .select2({
          ...this.options,
          data: initialData,
          placeholder: this.placeholder,
          multiple: this.multiple,
          minimumInputLength: this.minimumInputLength,
          maximumSelectionLength: this.maximumSelectionLength,
          ajax: {
            processResults: (data, params) => {
              return {
                results: data
              };
            },
            transport: (params, success, failure) => {
              const keyword: string = params.data.term;
              this.ajaxSearchFunction(keyword)
                .then(success)
                .catch(failure);
            },
            cache: true
          }
        })
        .on('change', event => {
          const id: string[] | string = this.$select.val();
          const ids: string[] = id != null ? [] :
            id instanceof Array ? id : [id];
          this.onChangeValue(ids);
          this.change.emit(ids);
          this.hookCss();
        });

      this.$select.val(this.controlValue).trigger('change');
      this.hookCss();
    });
  }

  ngOnDestroy() {
    if (this.$select) {
      this.$select.select2('destroy');
    }
  }

  hookCss() {
    // setTimeout(() => {
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
    // });
  }
}


interface SelectModel {
  id: string;
  text: string;
  [key: string]: any;
}
