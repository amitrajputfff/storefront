"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        {children}
        <Toaster position="bottom-center" />
      </TooltipProvider>
    </ThemeProvider>
  );
}
