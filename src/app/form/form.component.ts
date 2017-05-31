import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from '../firebase/firebase.service';
import { SelectModel } from '../models';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import * as lodash from 'lodash';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  myForm: FormGroup;
  currentFormValue: any;

  constructor(
    private fb: FormBuilder,
    // public firebase: FirebaseService,
  ) {
    this.myForm = this.fb.group({
      category: this.fb.group({
        first: ['', Validators.required],
        second: ['', Validators.required],
      }),
      media: this.fb.group({
        media: [[], Validators.required],
        select2: [['1']]
      }),
      customInputs: this.fb.array([])
    });

    this.myForm.setControl('customInputs', this.fb.array([
      this.fb.group({
        type: 'x_y',
        x: ['', Validators.required],
        y: ['', Validators.required]
      })
    ]));

    this.myForm.patchValue({
      category: {
        first: '4',
        second: '2'
      },
      media: {
        media: ['11', '12']
      }
    });
  }

  ngOnInit() {
    this.myForm.valueChanges.subscribe(() => {
      console.log('valueChanges', this.myForm.value);
      console.log('valid', this.myForm.valid);
      this.currentFormValue = lodash.cloneDeep(this.myForm.value);
    });
  }

  onSubmit() {
    console.log('onSubmit');
  }
}


