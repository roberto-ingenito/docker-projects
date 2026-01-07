"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useAppDispatch } from "@/lib/redux/hooks";
import { getCategories } from "@/lib/redux/slices/gameRoomSlice";
import { signalRBridge } from "@/lib/services/signarHubService";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const dispatch = useAppDispatch();

  const [userName, setUserName] = useState("");
  const [roomToJoin, setRoomToJoin] = useState("");

  // Stato per gli errori
  const [errors, setErrors] = useState({
    userName: "",
    roomToJoin: "",
  });

  useEffect(() => {
    signalRBridge.init(dispatch);
    dispatch(getCategories());
  }, [dispatch]);

  const validate = (isJoining = false) => {
    let isValid = true;
    const newErrors = { userName: "", roomToJoin: "" };

    // Validazione Nome (sempre richiesta)
    if (!userName.trim()) {
      newErrors.userName = "Il nome è obbligatorio";
      isValid = false;
    }

    // Validazione Codice Stanza (solo se si sta entrando in una stanza)
    if (isJoining) {
      if (roomToJoin.length !== 4) {
        newErrors.roomToJoin = "Il codice deve essere di 4 caratteri";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreate = async () => {
    if (!validate(false)) return;

    console.log("Creazione stanza per:", userName);
    const response = await signalRBridge.invoke("CreateRoom", userName);
    console.log("Risposta: ", response);
  };

  const handleJoin = async () => {
    if (!validate(true)) return;

    console.log("Entrata nella stanza:", roomToJoin, "come:", userName);
    const response = await signalRBridge.invoke("JoinRoom", roomToJoin, userName);

    console.log("Risposta: ", response);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
        <h1 className="text-4xl font-black text-center mb-8 text-cyan-400 tracking-tighter">Mr. White</h1>

        {/* Input Nome */}
        <Input
          className="mb-4"
          label="Il tuo Nickname"
          placeholder="Inserisci nome..."
          value={userName}
          error={errors.userName}
          onChange={(e) => {
            setUserName(e.target.value);
            if (errors.userName) setErrors({ ...errors, userName: "" });
          }}
        />

        {/* Azione Crea */}
        <Button fullWidth onClick={handleCreate} variant="primary">
          Crea Nuova Stanza
        </Button>

        <div className="flex items-center my-6">
          <div className="grow border-t border-slate-700"></div>
          <span className="mx-4 text-slate-500 text-sm">oppure</span>
          <div className="grow border-t border-slate-700"></div>
        </div>

        {/* Azione Entra */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-start">
            <Input
              placeholder="Codice"
              value={roomToJoin}
              error={errors.roomToJoin}
              onChange={(e) => {
                setRoomToJoin(e.target.value);
                if (errors.roomToJoin) setErrors({ ...errors, roomToJoin: "" });
              }}
              maxLength={4}
            />

            <Button onClick={handleJoin} variant="primary" className="h-12.5">
              Entra
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
