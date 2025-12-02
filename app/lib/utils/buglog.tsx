"use client";
import React, { useState } from "react";
import { useDebugLog } from "../context/DebugLogContext";
import { Bug } from "lucide-react";

export default function BugLogPage() {
  const { logs, clearLogs } = useDebugLog();
  const [open, setOpen] = useState(false);

  // Responsive styles
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 600;

  return (
    <div style={{ position: "fixed", bottom: 12, right: 24, zIndex: 10000 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          margin: 8,
          padding: "10px 10px",
          background: "#222",
          color: "#fff",
          borderRadius: 100,
          border: "none",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <Bug size={20} />
      </button>
      {open && (
        <div
          style={{
            width: isMobile ? "91vw" : 400,
            maxHeight: isMobile ? "60vh" : 500,
            overflowY: "auto",
            background: "#181818",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: isMobile ? "16px 16px 0 0" : 8,
            boxShadow: isMobile ? "0 -2px 12px #0008" : "0 2px 12px #0008",
            padding: isMobile ? 8 : 16,
            marginLeft: isMobile ? "auto" : undefined,
            marginRight: isMobile ? "auto" : undefined,
            position: isMobile ? "fixed" : "static",
            left: isMobile ? 0 : undefined,
            right: isMobile ? 0 : undefined,
            top: isMobile ? 56 : undefined,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: isMobile ? 8 : 0,
            }}
          >
            <strong style={{ fontSize: isMobile ? 18 : 16 }}>Debug Log</strong>
            <button
              onClick={clearLogs}
              style={{
                background: "#333",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: isMobile ? "6px 14px" : "2px 8px",
                cursor: "pointer",
                fontSize: isMobile ? 16 : 13,
              }}
            >
              Clear
            </button>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {logs.length === 0 && (
              <li style={{ color: "#aaa", fontSize: isMobile ? 16 : 14 }}>
                No logs yet.
              </li>
            )}
            {logs.map((log, i) => (
              <li
                key={i}
                style={{
                  margin: isMobile ? "10px 0" : "12px 0",
                  borderLeft: `4px solid ${
                    log.type === "error"
                      ? "#f44"
                      : log.type === "warn"
                      ? "#ff0"
                      : "#0af"
                  }`,
                  paddingLeft: 8,
                  fontSize: isMobile ? 15 : 14,
                }}
              >
                <div style={{ fontSize: isMobile ? 12 : 12, color: "#888" }}>
                  {new Date(log.timestamp).toLocaleString()}
                </div>
                <div style={{ fontWeight: 600 }}>{log.type.toUpperCase()}</div>
                <div
                  style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
                >
                  {log.message}
                </div>
                {log.stack && (
                  <details style={{ color: "#aaa" }}>
                    <summary>Stack</summary>
                    <pre style={{ fontSize: isMobile ? 10 : 11 }}>
                      {log.stack}
                    </pre>
                  </details>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
