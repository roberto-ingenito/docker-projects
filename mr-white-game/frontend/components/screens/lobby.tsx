"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import Button from "../ui/button";
import { signalRBridge } from "@/lib/services/signarHubService";
import { Copy, Users, Crown, User, Layers, Lightbulb, Check } from "lucide-react";
import { setSelectedCategories, toggleHintEnabled } from "@/lib/redux/slices/gameRoomSlice";

export default function LobbyScreen() {
  const dispatch = useAppDispatch();

  const { roomCode, players } = useAppSelector((state) => state.gameRoom.room);
  const connectionId = useAppSelector((state) => state.gameRoom.connectionId);
  const categories = useAppSelector((state) => state.gameRoom.categories);
  const selectedCategories = useAppSelector((state) => state.gameRoom.selectedCategories);
  const hintEnabled = useAppSelector((state) => state.gameRoom.room.hintEnabled);

  const playerList = Object.values(players);
  const me = players[connectionId];
  const isHost = me?.isHost;
  const canStart = playerList.length >= 3;

  function handleStartGame() {
    if (canStart) {
      signalRBridge.invoke("StartGame", roomCode, selectedCategories, hintEnabled);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(roomCode);
  }

  // Gestione selezione/deselezione
  function toggleCategory(category: string) {
    if (selectedCategories.includes(category)) {
      dispatch(setSelectedCategories(selectedCategories.filter((c) => c !== category)));
    } else {
      dispatch(setSelectedCategories([...selectedCategories, category]));
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        {/* Header con Codice Stanza */}
        <div className="text-center mb-10">
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest mb-2">Codice Stanza</p>
          <div onClick={copyToClipboard} className="group flex items-center justify-center gap-3 cursor-pointer">
            <h1 className="text-6xl font-black text-cyan-400 tracking-tighter group-hover:text-cyan-300 transition-colors">{roomCode}</h1>
            <Copy className="text-slate-600 group-hover:text-cyan-400 transition-colors w-6 h-6" />
          </div>
        </div>

        {/* Lista Giocatori */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-500" />
              Giocatori
            </h2>
          </div>

          <div className="grid gap-3">
            {playerList.map((player) => (
              <div
                key={player.connectionId}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  player.connectionId === connectionId ? "bg-cyan-500/10 border-cyan-500/30" : "bg-slate-800/50 border-slate-700/50"
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${player.isHost ? "bg-amber-500/20" : "bg-slate-700"}`}>
                    {player.isHost ? <Crown className="w-4 h-4 text-amber-500" /> : <User className="w-4 h-4 text-slate-400" />}
                  </div>
                  <span className={`font-bold ${player.connectionId === connectionId ? "text-cyan-400" : "text-slate-200"}`}>
                    {player.name} {player.connectionId === connectionId && "(Tu)"}
                  </span>
                </div>

                {player.isHost && (
                  <span className="text-[10px] font-black uppercase tracking-tighter px-2 py-1 bg-amber-500/20 text-amber-500 rounded-md border border-amber-500/30">
                    Host
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sezione Categorie (Visibile solo se ci sono categorie) */}
        {categories && categories.length > 0 && isHost && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-500" />
                Categorie
              </h2>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                {selectedCategories.length === 0 ? "Tutte (default)" : `${selectedCategories.length} scelte`}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                    }`}>
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {isHost && (
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-orange-500" />
              Indizio {hintEnabled ? "abilitato" : "disabilitato"}
            </h2>

            <label className="cursor-pointer select-none">
              {/* Input Nascosto */}
              <input type="checkbox" className="sr-only" checked={hintEnabled} onChange={() => dispatch(toggleHintEnabled())} />

              {/* Check Box */}
              <div
                className={`w-7 h-7 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                  hintEnabled
                    ? "bg-orange-500/20 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.7)]"
                    : "bg-slate-800 border-slate-700 group-hover:border-slate-500"
                }`}>
                {/* Icona Check */}
                <Check
                  className={`w-4 h-4 text-orange-500 transition-all duration-300 transform ${hintEnabled ? "scale-110 opacity-100" : "scale-0 opacity-0"}`}
                  strokeWidth={4}
                />
              </div>
            </label>
          </div>
        )}

        <div className="border-t rounded-full border-slate-800 my-8"></div>

        {/* Footer con Azioni */}
        <div>
          {isHost ? (
            <div className="space-y-4">
              <Button onClick={handleStartGame} fullWidth variant="primary" disabled={!canStart}>
                Avvia Partita
              </Button>
              {!canStart && <p className="text-center text-rose-500 text-xs font-medium animate-pulse">Servono almeno 3 giocatori per iniziare</p>}
            </div>
          ) : (
            <div className="text-center p-4 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
              <p className="text-slate-400 text-sm italic">In attesa che l&apos;host avvii la partita...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
