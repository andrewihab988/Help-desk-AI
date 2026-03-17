"use client";

import React, { useState, KeyboardEvent } from "react";
import { Send, Paperclip } from "lucide-react";

interface InputBarProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function InputBar({ onSend, disabled }: InputBarProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ padding: "12px 20px 16px" }}>
      <div style={{
        display: "flex", gap: 10, alignItems: "flex-end",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${message.trim() ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 10, padding: "10px 12px",
        transition: "border-color 0.15s",
      }}>
        <button style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", padding: "4px", borderRadius: 4, flexShrink: 0, display: "flex" }}>
          <Paperclip size={16} />
        </button>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message…"
          disabled={disabled}
          rows={1}
          style={{
            flex: 1, background: "none", border: "none", outline: "none",
            color: "#F0F6FC", fontSize: 14, fontFamily: "inherit", resize: "none",
            lineHeight: 1.5, maxHeight: 120, overflowY: "auto",
          }}
          onInput={(e) => {
            const t = e.currentTarget;
            t.style.height = "auto";
            t.style.height = Math.min(t.scrollHeight, 120) + "px";
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
          <button
            onClick={handleSend}
            disabled={disabled || !message.trim()}
            style={{
              background: message.trim() && !disabled ? "#6366F1" : "rgba(99,102,241,0.2)",
              border: "none", borderRadius: 6, padding: "7px 10px",
              color: message.trim() && !disabled ? "white" : "#6B7280",
              cursor: message.trim() && !disabled ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}
          >
            <Send size={15} />
          </button>
          <span style={{ fontSize: 10, color: "#6B7280", whiteSpace: "nowrap" }}>⌘ Enter</span>
        </div>
      </div>
    </div>
  );
}
