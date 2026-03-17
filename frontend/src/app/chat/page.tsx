"use client";

import React, { useState } from "react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { InputBar } from "@/components/chat/InputBar";
import { useChatStore } from "@/lib/store";
import { sendChatMessageStream } from "@/lib/api";
import { Bot, Plus, BookOpen, Ticket } from "lucide-react";

const RELATED_TICKETS = [
  { id: "002", title: "Cannot Login After Password Change", status: "in_progress", priority: "high" },
  { id: "007", title: "Two-Factor Auth Not Working", status: "in_progress", priority: "high" },
];

const KB_SOURCES = [
  { title: "Password Reset Process", relevance: 92 },
  { title: "Account Security FAQ", relevance: 78 },
  { title: "Two-Factor Auth Setup", relevance: 65 },
];

export default function ChatPage() {
  const { messages, addMessage, updateLastMessage, setTyping, isTyping, clearMessages } = useChatStore();

  const handleSend = async (message: string) => {
    const userMessage = {
      id: `msg_${Date.now()}`,
      role: "user" as const,
      content: message,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    const aiMessage = {
      id: `msg_${Date.now()}_ai`,
      role: "assistant" as const,
      content: "",
      sources: [],
      timestamp: new Date(),
    };
    addMessage(aiMessage);
    setTyping(true);

    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    try {
      await sendChatMessageStream(message, (data) => {
        if (data.type === "content") {
          const currentMessages = useChatStore.getState().messages;
          const lastMsg = currentMessages[currentMessages.length - 1];
          if (lastMsg) updateLastMessage(lastMsg.content + (data.content || ""), lastMsg.sources);
        } else if (data.type === "sources") {
          const currentMessages = useChatStore.getState().messages;
          const lastMsg = currentMessages[currentMessages.length - 1];
          if (lastMsg) updateLastMessage(lastMsg.content, data.sources);
        }
      }, history);
    } catch {
      const currentMessages = useChatStore.getState().messages;
      const lastMsg = currentMessages[currentMessages.length - 1];
      if (lastMsg) updateLastMessage(lastMsg.content + "\n\nSorry, I encountered an error. Please try again.");
    } finally {
      setTyping(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Chat Header */}
        <div style={{
          borderBottom: "1px solid #21262D", padding: "16px 24px",
          display: "flex", alignItems: "center", gap: 12, background: "#0D1117",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366F1, #06B6D4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Bot size={18} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "#F0F6FC", margin: 0 }}>AI Assistant</h1>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px rgba(16,185,129,0.6)" }} />
              <span style={{ fontSize: 11, color: "#10B981" }}>Online</span>
            </div>
            <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>Powered by LLaMA 3.3 · RAG Enabled</p>
          </div>
          <button className="btn-outline" onClick={clearMessages} style={{ padding: "6px 12px", fontSize: 12 }}>
            <Plus size={12} /> New Chat
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#0D1117" }}>
          <ChatWindow onSend={handleSend} />
        </div>

        {/* Input Bar */}
        <div style={{ borderTop: "1px solid #21262D", background: "#0D1117" }}>
          <InputBar onSend={handleSend} disabled={isTyping} />
        </div>
      </div>

      {/* Right Context Sidebar */}
      <div style={{
        width: 280, borderLeft: "1px solid #21262D", background: "#0D1117",
        overflowY: "auto", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0,
      }}>
        {/* Related Tickets */}
        <div style={{ padding: 20, borderBottom: "1px solid #21262D" }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "#F0F6FC", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <Ticket size={13} color="#6366F1" /> Related Tickets
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.length === 0
              ? <p style={{ fontSize: 12, color: "#6B7280" }}>Start chatting to see related tickets</p>
              : RELATED_TICKETS.map((t) => (
                <div key={t.id} className="ds-card" style={{ padding: "10px 12px" }}>
                  <p style={{ fontSize: 12, color: "#F0F6FC", margin: "0 0 6px", fontWeight: 500, lineHeight: 1.3 }}>{t.title}</p>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span className={`badge badge-${t.status.replace("_", "-")}`} style={{ fontSize: 10 }}>
                      {t.status === "in_progress" ? "In Progress" : t.status}
                    </span>
                    <span className={`badge badge-${t.priority}`} style={{ fontSize: 10 }}>{t.priority}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Knowledge Sources */}
        <div style={{ padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "#F0F6FC", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <BookOpen size={13} color="#06B6D4" /> Knowledge Sources
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.length === 0
              ? <p style={{ fontSize: 12, color: "#6B7280" }}>Sources appear as you chat</p>
              : KB_SOURCES.map((s) => (
                <div key={s.title}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#D1D5DB" }}>{s.title}</span>
                    <span style={{ fontSize: 11, color: "#6366F1" }}>{s.relevance}%</span>
                  </div>
                  <div style={{ height: 3, background: "#21262D", borderRadius: 2 }}>
                    <div style={{
                      height: "100%", width: `${s.relevance}%`,
                      background: "linear-gradient(90deg, #6366F1, #06B6D4)", borderRadius: 2,
                    }} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
