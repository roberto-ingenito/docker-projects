import type { ReactNode } from "react";

export interface Service {
  id: string;
  title: string;
  category: string;
  desc: string;
  url: string;
}

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}
