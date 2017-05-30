import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from '../../firebase/firebase.service';
import { SelectModel } from '../../models';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-custom-inputs',
  templateUrl: './custom-inputs.component.html',
  styleUrls: ['./custom-inputs.component.css']
})
export class CustomInputsComponent implements OnInit {

  @Input() hostFormGroup: FormGroup;
  @Input() categoryFormGroup: FormGroup;


  get customInputs(): FormArray {
    return this.hostFormGroup.get('customInputs') as FormArray;
  }
  get categorySecondControl(): FormControl {
    return this.categoryFormGroup.get('second') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    console.log('customInputs', this.customInputs.controls);

    this.manageValueChanges();
    this.manageStatusChanges();
  }

  manageValueChanges() {
    this.categorySecondControl.valueChanges.subscribe(value => {
      console.log('custom inputs category second is changed.');
      this.hostFormGroup.setControl('customInputs', this.fb.array([
        this.fb.group({
          type: 'x_y',
          x: ['', Validators.required],
          y: ['', Validators.required]
        })
      ]));
    });
  }

  manageStatusChanges(): void {
    Observable.of(this.categorySecondControl.valid)
      .merge(this.categorySecondControl.statusChanges.map(s => s === 'VALID'))
      .subscribe(valid => {
        if (valid) {
          this.customInputs.enable();
        } else {
          this.customInputs.disable();
        }
      });
  }
}
