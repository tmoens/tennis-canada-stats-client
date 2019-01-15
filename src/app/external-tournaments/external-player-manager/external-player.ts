import {VRPlayer} from "../VRPlayer";

export class ExternalPlayer {
  playerId: string;
  internalId: string;
  manuallyupdated: boolean;
  updatedAt: string;
  ipin: string;
  firstName: string;
  lastName: string;
  gender: string;
  DOB: string;
  nationality: string;
  residence: string;
  height: number;
  weight: number;
  coach: string;
  tcPlayer: VRPlayer | null;
  version: number;
}
