import { configureStore } from "@reduxjs/toolkit";
import gameRoomReducer from "@/lib/redux/slices/gameRoomSlice";

const store = configureStore({
  reducer: {
    gameRoom: gameRoomReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
