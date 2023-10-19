import { Component, OnInit } from '@angular/core';
import {VRLicenseService} from '../vrlicense.service';
import {LicenseUpdate, VRLicense} from './VRLicense';
import {TENNIS_ASSOCIATIONS} from '../../../assets/provinces';
import {FormControl} from '@angular/forms';
import {AppStateService} from '../../app-state.service';
import {STATSTOOL} from '../../../assets/stats-tools';
import {debounceTime} from 'rxjs/operators';


@Component({
  selector: 'app-vrlicense-manager',
  templateUrl: './vrlicense-manager.component.html',
  styleUrls: ['./vrlicense-manager.component.scss']
})
export class VRLicenseManagerComponent implements OnInit {
  tennisAssociations = TENNIS_ASSOCIATIONS;

  // The filter form.
  filterFC: FormControl<string> = new FormControl<string>('');

  missingPTACount = 0;
  meetsFilterCount = 0;
  changeCount = 0;

  public licenseEditors: LicenseUpdate[] = [];
  constructor(
    // private fb: UntypedFormBuilder,
    private licenseService: VRLicenseService,
    private appState: AppStateService,
  ) {
  }

  ngOnInit() {
    this.appState.setActiveTool(STATSTOOL.LICENSE_MANAGER);
    this.getLicenses();

    this.filterFC.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.recount();
      });
  }

  getLicenses() {
    this.licenseService.getLicenses().subscribe(data => {
        this.licenseEditors = data.map ((license: VRLicense): LicenseUpdate => {
          return new LicenseUpdate(license);
        });
        this.recount();
      }
    );
  }

  getHint(license: LicenseUpdate): string | null {
    if (this.hasChanged(license)) {
      return `Changed from ${license.originalProvince}`;
    }
    if (this.missingPTA(license)) {
      return `Missing Tennis Association`;
    }
  }


  onSubmit() {
    // We have to go looking through the form for licenses that have changed.
    const updates: VRLicense[] = [];
    for (const licenseUpdate of this.licenseEditors) {
      if (this.hasChanged(licenseUpdate)) {
        const newL: VRLicense = new VRLicense();
        newL.province = licenseUpdate.currentProvince;
        newL.licenseName = licenseUpdate.licenseName;
        updates.push(newL);
      }
    }
    this.licenseService.updateLicenses(updates).subscribe(
      (_) => this.getLicenses()
    );
  }

  revert() {
    if (this.changeCount === 0) {
      return;
    }
    for (const license of this.licenseEditors) {
      if (this.hasChanged(license)) {
        license.currentProvince = license.originalProvince;
      }
    }
    this.recount();
  }

  recount() {
    this.missingPTACount = 0;
    this.meetsFilterCount = 0;
    this.changeCount = 0;
    for (const license of this.licenseEditors) {
      if (this.missingPTA(license)) { this.missingPTACount++; }
      if (this.hasChanged(license)) { this.changeCount++; }
      if (this.meetsFilter(license)) { this.meetsFilterCount++; }
    }
  }

  missingPTA(license: LicenseUpdate): boolean {
    return (license.currentProvince === 'TBD');
  }

  meetsFilter(license: LicenseUpdate): boolean {
    return (
      this.filterFC.value &&
      (license.licenseName.toLowerCase().includes(this.filterFC.value.toLowerCase()) ||
        license.currentProvince.includes(this.filterFC.value)));
  }

  hasChanged(license: LicenseUpdate): boolean {
    return (license.currentProvince !== license.originalProvince);
  }


  clearFilterText() {
    this.filterFC.setValue('');
  }
}
