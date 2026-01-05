"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import Button from "../ui/button";
import { ShieldCheck, UserSearch, MessageCircle } from "lucide-react";
import { signalRBridge } from "@/lib/services/signarHubService";

export default function RoleAssignmentScreen() {
  const { roomCode, players, word } = useAppSelector((state) => state.gameRoom.room);
  const connectionId = useAppSelector((state) => state.gameRoom.connectionId);

  const me = players[connectionId];
  const isMrWhite = me?.role === "MrWhite";
  const isHost = me?.isHost;

  const handleStartTalking = () => {
    signalRBridge.invoke("StartTalking", roomCode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
        {/* Visualizzazione Ruolo */}
        <div className="mb-8">
          <div className={`inline-flex p-6 rounded-full mb-6 ${isMrWhite ? "bg-rose-500/10" : "bg-cyan-500/10"}`}>
            {isMrWhite ? <UserSearch className="w-16 h-16 text-rose-500" /> : <ShieldCheck className="w-16 h-16 text-cyan-500" />}
          </div>

          <h1 className={`text-5xl font-black tracking-tighter mb-2 ${isMrWhite ? "text-rose-500" : "text-cyan-400"}`}>
            {isMrWhite ? "MR. WHITE" : "CIVILE"}
          </h1>
        </div>

        {/* Box Parola Segreta (Solo per Civili) */}
        {!isMrWhite && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-inner">
            <p className="text-slate-500 text-xs font-bold uppercase mb-2">La Parola Segreta è:</p>
            <p className="text-3xl font-black text-white tracking-widest uppercase">{word}</p>
          </div>
        )}

        <div className="border-t rounded-full border-slate-800 my-8"></div>

        {/* Footer con Azioni */}
        <div>
          {isHost ? (
            <div className="space-y-4">
              <Button onClick={handleStartTalking} fullWidth variant="primary" className="gap-2">
                <MessageCircle className="w-5 h-5" />
                Inizia la Discussione
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 text-slate-400 animate-bounce">
              <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
              <p className="text-sm font-medium">L&apos;host sta per avviare il round...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
