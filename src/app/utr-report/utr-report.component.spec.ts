import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtrReportComponent } from './utr-report.component';

describe('UtrReportComponent', () => {
  let component: UtrReportComponent;
  let fixture: ComponentFixture<UtrReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtrReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtrReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
