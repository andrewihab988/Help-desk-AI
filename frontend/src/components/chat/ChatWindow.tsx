"use client";

import React, { useRef, useEffect } from "react";
import { useChatStore } from "@/lib/store";
import { Bot, FileText, Send } from "lucide-react";
import type { ChatMessage } from "@/types";

interface ChatWindowProps {
  onSend?: (message: string) => void;
}

const QUICK_REPLIES = [
  "How do I reset my password?",
  "What are the API rate limits?",
  "Track my refund status",
];

export function ChatWindow({ onSend }: ChatWindowProps) {
  const { messages, isTyping, addMessage } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleQuickReply = (text: string) => {
    if (onSend) {
      onSend(text);
    } else {
      const userMessage = {
        id: `msg_${Date.now()}`,
        role: "user" as const,
        content: text,
        timestamp: new Date(),
      };
      addMessage(userMessage);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      ref={scrollRef}
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        minHeight: 0,
      }}
    >
      {messages.length === 0 ? (
        <div style={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          textAlign: "center", 
          padding: "40px 20px",
          minHeight: "400px",
        }}>
          <div style={{
            width: 72, 
            height: 72, 
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            marginBottom: 24, 
            boxShadow: "0 8px 32px rgba(99,102,241,0.35)",
          }}>
            <Bot size={32} color="white" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#F0F6FC", margin: "0 0 12px" }}>
            How can I help you?
          </h2>
          <p style={{ fontSize: 14, color: "#8B949E", maxWidth: 380, lineHeight: 1.6, margin: "0 0 28px" }}>
            Ask me about password resets, billing, technical issues, or anything else.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", maxWidth: "420px" }}>
            {QUICK_REPLIES.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuickReply(q)}
                className="quick-reply-chip"
                style={{ border: "none", fontFamily: "inherit" }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} formatTime={formatTime} />
          ))}
        </>
      )}

      {isTyping && (
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "4px 0" }}>
          <div style={{
            width: 36, 
            height: 36, 
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366F1, #06B6D4)",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            flexShrink: 0,
          }}>
            <Bot size={16} color="white" />
          </div>
          <div style={{ 
            display: "flex", 
            gap: 4, 
            padding: "14px 18px",
            background: "#1C2128",
            border: "1px solid #30363D",
            borderRadius: "6px 20px 20px 20px",
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#6366F1",
              animation: "bounce 1.4s infinite ease-in-out both",
              animationDelay: "-0.32s",
            }} />
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#6366F1",
              animation: "bounce 1.4s infinite ease-in-out both",
              animationDelay: "-0.16s",
            }} />
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#6366F1",
              animation: "bounce 1.4s infinite ease-in-out both",
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ message, formatTime }: { message: ChatMessage; formatTime: (d: Date) => string }) {
  const isUser = message.role === "user";

  return (
    <div style={{ 
      display: "flex", 
      gap: 12, 
      flexDirection: isUser ? "row-reverse" : "row", 
      alignItems: "flex-end",
      padding: "4px 0",
    }}>
      {/* Avatar */}
      <div style={{
        width: 36, 
        height: 36, 
        borderRadius: "50%", 
        flexShrink: 0,
        background: isUser 
          ? "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)" 
          : "linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        boxShadow: isUser 
          ? "0 4px 12px rgba(99, 102, 241, 0.3)" 
          : "0 4px 12px rgba(6, 182, 212, 0.2)",
      }}>
        {isUser ? (
          <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>AR</span>
        ) : (
          <Bot size={16} color="white" />
        )}
      </div>

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: "75%" }}>
        <div className={isUser ? "chat-bubble-user" : "chat-bubble-ai"}>
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{message.content}</p>
        </div>
        
        <span className="chat-timestamp" style={{ 
          textAlign: isUser ? "right" : "left",
          padding: isUser ? "0 4px" : "0",
        }}>
          {formatTime(message.timestamp)}
        </span>

        {!isUser && message.sources && message.sources.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginTop: 4 }}>
            <span style={{ fontSize: 11, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
              <FileText size={11} />
            </span>
            {message.sources.map((source, i) => (
              <span key={i} className="source-chip" title={`Category: ${source.category}`}>
                {source.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
