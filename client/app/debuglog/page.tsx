"use client";
import React, { useState } from "react";
import { debugLocationTrackingState } from "../lib/client/locationTracking";
import { useSessionStore } from "../lib/store/sessionStore";

export default function DebugLogPage() {
  const [log, setLog] = useState<string>("");
  const sessionStoreState = useSessionStore();

  const handleDebug = () => {
    // Capture the debug output
    let output = "";
    const originalConsoleDebug = console.debug;
    console.debug = (...args: any[]) => {
      output +=
        args
          .map((a) =>
            typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)
          )
          .join(" ") + "\n";
    };
    try {
      debugLocationTrackingState();
    } finally {
      console.debug = originalConsoleDebug;
    }
    setLog(output);
  };

  return (
    <div style={{ padding: 24, marginTop: 20 }}>
      <h1>Location Tracking Debug Log</h1>
      <button onClick={handleDebug} style={{ marginBottom: 16 }}>
        Show Tracking State
      </button>
      <pre
        style={{
          background: "#222",
          color: "#0f0",
          padding: 16,
          borderRadius: 8,
          minHeight: 200,
        }}
      >
        {log || "Click the button to show debug info."}
      </pre>

      <div style={{ marginTop: 32 }}>
        <h2>Session Store (Full State)</h2>
        <pre
          style={{
            background: "#222",
            color: "#0ff",
            padding: 16,
            borderRadius: 8,
            minHeight: 100,
            maxHeight: 320,
            overflow: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
          {JSON.stringify(sessionStoreState, null, 2)}
        </pre>
      </div>
    </div>
  );
}
