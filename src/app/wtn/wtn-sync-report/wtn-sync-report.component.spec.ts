import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtnSyncReportComponent } from './wtn-sync-report.component';

describe('WtnSyncReportComponent', () => {
  let component: WtnSyncReportComponent;
  let fixture: ComponentFixture<WtnSyncReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WtnSyncReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WtnSyncReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
