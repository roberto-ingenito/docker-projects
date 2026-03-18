"use client";

import { useEffect, useState } from "react";
import * as actions from "@/app/actions";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setUser } from "@/lib/redux/slices/authSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      const jwtToken = await actions.getJwtToken();
      const userData = await actions.getUser();

      if (userData && authState.user === null) {
        setIsLoading(true);
        dispatch(setUser({ user: userData, token: jwtToken || "" }));
        setIsLoading(false);
      }
    }
    loadUserData();
  }, [authState, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Caricamento utente in corso...</p>
      </div>
    );
  }

  return <>{children}</>;
}
