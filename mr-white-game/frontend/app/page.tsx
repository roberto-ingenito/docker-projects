"use client";

import HomeScreen from "@/components/screens/home";
import LobbyScreen from "@/components/screens/lobby";
import RevelationScreen from "@/components/screens/revelation";
import RoleAssignmentScreen from "@/components/screens/roleAssignment";
import TalkingScreen from "@/components/screens/talking";
import VotingScreen from "@/components/screens/voting";
import EndGameScreen from "@/components/screens/endGame";
import { useAppSelector } from "@/lib/redux/hooks";
import { GamePhase } from "@/lib/types/gamePhase.enum";

export default function GameContainer() {
  const { gamePhase, roomCode } = useAppSelector((state) => state.gameRoom.room);
  const room = useAppSelector((state) => state.gameRoom.room);

  if (!roomCode) {
    return <HomeScreen />;
  }

  let ScreenComponent;

  switch (gamePhase) {
    case GamePhase.Lobby:
      ScreenComponent = <LobbyScreen />;
      break;
    case GamePhase.RoleAssignment:
      ScreenComponent = <RoleAssignmentScreen />;
      break;
    case GamePhase.Talking:
      ScreenComponent = <TalkingScreen />;
      break;
    case GamePhase.Voting:
      ScreenComponent = <VotingScreen />;
      break;
    case GamePhase.Revelation:
      ScreenComponent = <RevelationScreen />;
      break;
    case GamePhase.EndGame:
      ScreenComponent = <EndGameScreen />;
      break;
    default:
      ScreenComponent = <LobbyScreen />;
  }

  return (
    <div>
      {ScreenComponent}
      <pre>{JSON.stringify(room, null, 2)}</pre>
    </div>
  );
}
