"use client";

import React from "react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Database, RotateCcw } from "lucide-react";
import { IS_MOCK_MODE } from "@/lib/api/client";

export function MockIndicator() {
  const { resetDemoData } = useAuth();

  if (!IS_MOCK_MODE) return null;

  return (
    <div className="flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200/70 text-xs text-sky-800">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
        <span className="font-semibold flex items-center gap-1">
          <Database className="h-3.5 w-3.5 text-sky-600" />
          Interactive Demo Sandbox
        </span>
        <span className="text-sky-700/80 hidden sm:inline">
          (Fictional clinical records & persistent mock adapter)
        </span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={resetDemoData}
        className="h-6 px-2 text-[11px] text-sky-800 hover:bg-sky-100 hover:text-sky-900 gap-1 font-medium"
        title="Reset sample doctors and patients back to default"
      >
        <RotateCcw className="h-3 w-3" />
        Reset Sample Data
      </Button>
    </div>
  );
}
