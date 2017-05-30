import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FirebaseService } from '../../firebase/firebase.service';
import { SelectModel } from '../../models';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit {

  @Input() categoryFormGroup: FormGroup;
  @Input() mediaFormGroup: FormGroup;
  mediaList: SelectModel[] = [];

  constructor(
    private firebase: FirebaseService,
  ) { }

  ngOnInit() {
    this.firebase.searchMedia().then(mediaList => {
      this.mediaList = mediaList;
    });

    const categorySecondControl = this.categoryFormGroup.get('second') as FormControl;
    categorySecondControl.valueChanges.subscribe(second => {
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

}
