import { GamePhase } from "@/lib/types/gamePhase.enum";
import { GameRoom } from "@/lib/types/gameRoom";
import { Player } from "@/lib/types/player";
import { PlayerRole } from "@/lib/types/playerRole.enum";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  room: GameRoom;
  connectionId: string;
  winner: PlayerRole | undefined;
  eliminatedPlayer: string | undefined;
  categories: string[] | undefined;
  selectedCategories: string[];
} = {
  room: {
    gamePhase: GamePhase.Lobby,
    word: "",
    players: {},
    voting: {},
    roomCode: "",
  },
  connectionId: "",
  winner: undefined,
  eliminatedPlayer: undefined,
  categories: [],
  selectedCategories: [],
};

const slice = createSlice({
  name: "gameRoom",
  initialState: initialState,
  reducers: {
    roomCreated(state, action: PayloadAction<GameRoom>) {
      state.room = action.payload;
    },
    userJoined(state, action: PayloadAction<Player>) {
      state.room.players[action.payload.connectionId] = action.payload;
    },
    userLeft(state, action: PayloadAction<string>) {
      delete state.room.players[action.payload];
    },
    gamePhaseChanged(state, action: PayloadAction<GamePhase>) {
      state.room.gamePhase = action.payload;

      // quando la partita inizia, il vincitore si annulla (nel caso in cui ne viene avviata una nuova)
      if (action.payload === GamePhase.RoleAssignment) {
        state.winner = undefined;
      }
      // quando si passa alla fase di votazione, i voti vengono ripristinati
      else if (action.payload === GamePhase.Voting) {
        state.room.voting = {};
        state.eliminatedPlayer = undefined;
      }
    },
    playerEliminated(state, action: PayloadAction<string>) {
      if (state.room.players[action.payload]) {
        state.room.players[action.payload].isAlive = false;
        state.eliminatedPlayer = action.payload;
      }
    },
    hostChanged(state, action: PayloadAction<string>) {
      Object.values(state.room.players).forEach((p) => {
        p.isHost = p.connectionId === action.payload;
      });
    },
    connected(state, action: PayloadAction<string>) {
      state.connectionId = action.payload;
    },
    receiveRole(state, action: PayloadAction<GameRoom>) {
      state.room = action.payload;
    },
    joinedGameRoom(state, action: PayloadAction<GameRoom>) {
      state.room = action.payload;
    },
    winnerIs(state, action: PayloadAction<PlayerRole>) {
      state.room.gamePhase = GamePhase.EndGame;
      state.winner = action.payload;
    },
    playerVoted(state, action: PayloadAction<{ voter: string; voted: string }>) {
      state.room.voting[action.payload.voter] = action.payload.voted;
    },

    setSelectedCategories(state, action: PayloadAction<string[]>) {
      state.selectedCategories = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getCategories.pending, (state) => {
        state.categories = undefined;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state) => {
        state.categories = undefined;
      });
  },
});

export const getCategories = createAsyncThunk("gameRoom/getCategories", async (): Promise<string[]> => {
  const apiBasePath = process.env.NEXT_PUBLIC_API_URL || "https://roberto-ingenito.ddns.net/mr-white-api";

  const response = await fetch(`${apiBasePath}/Words/categories`);

  if (!response.ok) {
    return [];
  }
  try {
    const data = await response.json();
    return data as string[];
  } catch {
    return [];
  }
});

export const {
  roomCreated,
  userJoined,
  userLeft,
  gamePhaseChanged,
  playerEliminated,
  hostChanged,
  connected,
  receiveRole,
  joinedGameRoom,
  winnerIs,
  playerVoted,
  setSelectedCategories,
} = slice.actions;
export default slice.reducer;
