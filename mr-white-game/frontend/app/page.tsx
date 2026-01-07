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

  if (!roomCode) {
    return <HomeScreen />;
  }

  switch (gamePhase) {
    case GamePhase.Lobby:
      return <LobbyScreen />;
    case GamePhase.RoleAssignment:
      return <RoleAssignmentScreen />;
    case GamePhase.Talking:
      return <TalkingScreen />;
    case GamePhase.Voting:
      return <VotingScreen />;
    case GamePhase.Revelation:
      return <RevelationScreen />;
    case GamePhase.EndGame:
      return <EndGameScreen />;
    default:
      return <LobbyScreen />;
  }
}
