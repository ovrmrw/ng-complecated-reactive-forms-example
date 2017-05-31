import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    // public firebase: FirebaseService,
  ) {
    this.myForm = this.fb.group({
      category: this.fb.group({
        first: ['', Validators.required],
        second: ['', Validators.required],
      }),
      media: this.fb.group({
        media: [[''], Validators.required],
        select2: [[''], Validators.required]
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
        media: ['11', '12'],
        select2: ['2', '3']
      }
    });
  }

  ngOnInit() {
    this.myForm.valueChanges.subscribe(() => {
      console.log('valueChanges', this.myForm.value);
      console.log('valid', this.myForm.valid);
      // this.cd.detectChanges();
    });
  }

  onSubmit() {
    console.log('onSubmit');
  }
}


