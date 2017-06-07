// tslint:disable:max-line-length
import 'setimmediate';
import { Component, OnInit, Input, Output, EventEmitter, ElementRef, OnDestroy, ViewEncapsulation, forwardRef, OnChanges, SimpleChange } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/toPromise';
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
export class Select2Component implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {

  @Output() changeEvent = new EventEmitter<string | string[]>();
  @Output() selectEvent = new EventEmitter<string>();
  @Output() unselectEvent = new EventEmitter<string>();
  @Input() options: {} = {};
  @Input() url = '';
  @Input() multiple = false;
  @Input() placeholder = '';
  @Input() minimumInputLength = 0;
  @Input() maximumSelectionLength = 999;
  @Input() ajaxSearchFunction: (keyword?: string) => Observable<SelectModel[]> | Promise<SelectModel[]>;
  @Input() ajaxGetFunction: (ids?: string | string[]) => Observable<SelectModel[]> | Promise<SelectModel[]>;
  @Input() initialSelectedId: string | string[];
  @Input() updatedSelectedId: string | string[];

  private $select: any; // jQuery object
  private initialData: SelectModel[] = [];

  private _controlValue: string | string[];
  get controlValue(): string | string[] {
    if (this.multiple) {
      return getArray(this._controlValue);
    } else {
      return getSingleValue(this._controlValue, '');
    }
  }
  set controlValue(value: string | string[]) {
    if (this.multiple) {
      this._controlValue = getArray(value);
    } else {
      this._controlValue = getSingleValue(value, '');
    }
  }

  private onChangeValue: (newValue: string | string[]) => void = (value) => { };

  constructor(
    private el: ElementRef,
  ) { }

  ngOnChanges(changes: { initialSelectedId?: SimpleChange, updatedSelectedId?: SimpleChange }) {
    // Reactive Formsではない場合は、initialSelectedIdを経由してID初期値をセットする。
    if (changes.initialSelectedId && changes.initialSelectedId.isFirstChange) {
      // const _selectedIds = getArray<string>(changes.initialSelectedId.currentValue);
      // this.writeValue(_selectedIds);
      this.writeValue(changes.initialSelectedId.currentValue);
    }

    // updatedSelectedIdが更新されたときはinitialDataを作り直してSelect2も作り直す。これは主に媒体アカウントの選択に応じて依頼先を自動セットする処理で必要になる。
    if (changes.updatedSelectedId) {
      if (this.ajaxGetFunction instanceof Function) {
        // const _selectedIds = getArray<string>(changes.updatedSelectedId.currentValue);
        this.controlValue = changes.updatedSelectedId.currentValue;
        if (this.controlValue != null) {
          const promiseOrObservable: Observable<SelectModel[]> | Promise<SelectModel[]> = this.ajaxGetFunction(this.controlValue);
          const promise: Promise<SelectModel[]> = promiseOrObservable instanceof Promise ? promiseOrObservable : promiseOrObservable.take(1).toPromise();
          promise
            // 取得したmodelsをinitialDataとしてSelect2を作り直し、Select2の選択済み状態としてidを渡す。
            .then(models => {
              this.$select.select2('destroy').empty(); // Select2を一旦破棄して、
              this.initialData = models; // 初期データを登録し直して、
              this.createSelect2(); // Select2を作り直して、
              // this.$select.val(_selectedIds).trigger('change'); // Select2の選択状態を更新する。
            });
        }
      } else {
        console.error('ajaxGetFunction is not a function.', this.ajaxGetFunction);
      }
    }
  }

