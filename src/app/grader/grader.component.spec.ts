import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraderComponent } from './grader.component';

describe('GraderComponent', () => {
  let component: GraderComponent;
  let fixture: ComponentFixture<GraderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
