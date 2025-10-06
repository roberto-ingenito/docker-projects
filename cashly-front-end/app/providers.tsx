"use client";

import store from "@/lib/redux/store";
import React from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster richColors position="top-right" closeButton />
    </Provider>
  );
}
