import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FirebaseService } from '../../firebase/firebase.service';
import { SelectModel } from '../../models';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit {

  @Input() categoryFormGroup: FormGroup;
  @Input() mediaFormGroup: FormGroup;
  mediaList: SelectModel[] = [];

  private categorySecondControl: FormControl;
  private mediaControl: FormControl;

  constructor(
    public firebase: FirebaseService,
  ) { }

  ngOnInit() {
    this.categorySecondControl = this.categoryFormGroup.get('second') as FormControl;
    this.mediaControl = this.mediaFormGroup.get('media') as FormControl;

    this.manageInitialList();
    this.manageValueChanges();
    this.manageStatusChanges();
  }

  manageInitialList(): void {
    if (this.mediaControl.value) {
      this.firebase.searchMedia().then(mediaList => {
        this.mediaList = mediaList;
      });
    }
  }

  manageValueChanges(): void {
    this.categorySecondControl.valueChanges.subscribe(value => {
      console.log('categorySecond is changed.');
      // mediaをリセットする。
      this.mediaFormGroup.patchValue({
        media: []
      });
      // mediaのリストを再度取得する。
      this.firebase.searchMedia().then(mediaList => {
        this.mediaList = mediaList;
      });
    });
  }

  manageStatusChanges(): void {
    Observable.of(this.categorySecondControl.valid)
      .merge(this.categorySecondControl.statusChanges.map(s => s === 'VALID'))
      .subscribe(valid => {
        if (valid) {
          this.mediaControl.enable();
        } else {
          this.mediaControl.disable();
        }
      });
  }
}
