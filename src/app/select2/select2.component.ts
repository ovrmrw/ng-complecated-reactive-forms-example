import { Component, OnInit, Input, Output, EventEmitter, ElementRef, OnDestroy, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
declare const jQuery: any;

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Select2Component),
  multi: true
};

@Component({
  selector: 'app-select2',
  templateUrl: './select2.component.html',
  styleUrls: ['./select2.component.css'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
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

  private $select: any; // jQuery object

  private _controlValue: string[];
  get controlValue(): string[] {
    return this._controlValue;
  }

  private onChangeValue: (newValue: string[]) => void = (v) => { };

  constructor(
    private el: ElementRef,
  ) { }

  // formControlNameのvalueが変わる度に発火する。this._controlValueはここでしか変更されない。
  writeValue(value: string[] | string) {
    this._controlValue = value == null ? [] :
      value instanceof Array ? value : [value];
    if (this.$select) {
      this.$select.val(this.controlValue).trigger('change');
    }
  }

  registerOnChange(fn: (newValue: any) => void) {
    // console.log('registerOnChange', fn);
    this.onChangeValue = fn;
  }
  registerOnTouched(fn: () => boolean) {
    // console.log('registerOnTouched', fn);
  }

  ngOnInit() {
    jQuery(this.el.nativeElement).ready(async () => {
      let initialData: SelectModel[] = [];

      if (this.controlValue && this.controlValue.length) {
        const _ids: string[] = this.controlValue;
        initialData = await this.ajaxGetFunction(_ids);
      }

      this.$select = jQuery(this.el.nativeElement.querySelector('select'));
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
              const _keyword: string = params.data.term;
              this.ajaxSearchFunction(_keyword)
                .then(success)
                .catch(failure);
            },
            cache: true,
          }
        })
        .on('change', event => {
          const _ids: string[] = this.$select.val();
          this.onChangeValue(_ids);
          this.change.emit(_ids);
          this.overrideStyles();
        });

      this.$select.val(this.controlValue).trigger('change');
      this.overrideStyles();
    });
  }

  ngOnDestroy() {
    // OnDestroyのタイミングでSelect2のオブジェクトを破棄する。
    if (this.$select) {
      this.$select.select2('destroy');
    }
  }

  private overrideStyles() {
    // Select2のinput[type=search]タグのスタイルを上書きする。
    const _inputElements: HTMLElement[] = Array.from(this.el.nativeElement.querySelectorAll('input.select2-search__field') as any[]);
    _inputElements.forEach(element => {
      if (!this.multiple && !element.classList.contains('taskdriver-select2-search__override')) { // single
        element.classList.add('taskdriver-select2-search__override');
      } else if (this.multiple && !element.classList.contains('taskdriver-select2-search-multiple__override')) { // multiple
        element.classList.add('taskdriver-select2-search-multiple__override');
      }
    });

    // Select2のmultipleのときの選択済みchipのスタイルを上書きする。
    const _selectedElements: HTMLElement[] = Array.from(this.el.nativeElement.querySelectorAll('li.select2-selection__choice') as any[]);
    _selectedElements.forEach(element => {
      if (!element.classList.contains('taskdriver-select2-chip__override')) {
        element.classList.add('chip'); // materialize-css
        element.classList.add('taskdriver-select2-chip__override');
      }
    });
  }
}


interface SelectModel {
  id: string;
  text: string;
  [key: string]: any;
}
