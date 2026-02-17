"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import Button from "../ui/button";
import { Gavel, CheckCircle2, User, Info, Lock, Swords, AlertTriangle } from "lucide-react";
import { signalRBridge } from "@/lib/services/signarHubService";

export default function VotingScreen() {
  const { roomCode, players, voting } = useAppSelector((state) => state.gameRoom.room);
  const { playersInTie } = useAppSelector((state) => state.gameRoom);
  const connectionId = useAppSelector((state) => state.gameRoom.connectionId);

  const playerList = Object.values(players);
  const me = players[connectionId];
  const isHost = me?.isHost;

  const alivePlayers = playerList.filter((p) => p.isAlive);
  const votesCount = Object.keys(voting).length;
  const aliveCount = alivePlayers.length;
  const allVoted = votesCount === aliveCount;

  const hasVoted = !!voting[connectionId];
  const votedForId = voting[connectionId];

  const isTieBreaker = playersInTie && playersInTie.length > 0;

  // In caso di pareggio, i candidati sono solo i giocatori in parità
  const candidates = isTieBreaker
    ? alivePlayers.filter((p) => playersInTie.includes(p.connectionId))
    : alivePlayers.filter((p) => p.connectionId !== connectionId);

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
        {/* Banner Pareggio */}
        {isTieBreaker && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-amber-500/30 bg-amber-500/5 animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-3 bg-amber-500/10 px-4 py-3 border-b border-amber-500/20">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-amber-400 font-black text-sm uppercase tracking-widest">Pareggio!</p>
            </div>
            <div className="px-4 py-3 flex items-center justify-center gap-3 flex-wrap">
              {playersInTie.map((id, i) => (
                <span key={id} className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-slate-800 border border-amber-500/30 text-amber-300 font-bold text-sm rounded-full">
                    {players[id]?.name}
                  </span>
                  {i < playersInTie.length - 1 && <Swords className="w-4 h-4 text-amber-500/60" />}
                </span>
              ))}
            </div>
            <p className="text-center text-[11px] text-slate-400 pb-3 px-4">
              I giocatori in pareggio si sfidano in un nuovo voto. Decidi chi eliminare!
            </p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex p-3 rounded-xl mb-4 ${isTieBreaker ? "bg-amber-500/10" : "bg-rose-500/10"}`}>
            {isTieBreaker ? <Swords className="w-8 h-8 text-amber-400" /> : <Gavel className="w-8 h-8 text-rose-500" />}
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">{isTieBreaker ? "Voto di Spareggio" : "Votazione"}</h1>
          {isTieBreaker && <p className="text-amber-400/70 text-xs mt-1 font-medium uppercase tracking-widest">Round decisivo</p>}
        </div>

        {/* Barra progresso voti */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden mb-2 border border-slate-700">
            <div
              className={`h-full transition-all duration-500 ease-out bg-linear-to-r ${
                isTieBreaker ? "from-amber-600 to-amber-400" : "from-cyan-600 to-cyan-400"
              }`}
              style={{ width: `${(votesCount / aliveCount) * 100}%` }}
            />
          </div>
          <p className="text-sm font-bold text-slate-300">
            Hanno votato: <span className={`text-lg ${isTieBreaker ? "text-amber-400" : "text-cyan-400"}`}>{votesCount}</span> su{" "}
            <span className="text-white text-lg">{aliveCount}</span>
          </p>
        </div>

        {/* Stato voto utente */}
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
          <div
            className={`border rounded-2xl p-4 mb-6 flex items-center gap-3 ${
              isTieBreaker ? "bg-amber-500/5 border-amber-500/20" : "bg-slate-800/30 border-slate-700"
            }`}>
            <Info className={`w-5 h-5 shrink-0 ${isTieBreaker ? "text-amber-400" : "text-cyan-400"}`} />
            <p className="text-xs text-slate-400">
              {isTieBreaker ? "Scegli chi eliminare tra i giocatori in parità." : "Seleziona un giocatore per eliminarlo."}
            </p>
          </div>
        ) : (
          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-4 mb-6 text-center">
            <p className="text-xs text-slate-500">I morti non votano... (Shh!)</p>
          </div>
        )}

        {/* Griglia candidati */}
        <div className="grid grid-cols-1 gap-2 mb-8 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
          {candidates.map((player) => {
            const isInTie = isTieBreaker && playersInTie.includes(player.connectionId);
            return (
              <button
                key={player.connectionId}
                disabled={hasVoted || !me.isAlive}
                onClick={() => handleVote(player.connectionId)}
                className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                  hasVoted
                    ? "opacity-40 grayscale cursor-not-allowed border-slate-800 bg-slate-900"
                    : isInTie
                      ? "bg-amber-500/5 border-amber-500/20 hover:border-amber-400/60 hover:bg-amber-500/10 active:scale-95"
                      : "bg-slate-800/50 border-slate-700 hover:border-rose-500/50 hover:bg-slate-800 active:scale-95"
                }`}>
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full transition-colors ${
                      isInTie && !hasVoted ? "bg-amber-500/10 group-hover:bg-amber-500/20" : "bg-slate-700 group-hover:bg-rose-500/20"
                    }`}>
                    {isInTie && !hasVoted ? (
                      <Swords className="w-4 h-4 text-amber-400 group-hover:text-amber-300" />
                    ) : (
                      <User className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
                    )}
                  </div>
                  <span className={`font-bold text-sm group-hover:text-white ${isInTie ? "text-amber-200" : "text-slate-200"}`}>{player.name}</span>
                  {isInTie && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400/80 border border-amber-500/20 uppercase tracking-wider">
                      pareggio
                    </span>
                  )}
                </div>

                {!hasVoted && me.isAlive && (
                  <div
                    className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors ${
                      isInTie ? "border-amber-500/40 group-hover:border-amber-400" : "border-slate-600 group-hover:border-rose-500"
                    }`}>
                    <div
                      className={`w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                        isInTie ? "bg-amber-400" : "bg-rose-500"
                      }`}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Host */}
        <div className="pt-6 border-t border-slate-800">
          {isHost ? (
            <div className="space-y-3">
              <Button onClick={handleStartRevelation} fullWidth variant={allVoted ? "primary" : "secondary"} disabled={!allVoted}>
                {allVoted ? (
                  <>
                    <Gavel className="w-4 h-4 mr-2" />
                    {isTieBreaker ? "Elimina il Colpevole" : "Svela il Colpevole"}
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
