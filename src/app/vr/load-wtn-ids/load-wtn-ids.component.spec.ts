import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadWtnIdsComponent } from './load-wtn-ids.component';

describe('LoadWtnIdsComponent', () => {
  let component: LoadWtnIdsComponent;
  let fixture: ComponentFixture<LoadWtnIdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadWtnIdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadWtnIdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
