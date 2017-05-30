import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterializeModule } from 'angular2-materialize';
import { MaterialModule, MdSelectModule } from '@angular/material';

import { AppComponent } from './app.component';
import { FirebaseService } from './firebase/firebase.service';
import { FormComponent } from './form/form.component';
import { MediaComponent } from './form/media/media.component';
import { Select2Component } from './select2/select2.component';
import { CategoryComponent } from './form/category/category.component';
import { CustomInputsComponent } from './form/custom-inputs/custom-inputs.component';
import { XYComponent } from './form/custom-inputs/x-y/x-y.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    MediaComponent,
    Select2Component,
    CategoryComponent,
    CustomInputsComponent,
    XYComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterializeModule,
    MaterialModule,
    MdSelectModule,
  ],
  providers: [
    FirebaseService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
