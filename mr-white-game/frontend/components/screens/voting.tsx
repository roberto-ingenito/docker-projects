"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import Button from "../ui/button"; // Assumo tu abbia il componente Button che abbiamo fatto
import { Gavel, CheckCircle2, User, Info, Lock } from "lucide-react";
import { signalRBridge } from "@/lib/services/signarHubService";

export default function VotingScreen() {
  const { roomCode, players, voting } = useAppSelector((state) => state.gameRoom.room);
  const connectionId = useAppSelector((state) => state.gameRoom.connectionId);

  const playerList = Object.values(players);
  const me = players[connectionId];
  const isHost = me?.isHost;

  // Calcolo statistiche
  const alivePlayers = playerList.filter((p) => p.isAlive);
  const votesCount = Object.keys(voting).length;
  const aliveCount = alivePlayers.length;
  const allVoted = votesCount === aliveCount;

  // Controlliamo se l'utente ha già votato
  const hasVoted = !!voting[connectionId];
  const votedForId = voting[connectionId];

  // Filtriamo candidati (vivi e non me stesso)
  const candidates = alivePlayers.filter((p) => p.connectionId !== connectionId);

  const handleVote = (targetId: string) => {
    if (!hasVoted && me.isAlive) {
      signalRBridge.invoke("Vote", roomCode, targetId);
    }
  };

  const handleStartRevelation = () => {
    if (allVoted) {
      signalRBridge.invoke("StartRevelation", roomCode);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        {/* Header Votazione */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-rose-500/10 rounded-xl mb-4">
            <Gavel className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Votazione</h1>
          <p className="text-slate-400 text-sm mt-2">Il destino del gruppo è nelle tue mani.</p>
        </div>

        {/* CONTATORE VOTI (Visibile a tutti) */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden mb-2 border border-slate-700">
            <div
              className="h-full bg-linear-to-r from-cyan-600 to-cyan-400 transition-all duration-500 ease-out"
              style={{ width: `${(votesCount / aliveCount) * 100}%` }}
            />
          </div>
          <p className="text-sm font-bold text-slate-300">
            Hanno votato: <span className="text-cyan-400 text-lg">{votesCount}</span> su <span className="text-white text-lg">{aliveCount}</span>
          </p>
        </div>

        {/* Stato del Voto dell'utente */}
        {hasVoted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mb-6 text-center animate-in zoom-in duration-300">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-emerald-500 font-bold">Voto Confermato</h3>
            </div>
            <p className="text-slate-400 text-xs">
              Sospetti di <span className="text-white font-bold">{players[votedForId]?.name}</span>.
            </p>
          </div>
        ) : me.isAlive ? (
          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0" />
            <p className="text-xs text-slate-400">Seleziona un giocatore per eliminarlo.</p>
          </div>
        ) : (
          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-4 mb-6 text-center">
            <p className="text-xs text-slate-500">I morti non votano... (Shh!)</p>
          </div>
        )}

        {/* Griglia Candidati */}
        <div className="grid grid-cols-1 gap-2 mb-8 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
          {candidates.map((player) => (
            <button
              key={player.connectionId}
              disabled={hasVoted || !me.isAlive}
              onClick={() => handleVote(player.connectionId)}
              className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                hasVoted
                  ? "opacity-40 grayscale cursor-not-allowed border-slate-800 bg-slate-900"
                  : "bg-slate-800/50 border-slate-700 hover:border-rose-500/50 hover:bg-slate-800 active:scale-95"
              }`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700 rounded-full group-hover:bg-rose-500/20 transition-colors">
                  <User className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
                </div>
                <span className="font-bold text-sm text-slate-200 group-hover:text-white">{player.name}</span>
              </div>

              {!hasVoted && me.isAlive && (
                <div className="w-5 h-5 border-2 border-slate-600 rounded-full flex items-center justify-center group-hover:border-rose-500">
                  <div className="w-2 h-2 bg-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Footer: Azione Host */}
        <div className="pt-6 border-t border-slate-800">
          {isHost ? (
            <div className="space-y-3">
              <Button
                onClick={handleStartRevelation}
                fullWidth
                variant={allVoted ? "primary" : "secondary"} // Cambia stile se attivo
                disabled={!allVoted} // Disabilitato finché non votano tutti
              >
                {allVoted ? (
                  <>
                    <Gavel className="w-4 h-4 mr-2" />
                    Svela il Colpevole
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    In attesa dei voti...
                  </>
                )}
              </Button>
              {!allVoted && <p className="text-center text-[10px] text-slate-500 uppercase tracking-wider">Tutti devono votare per procedere</p>}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xs text-slate-500 animate-pulse">
                {allVoted ? "L'host sta per leggere il verdetto..." : "In attesa che tutti abbiano votato..."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
