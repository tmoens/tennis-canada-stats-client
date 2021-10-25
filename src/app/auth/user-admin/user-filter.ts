export class UserFilter {
  text: string = null;
  inactiveOnly = false;
  activeOnly = false;
  researcherOnly = false;
  piOnly = false;
  isLoggedIn = false;

  public constructor( init?: Partial<UserFilter>) {
    Object.assign(this, init);
  }

  isEmpty(): boolean {
    return !(this.text || this.inactiveOnly || this.activeOnly ||
      this.researcherOnly || this.piOnly || this.isLoggedIn);
  }
}
