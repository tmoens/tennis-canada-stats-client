export const GUEST_ROLE = 'guest';
export const USER_ROLE = 'user';
export const ADMIN_ROLE = 'admin';

export class Roles {
  private static _roles: Record<string, number> = {
    admin: 4,
    user: 3,
    guest: 1,
  };

  static getRoles(): string[] {
    return Object.keys(this._roles);
  }

  static isAuthorized(userRole: string, permittedRole: string): boolean {
    return this._roles[userRole] >= this._roles[permittedRole];
  }
}
