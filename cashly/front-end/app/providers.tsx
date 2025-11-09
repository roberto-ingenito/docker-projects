"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/toast";
import { Provider as ReduxProvider } from "react-redux";
import { setUser } from "@/lib/redux/slices/authSlice";
import { User } from "@/lib/types/auth";
import store from "@/lib/redux/store";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  initialUserData: User | undefined
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

export function Providers({ children, themeProps, initialUserData }: ProvidersProps) {
  const router = useRouter();

  const initialized = React.useRef(false)

  React.useEffect(() => {
    if (!initialized.current && initialUserData) {
      store.dispatch(setUser(initialUserData))
      initialized.current = true
    }
  }, [initialUserData])

  return (
    <HeroUIProvider navigate={router.push}>
      <ToastProvider
        toastProps={{
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        }}
        placement="top-right"
      />
      <NextThemesProvider {...themeProps}>
        <ReduxProvider store={store}>{children}</ReduxProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
