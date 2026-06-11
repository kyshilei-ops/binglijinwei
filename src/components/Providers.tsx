"use client";

import { LanguageProvider } from "@/lib/LanguageContext";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
