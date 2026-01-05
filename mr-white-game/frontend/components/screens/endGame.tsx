"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { signalRBridge } from "@/lib/services/signarHubService"; // Assicurati che il path sia corretto
import Button from "../ui/button";
import { Trophy, Skull, Crown, RefreshCw, LogOut, User, Copy } from "lucide-react";
import { PlayerRole } from "@/lib/types/playerRole.enum";

export default function ResultScreen() {
  const { roomCode, players } = useAppSelector((state) => state.gameRoom.room);
  const { winner } = useAppSelector((state) => state.gameRoom);
  const connectionId = useAppSelector((state) => state.gameRoom.connectionId);

  const me = players[connectionId];
  const isHost = me?.isHost;

  // Determiniamo chi ha vinto per scegliere il tema (Blu/Verde o Rosso)
  const civiliansWon = winner === PlayerRole.Civilian;

  // Troviamo chi era Mr. White per evidenziarlo
  const mrWhitePlayer = Object.values(players).find((p) => p.role === "MrWhite");

  function handleRestart() {
    // Il backend accetta StartGame anche se la fase è EndGame, resettando ruoli e voti.
    signalRBridge.invoke("StartGame", roomCode);
  }

  function handleExit() {
    // Ricaricando la pagina si disconnette da SignalR e torna alla Home
    window.location.reload();
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(roomCode);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Codice Stanza */}
        <div className="flex flex-col gap-0.5 items-center place-self-start mb-2">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">Codice Stanza</p>
          <div onClick={copyToClipboard} className="group flex items-center justify-center gap-3 cursor-pointer">
            <h1 className="text-3xl font-black text-cyan-400 tracking-tighter group-hover:text-cyan-300 transition-colors">{roomCode}</h1>
            <Copy className="text-slate-600 group-hover:text-cyan-400 transition-colors w-6 h-6" />
          </div>
        </div>

        {/* Effetto Sfondo Colorato */}
        <div
          className={`absolute top-0 left-0 w-full h-2 bg-linear-to-r ${
            civiliansWon ? "from-cyan-500 to-emerald-500" : "from-rose-600 to-orange-600"
          }`}
        />

        {/* Header Vittoria */}
        <div className="mb-8 animate-in zoom-in duration-500">
          <div
            className={`inline-flex p-4 rounded-full mb-6 shadow-lg ${
              civiliansWon ? "bg-cyan-500/20 shadow-cyan-500/20" : "bg-rose-500/20 shadow-rose-500/20"
            }`}>
            {civiliansWon ? <Trophy className="w-16 h-16 text-cyan-400" /> : <Skull className="w-16 h-16 text-rose-500" />}
          </div>

          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">{civiliansWon ? "Vincitori" : "Vincitore"}</h2>
          <h1 className={`text-4xl font-black tracking-tight ${civiliansWon ? "text-cyan-400" : "text-rose-500"}`}>
            {civiliansWon ? "I CIVILI" : "MR. WHITE"}
          </h1>
        </div>

        {/* Rivelazione Identità */}
        <div className="bg-slate-800/50 rounded-2xl p-4 mb-8 border border-slate-700 text-left">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Riepilogo Ruoli</h3>

          <div className="space-y-3">
            {/* Mr White in evidenza */}
            {mrWhitePlayer && (
              <div className="flex items-center justify-between p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500/20 rounded-full">
                    <User className="w-4 h-4 text-rose-500" />
                  </div>
                  <div>
                    <p className="font-bold text-rose-100">{mrWhitePlayer.name}</p>
                    <p className="text-[10px] text-rose-400 font-bold uppercase">Era Mr. White</p>
                  </div>
                </div>
                {mrWhitePlayer.isAlive && !civiliansWon && <Crown className="w-5 h-5 text-amber-400" />}
                {!mrWhitePlayer.isAlive && <Skull className="w-5 h-5 text-slate-500" />}
              </div>
            )}

            {/* Lista rapida degli altri (Opzionale, se vuoi mostrare tutti) */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {Object.values(players)
                .filter((p) => p.role !== "MrWhite")
                .map((p) => (
                  <div key={p.connectionId} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800">
                    <div className={`w-2 h-2 rounded-full ${p.isAlive ? "bg-cyan-500" : "bg-slate-600"}`} />
                    <span className={`text-xs font-medium ${p.isAlive ? "text-slate-300" : "text-slate-500 line-through"}`}>{p.name}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Footer Azioni */}
        <div className="pt-6 border-t border-slate-800 flex flex-col gap-3">
          {isHost ? (
            <Button onClick={handleRestart} fullWidth variant="primary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Gioca di Nuovo
            </Button>
          ) : (
            <p className="text-xs text-slate-500 italic animate-pulse">In attesa che l&apos;host decida...</p>
          )}

          <Button onClick={handleExit} fullWidth variant="ghost" className="text-slate-400 hover:text-white">
            <LogOut className="w-4 h-4 mr-2" />
            Esci dal Gioco
          </Button>
        </div>
      </div>
    </div>
  );
}
