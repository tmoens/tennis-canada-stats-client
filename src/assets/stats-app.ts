export enum RIGHTS {
  ADMIN,
  BC_MEMBERSHIP
}

export class StatsApp {
  iconName: string;
  constructor(
    public name: string,
    public route: string,
    public description: string,
    public detail: string = '',
    public rights: RIGHTS[] = [RIGHTS.ADMIN],
  ) {
  }
}
