"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type DebugLogEntry = {
  type: "error" | "warn" | "info";
  message: string;
  stack?: string;
  timestamp: number;
};

interface DebugLogContextType {
  logs: DebugLogEntry[];
  addLog: (entry: DebugLogEntry) => void;
  clearLogs: () => void;
}

const DebugLogContext = createContext<DebugLogContextType | undefined>(
  undefined
);

export const DebugLogProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<DebugLogEntry[]>([]);

  const addLog = (entry: DebugLogEntry) => {
    setLogs((prev) => [entry, ...prev]);
  };

  const clearLogs = () => setLogs([]);

  // Patch global error/warn/info
  React.useEffect(() => {
    const origError = console.error;
    const origWarn = console.warn;
    const origInfo = console.info;

    console.error = (...args) => {
      addLog({
        type: "error",
        message: args.map(String).join(" "),
        timestamp: Date.now(),
        stack: new Error().stack,
      });
      origError(...args);
    };
    console.warn = (...args) => {
      addLog({
        type: "warn",
        message: args.map(String).join(" "),
        timestamp: Date.now(),
        stack: new Error().stack,
      });
      origWarn(...args);
    };
    console.info = (...args) => {
      addLog({
        type: "info",
        message: args.map(String).join(" "),
        timestamp: Date.now(),
        stack: new Error().stack,
      });
      origInfo(...args);
    };
    return () => {
      console.error = origError;
      console.warn = origWarn;
      console.info = origInfo;
    };
  }, []);

  return (
    <DebugLogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </DebugLogContext.Provider>
  );
};

export function useDebugLog() {
  const ctx = useContext(DebugLogContext);
  if (!ctx) throw new Error("useDebugLog must be used within DebugLogProvider");
  return ctx;
}
