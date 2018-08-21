import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VRLicenseManagerComponent } from './vrlicense-manager.component';

describe('VRLicenseManagerComponent', () => {
  let component: VRLicenseManagerComponent;
  let fixture: ComponentFixture<VRLicenseManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VRLicenseManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VRLicenseManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
