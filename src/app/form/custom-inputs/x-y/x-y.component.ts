import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { FirebaseService } from '../../../firebase/firebase.service';
import { SelectModel } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-x-y',
  templateUrl: './x-y.component.html',
  styleUrls: ['./x-y.component.css']
})
export class XYComponent implements OnInit {

  @Input() customInputFormGroup: FormGroup;
  @Input() i: number;

  constructor() { }

  ngOnInit() {
  }

}
