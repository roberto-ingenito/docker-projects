"use client";

import { Button } from "@/lib/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn-components/ui/dialog";
import React from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";

export function ProfileDialog({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  const dispatch = useAppDispatch();

  async function _logout() {
    await dispatch(logout());
    router.replace("/login");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profilo</DialogTitle>
          <DialogDescription>EMAIL UTENTE</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm" className="w-1/2 self-end" onClick={_logout}>
            <LogOut />
            <span>Esci</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
