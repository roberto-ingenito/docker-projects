"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import Button from "../ui/button";
import { MessageSquare, Gavel, User, Skull } from "lucide-react";
import { signalRBridge } from "@/lib/services/signarHubService";

export default function TalkingScreen() {
  const { roomCode, players } = useAppSelector((state) => state.gameRoom.room);
  const connectionId = useAppSelector((state) => state.gameRoom.connectionId);

  const playerList = Object.values(players);
  const me = players[connectionId];
  const isHost = me?.isHost;

  const handleStartVoting = () => {
    signalRBridge.invoke("StartVoting", roomCode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        {/* Header della Fase */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-cyan-500/10 rounded-xl mb-4">
            <MessageSquare className="w-8 h-8 text-cyan-500" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Discussione</h1>
        </div>

        {/* Lista dei Giocatori e del loro stato */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Stato Giocatori</h2>
          {playerList.map((player) => (
            <div
              key={player.connectionId}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                !player.isAlive ? "bg-slate-950 border-slate-800 opacity-60" : "bg-slate-800/50 border-slate-700"
              }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${!player.isAlive ? "bg-slate-800" : "bg-slate-700"}`}>
                  {!player.isAlive ? <Skull className="w-4 h-4 text-slate-500" /> : <User className="w-4 h-4 text-slate-400" />}
                </div>
                <span className={`font-bold ${!player.isAlive ? "text-slate-500 line-through" : "text-slate-200"}`}>{player.name}</span>
              </div>

              {!player.isAlive ? (
                <span className="text-[10px] font-bold uppercase text-slate-600 px-2 py-1 bg-slate-900 rounded-md">Eliminato</span>
              ) : (
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-bold uppercase text-emerald-500">In gioco</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t rounded-full border-slate-800 my-8"></div>

        {/* Footer con Azione Host */}
        <div>
          {isHost ? (
            <div className="space-y-3">
              <Button onClick={handleStartVoting} fullWidth variant="primary" className="gap-2">
                <Gavel className="w-5 h-5" />
                Apri le Votazioni
              </Button>
            </div>
          ) : (
            <div className="text-center p-4 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
              <p className="text-slate-400 text-sm">L&apos;host aprirà le votazioni tra poco...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