  // Reactive Forms用。formControlNameのvalueが変わる度に発火する。this._controlValueはここでしか変更されない。
  writeValue(value: string | string[]) {
    // this._controlValue = value == null ? [] : getArray(value);
    // this._controlValue = this._controlValue.filter(_value => !!_value);
    this.controlValue = value;

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
      // 初期データを登録する。
      if (this.controlValue && this.controlValue.length) {
        if (this.ajaxGetFunction) {
          const selectedIds = this.controlValue;
          // awaitがあるのでinitialDataに値がセットされるまでここで待つ。
          const promiseOrObservable: Observable<SelectModel[]> | Promise<SelectModel[]> = this.ajaxGetFunction(selectedIds);
          const promise: Promise<SelectModel[]> = promiseOrObservable instanceof Promise ? promiseOrObservable : promiseOrObservable.take(1).toPromise();
          this.initialData = await promise;
        } else {
          console.error('ajaxGetFunction is not a function.', this.ajaxGetFunction);
        }
      }

      // Select2オブジェクトを作る。
      this.$select = jQuery(this.el.nativeElement.querySelector('select'));
      this.createSelect2();

      // // Select2の選択済み状態を反映させる。
      // this.$select.val(this.controlValue).trigger('change');
      // // Select2のスタイルを上書きする。
      // this.overrideStyles();
    });
  }

  ngOnDestroy() {
    // OnDestroyのタイミングでSelect2のオブジェクトを破棄する。(メモリを解放するため)
    if (this.$select) {
      this.$select.select2('destroy').empty();
    }
  }

  createSelect2(): void {
    this.$select
      .select2({
        ...this.options,
        minimumResultsForSearch: Infinity,
        data: this.initialData,
        placeholder: this.placeholder,
        multiple: this.multiple,
        minimumInputLength: this.minimumInputLength,
        maximumSelectionLength: this.maximumSelectionLength,
        ajax: {
          delay: 0, // 200
          processResults: (data, params) => {
            return {
              results: data
            };
          },
          transport: (params, success, failure) => {
            if (this.ajaxSearchFunction) {
              const keyword: string = params.data.term;
              getPromiseFromPromiseOrObservable(this.ajaxSearchFunction(keyword))
                .then(success)
                .catch(() => {
                  // multipleのときは検索でエラーになったら候補一覧を閉じる。
                  if (this.multiple) {
                    this.$select.select2('close');
                  }
                  failure();
                });
            } else {
              console.error('ajaxSearchFunction is not a function.', this.ajaxSearchFunction);
            }
          },
          cache: true,
        }
      })
      .on('select2:select', event => {
        if (event.params.data && event.params.data.id) {
          this.selectEvent.emit(event.params.data.id);
        } else {
          this.selectEvent.emit('');
        }
      })
      .on('select2:unselect', event => {
        if (event.params.data && event.params.data.id) {
          this.unselectEvent.emit(event.params.data.id);
        } else {
          this.unselectEvent.emit('');
        }
      })
      .on('change', event => {
        // 受け側で統一性を持たせるため、たとえmultipleではなかったとしても配列にして次に渡す。
        const val: string | string[] = this.$select.val();
        // const ids: string[] = getArray(val).filter(id => typeof id === 'string');
        if (val != null) {
          this.onChangeValue(val);
          this.changeEvent.emit(val);
          this.overrideStyles();
        }
      });

    // Select2の選択済み状態を反映させる。
    this.$select.val(this.controlValue).trigger('change');
    // Select2のスタイルを上書きする。
    this.overrideStyles();
  }

  onClick(): void {
    this.overrideStyles();
  }

  private overrideStyles() {
    // setTimeoutを使うと画面が一瞬チラつくのでsetImmediateを使うのが丁度良い。
    setImmediate(() => {
      // Select2のinput[type=search]タグのスタイルを上書きする。
      const _inputElements: HTMLElement[] = Array.from(this.el.nativeElement.querySelectorAll('input.select2-search__field')) as any[];
      _inputElements.forEach(element => {
        if (!this.multiple && !element.classList.contains('taskdriver-select2-search__override')) { // single
          element.classList.add('taskdriver-select2-search__override');
        } else if (this.multiple && !element.classList.contains('taskdriver-select2-search-multiple__override')) { // multiple
          element.classList.add('taskdriver-select2-search-multiple__override');
        }
      });

      // Select2のmultipleのときの選択済みchipのスタイルを上書きする。
      const _selectedElements: HTMLElement[] = Array.from(this.el.nativeElement.querySelectorAll('li.select2-selection__choice')) as any[];
      _selectedElements.forEach(element => {
        if (!element.classList.contains('taskdriver-select2-chip__override')) {
          // element.classList.add('chip'); // materialize-css
          // element.classList.add('taskdriver-select2-chip__override');
        }
      });
    });
  }
}


function getArray<T>(item: T | T[]): T[] {
  return item instanceof Array ? item : [item];
}

function getSingleValue<T>(item: T | T[], alternative: T): T {
  const items = getArray(item);
  return items.length > 0 ? items[0] : alternative;
}

function getPromiseFromPromiseOrObservable<T>(promiseOrObservable: Promise<T> | Observable<T>): Promise<T> {
  return promiseOrObservable instanceof Promise ? promiseOrObservable : promiseOrObservable.take(1).toPromise();
}


interface SelectModel {
  id: string;
  text: string;
  [key: string]: any;
}
