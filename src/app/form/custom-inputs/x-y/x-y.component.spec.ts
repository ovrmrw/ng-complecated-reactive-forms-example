import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XYComponent } from './x-y.component';

describe('XYComponent', () => {
  let component: XYComponent;
  let fixture: ComponentFixture<XYComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XYComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XYComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
