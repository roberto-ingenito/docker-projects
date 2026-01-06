import * as signalR from "@microsoft/signalr";
import {
  connected,
  gamePhaseChanged,
  hostChanged,
  joinedGameRoom,
  playerEliminated,
  playerVoted,
  receiveRole,
  roomCreated,
  userJoined,
  userLeft,
  winnerIs,
} from "../redux/slices/gameRoomSlice";
import { AppDispatch } from "../redux/store";
import { PlayerRole } from "../types/playerRole.enum";
import { GameRoom } from "../types/gameRoom";
import { GamePhase } from "../types/gamePhase.enum";
import { Player } from "../types/player";

class SignalRService {
  private connection: signalR.HubConnection | null = null;

  private apiBasePath: string = process.env.NEXT_PUBLIC_API_URL || "https://roberto-ingenito.ddns.net/mr-white-api";

  // Inizializza la connessione e i listener
  init(dispatch: AppDispatch) {
    this.connection = new signalR.HubConnectionBuilder() //
      .withUrl(this.apiBasePath + "/gamehub")
      .withAutomaticReconnect()
      .build();

    this.connection.on("RoomCreated", (gameRoom: GameRoom) => {
      console.log("RoomCreated: ", gameRoom);
      dispatch(roomCreated(gameRoom));
    });

    this.connection.on("UserJoined", (player: Player) => {
      console.log("UserJoined: ", player);
      dispatch(userJoined(player));
    });

    this.connection.on("UserLeft", (connectionId: string) => {
      console.log("UserLeft: ", connectionId);
      dispatch(userLeft(connectionId));
    });

    this.connection.on("GamePhaseChanged", (newPhase: GamePhase) => {
      console.log("GamePhaseChanged: ", newPhase);
      dispatch(gamePhaseChanged(newPhase));
    });

    this.connection.on("PlayerEliminated", (connectionId: string) => {
      console.log("PlayerEliminated: ", connectionId);
      dispatch(playerEliminated(connectionId));
    });

    this.connection.on("HostChanged", (connectionId: string) => {
      console.log("HostChanged: ", connectionId);
      dispatch(hostChanged(connectionId));
    });

    this.connection.on("Connected", (connectionId: string) => {
      console.log("Connected: ", connectionId);
      dispatch(connected(connectionId));
    });

    this.connection.on("ReceiveRole", (gameRoom: GameRoom) => {
      console.log("ReceiveRole: ", gameRoom);
      dispatch(receiveRole(gameRoom));
    });

    this.connection.on("ReceiveMessage", (message, data) => {
      console.log(`ReceiveMessage: ${message} ${data}`);
      alert(`${message}\n${data}`);
    });

    this.connection.on("JoinedGameRoom", (gameRoom: GameRoom) => {
      console.log("JoinedGameRoom: ", gameRoom);
      dispatch(joinedGameRoom(gameRoom));
    });

    this.connection.on("WinnerIs", (playerRole: PlayerRole) => {
      console.log("WinnerIs: ", playerRole);
      dispatch(winnerIs(playerRole));
    });

    this.connection.on("PlayerVoted", (vote: { voter: string; voted: string }) => {
      console.log("PlayerVoted: ", vote);
      dispatch(
        playerVoted({
          voter: vote.voter,
          voted: vote.voted,
        })
      );
    });

    this.connection.start().catch(console.error);
  }

  // Metodo per inviare comandi al server
  async invoke(methodName: string, ...args: unknown[]) {
    return this.connection?.invoke(methodName, ...args);
  }
}

export const signalRBridge = new SignalRService();
