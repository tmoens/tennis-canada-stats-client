import { Component, OnInit } from '@angular/core';
import {VRLicenseService} from "../vrlicense.service";
import {VRLicense} from "./VRLicense";
import {Observable} from "rxjs/index";
import {TENNIS_ASSOCIATIONS} from "../../../assets/provinces";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AppStateService} from "../../app-state.service";


@Component({
  selector: 'app-vrlicense-manager',
  templateUrl: './vrlicense-manager.component.html',
  styleUrls: ['./vrlicense-manager.component.scss']
})
export class VRLicenseManagerComponent implements OnInit {
  tennisAssociations = TENNIS_ASSOCIATIONS;

  licenseUpdateForm: FormGroup;
  licenseForm: FormGroup;

  licensesWithoutProvince$: Observable<VRLicense[]>;
  public licensesWithoutProvince: VRLicense[] = [];
  constructor(
    private fb: FormBuilder,
    private licenseService: VRLicenseService,
    private appState: AppStateService,
  ) {
    this.buildForm();
  }

  buildForm() {
    this.licenseUpdateForm = this.fb.group({
      licenses: this.fb.array([]),
    })
  }

  ngOnInit() {
    this.appState.setActiveTool("License Manager");
    this.getLicensesWithoutProvinces();
  }

  getLicensesWithoutProvinces() {
    this.licensesWithoutProvince$ = this.licenseService.getLicensesWithMissingProvince();
    this.licensesWithoutProvince$.subscribe(data => {
        this.licensesWithoutProvince = data;
        this.rebuildForm();
      }
    );
  }

  rebuildForm() {
    this.licenseUpdateForm.reset();
    const licenseFGs = this.licensesWithoutProvince.map(
      license => this.fb.group({
        licenseName: {value: license.licenseName,disabled: true},
        // licenseName: license.licenseName,
        province: license.province,
      })
    );
    const licenseFGArray = this.fb.array(licenseFGs);
    this.licenseUpdateForm.setControl('licenses',licenseFGArray);
  }

  // This just makes the licenses form array available to the HTML
  get licenses(): FormArray{
    return this.licenseUpdateForm.get('licenses') as FormArray;
  }

  onSubmit() {
    // We have to go looking through the form structure rather than
    // just use the form values.  WHY? Because we disabled the
    // licenseName field and for whatever reason, that means it does
    // not show up in the form data model.
    // Also we do not send back un-updated licenses for processing.
    const updates: VRLicense[] = [];
    for(let i=0; i < this.licenses.length; i++) {
      let p = this.licenses.at(i).get('province').value;
      if ("TBD" != p) {
        // TODO a proper check for a valid province
        let newL:VRLicense = new VRLicense();
        newL.province = p;
        newL.licenseName = this.licenses.at(i).get('licenseName').value;
        updates.push(newL);
      }
    }
    // TODO eror handling
    this.licenseService.updateLicensesWithMissingProvince(updates).subscribe(
      (_) => this.getLicensesWithoutProvinces()
    );

  }
}
