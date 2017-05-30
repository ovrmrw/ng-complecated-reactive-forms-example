import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from '../firebase/firebase.service';
import { SelectModel } from '../models';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    // private firebase: FirebaseService,
  ) {
    this.myForm = this.fb.group({
      category: this.fb.group({
        first: ['4', Validators.required],
        second: ['2', Validators.required],
      }),
      media: this.fb.group({
        media: [['11', '12'], Validators.required],
      })
    });
  }

  ngOnInit() {
    this.myForm.valueChanges.subscribe(() => {
      console.log('valueChanges', this.myForm.value);
      console.log('valid', this.myForm.valid);
    });
  }
}


