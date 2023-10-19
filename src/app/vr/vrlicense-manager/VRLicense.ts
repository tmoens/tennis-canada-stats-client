export class VRLicense {
  licenseName: string;
  province: string;
}

export class LicenseUpdate {
  licenseName: string;
  originalProvince;
  currentProvince;

  constructor(license: VRLicense) {
    this.licenseName = license.licenseName;
    this.originalProvince = license.province;
    this.currentProvince = license.province;
  }

}
