import { PlayerRole } from "./playerRole.enum";

export interface Player {
  connectionId: string;
  name: string;
  role: PlayerRole;
  isAlive: boolean;
  isHost: boolean;
}
