import { GamePhase } from "./gamePhase.enum";
import { Player } from "./player";

export interface GameRoom {
  roomCode: string;

  // key: ConnectionId
  // value: Player object
  players: Record<string, Player>;

  // key: ConnectionId
  // value: voted ConnectionId
  voting: Record<string, string>;
  gamePhase: GamePhase;
  word: string;
}
