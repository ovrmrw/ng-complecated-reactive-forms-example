import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { FirebaseService } from '../../firebase/firebase.service';
import { SelectModel } from '../../models';
import { BehaviorSubject } from 'rxjs/Rx';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  @Input() categoryFormGroup: FormGroup;
  categoryList1: SelectModel[] = [];
  categoryList2: SelectModel[] = [];

  constructor(
    private firebase: FirebaseService,
  ) { }

  ngOnInit() {
    this.firebase.searchCategory().then(categoryList => {
      this.categoryList1 = categoryList;
    });

    const categorySecond = getControlValue<string>(this.categoryFormGroup.get('second'));
    if (categorySecond) {
      this.firebase.searchCategory().then(categoryList => {
        this.categoryList2 = categoryList;
      });
    }

    const categoryFirstControl = this.categoryFormGroup.get('first') as FormControl;
    categoryFirstControl.valueChanges.subscribe(value => {
      console.log('categoryFirst is changed.');
      this.categoryFormGroup.patchValue({
        second: ''
      });
      this.firebase.searchCategory().then(categoryList => {
        this.categoryList2 = categoryList;
      });
    });
  }
}


function getControlValue<T>(control: AbstractControl | null): T {
  if (control) {
    return control.value;
  } else {
    throw new Error(control + ' is not found.');
  }
}

function getControlSubject(control: AbstractControl | null): BehaviorSubject<any> {
  let result: BehaviorSubject<any>;
  if (control) {
    result = new BehaviorSubject(control.value);
    control.valueChanges.subscribe(value => result.next(value));
    return result;
  } else {
    throw new Error(control + ' is not found.');
  }
}
