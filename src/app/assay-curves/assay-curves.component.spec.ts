import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssayCurvesComponent } from './assay-curves.component';

describe('AssayCurvesComponent', () => {
  let component: AssayCurvesComponent;
  let fixture: ComponentFixture<AssayCurvesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssayCurvesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssayCurvesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
