import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VRLicenseReporterComponent } from './license-reporter.component';

describe('VRLicenseReporterComponent', () => {
  let component: VRLicenseReporterComponent;
  let fixture: ComponentFixture<VRLicenseReporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VRLicenseReporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VRLicenseReporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
