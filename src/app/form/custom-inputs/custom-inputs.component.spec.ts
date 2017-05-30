import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomInputsComponent } from './custom-inputs.component';

describe('CustomInputsComponent', () => {
  let component: CustomInputsComponent;
  let fixture: ComponentFixture<CustomInputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomInputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
