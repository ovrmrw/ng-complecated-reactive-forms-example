import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FirebaseService } from '../../firebase/firebase.service';
import { SelectModel } from '../../models';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  @Input() categoryFormGroup: FormGroup;
  categoryList1: SelectModel[] = [];
  categoryList2: SelectModel[] = [];

  get categoryFirstControl(): FormControl {
    return this.categoryFormGroup.get('first') as FormControl;
  };
  get categorySecondControl(): FormControl {
    return this.categoryFormGroup.get('second') as FormControl;
  }

  constructor(
    private firebase: FirebaseService,
  ) { }

  ngOnInit() {
    this.manageInitialList();
    this.manageValueChanges();
    this.manageStatusChanges();
  }

  manageInitialList(): void {
    this.firebase.searchCategory().then(categoryList => {
      this.categoryList1 = categoryList;
    });

    if (this.categorySecondControl.value) {
      this.firebase.searchCategory().then(categoryList => {
        this.categoryList2 = categoryList;
      });
    }
  }

  manageValueChanges(): void {
    this.categoryFirstControl.valueChanges.subscribe(value => {
      console.log('categoryFirst is changed.');
      this.categoryFormGroup.patchValue({
        second: ''
      });
      this.firebase.searchCategory().then(categoryList => {
        this.categoryList2 = categoryList;
      });
    });
  }

  manageStatusChanges(): void {
    Observable.of(this.categoryFirstControl.valid)
      .merge(this.categoryFirstControl.statusChanges.map(s => s === 'VALID'))
      .subscribe(valid => {
        if (valid) {
          this.categorySecondControl.enable();
        } else {
          this.categorySecondControl.disable();
        }
      });
  }
}
