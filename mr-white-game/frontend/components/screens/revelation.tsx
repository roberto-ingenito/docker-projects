"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import Button from "../ui/button";
import { Skull, RefreshCw, AlertTriangle } from "lucide-react";
import { signalRBridge } from "@/lib/services/signarHubService";

export default function RevelationScreen() {
  const { roomCode, players } = useAppSelector((state) => state.gameRoom.room);
  const eliminatedPlayer = useAppSelector((state) => state.gameRoom.eliminatedPlayer);
  const connectionId = useAppSelector((state) => state.gameRoom.connectionId);

  // Troviamo chi è appena morto (è l'unico che ha isAlive=false ma che probabilmente era vivo poco fa)
  // Per semplicità, possiamo cercare chi ha isAlive=false.
  // Nota: In una versione avanzata potresti salvare "lastEliminatedId" nello slice Redux.
  // Qui assumiamo che l'utente veda la lista e capisca chi manca, o evidenziamo i morti recenti.
  // Per ora mostriamo un messaggio generico o filtriamo i morti.

  const me = players[connectionId];
  const isHost = me?.isHost;

  const handleNextRound = () => {
    // L'host riavvia il giro di votazioni (o talking, a seconda delle regole.
    // Solitamente si torna a StartVoting o StartTalking. Tu hai chiesto StartVoting)
    signalRBridge.invoke("StartVoting", roomCode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
        <div className="inline-flex p-4 bg-rose-500/10 rounded-full mb-6 animate-bounce">
          <Skull className="w-12 h-12 text-rose-500" />
        </div>

        <h1 className="text-3xl font-black text-white mb-4">Eliminazione!</h1>

        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl mb-8">
          <div className="flex items-center justify-center gap-2 text-amber-500 font-bold mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Attenzione</span>
          </div>
          {eliminatedPlayer && (
            <p className="text-slate-300">
              {players[eliminatedPlayer].name} è stato eliminato, ma... <br />
              <strong className="text-rose-500 text-lg uppercase tracking-widest">Mr. White è ancora vivo!</strong>
            </p>
          )}
        </div>

        {isHost ? (
          <div className="space-y-3">
            <p className="text-slate-500 text-xs">Il gioco deve continuare.</p>
            <Button onClick={handleNextRound} fullWidth variant="primary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Nuova Votazione
            </Button>
          </div>
        ) : (
          <p className="text-slate-500 text-sm">Preparati, l&apos;host sta per avviare un nuovo round di voti.</p>
        )}
      </div>
    </div>
  );
}
