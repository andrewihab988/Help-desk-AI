"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Ticket,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { fetchTicketStats, fetchTickets } from "@/lib/api";
import type { Ticket as TicketType, TicketStats } from "@/types";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const barData = [18, 26, 22, 31, 27, 14, 10];
const maxBar = Math.max(...barData);

function BarChart() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 60, padding: "0 4px" }}>
      {barData.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div
            style={{
              width: "100%",
              height: `${(v / maxBar) * 52}px`,
              background: i === 3 ? "#6366F1" : "rgba(99,102,241,0.3)",
              borderRadius: "3px 3px 0 0",
              transition: "height 0.3s",
            }}
          />
          <span style={{ fontSize: 10, color: "#6B7280" }}>{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls = `badge badge-${status.toLowerCase().replace(" ", "-")}`;
  const labels: Record<string, string> = {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
  };
  return <span className={cls}>{labels[status] ?? status}</span>;
}

function PriorityBadge({ priority }: { priority: string }) {
  return <span className={`badge badge-${priority.toLowerCase()}`}>{priority}</span>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [recentTickets, setRecentTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, ticketsData] = await Promise.all([
          fetchTicketStats(),
          fetchTickets({ limit: 5 }),
        ]);
        setStats(statsData);
        setRecentTickets(ticketsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const kpiCards = [
    {
      label: "Total Tickets",
      value: stats?.total ?? 0,
      icon: <Ticket size={18} color="#6366F1" />,
      delta: "+12%",
      deltaColor: "#10B981",
    },
    {
      label: "Open",
      value: stats?.open ?? 0,
      icon: <AlertCircle size={18} color="#06B6D4" />,
      delta: "+3",
      deltaColor: "#06B6D4",
    },
    {
      label: "In Progress",
      value: stats?.in_progress ?? 0,
      icon: <Clock size={18} color="#F59E0B" />,
      delta: "-2",
      deltaColor: "#10B981",
    },
    {
      label: "Resolved",
      value: stats?.resolved ?? 0,
      icon: <CheckCircle2 size={18} color="#10B981" />,
      delta: "+8%",
      deltaColor: "#10B981",
    },
  ];

  return (
    <div style={{ padding: "32px", maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#F0F6FC", margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: "#6B7280", margin: "4px 0 0" }}>
            Welcome back, Andrew — here's what's happening today.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/chat">
            <button className="btn-primary">
              <MessageSquare size={15} /> Ask AI
            </button>
          </Link>
          <Link href="/tickets">
            <button className="btn-outline">
              <Ticket size={15} /> New Ticket
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="kpi-card" style={{ height: 100, opacity: 0.4 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
          {kpiCards.map((card, i) => (
            <div key={i} className="kpi-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: "#8B949E", fontWeight: 500 }}>{card.label}</span>
                {card.icon}
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#F0F6FC", lineHeight: 1 }}>{card.value}</div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                <TrendingUp size={12} color={card.deltaColor} />
                <span style={{ fontSize: 12, color: card.deltaColor, fontWeight: 500 }}>{card.delta}</span>
                <span style={{ fontSize: 12, color: "#6B7280" }}>this week</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Recent Tickets Table */}
        <div className="ds-card" style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px 16px", borderBottom: "1px solid #21262D" }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#F0F6FC", margin: 0 }}>Recent Tickets</h2>
            <Link href="/tickets">
              <button className="btn-outline" style={{ padding: "5px 12px", fontSize: 12 }}>
                View All <ArrowUpRight size={12} />
              </button>
            </Link>
          </div>
          <table className="ds-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "#6B7280", padding: "32px" }}>
                    No tickets yet
                  </td>
                </tr>
              )}
              {recentTickets.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div style={{ fontWeight: 500, color: "#F0F6FC", fontSize: 13 }}>{t.title}</div>
                    <div style={{ fontSize: 11, color: "#6B7280", fontFamily: "JetBrains Mono, monospace" }}>
                      #{String(t.id).padStart(3, "0")}
                    </div>
                  </td>
                  <td><PriorityBadge priority={t.priority} /></td>
                  <td><StatusBadge status={t.status} /></td>
                  <td style={{ fontSize: 12, color: "#8B949E", whiteSpace: "nowrap" }}>
                    {new Date(t.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Quick Actions */}
          <div className="ds-card" style={{ padding: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "#F0F6FC", margin: "0 0 14px" }}>
              Quick Actions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link href="/chat" style={{ textDecoration: "none" }}>
                <button className="btn-primary" style={{ width: "100%", justifyContent: "flex-start" }}>
                  <MessageSquare size={15} /> Ask AI Assistant
                </button>
              </Link>
              <Link href="/tickets" style={{ textDecoration: "none" }}>
                <button className="btn-outline" style={{ width: "100%", justifyContent: "flex-start" }}>
                  <Ticket size={15} /> Create New Ticket
                </button>
              </Link>
              <Link href="/knowledge" style={{ textDecoration: "none" }}>
                <button className="btn-outline" style={{ width: "100%", justifyContent: "flex-start" }}>
                  <Zap size={15} /> Browse Knowledge Base
                </button>
              </Link>
            </div>
          </div>

          {/* AI Preview */}
          <div className="ds-card" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#10B981",
                boxShadow: "0 0 6px rgba(16,185,129,0.5)"
              }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#F0F6FC" }}>AI Assistant</span>
              <span style={{ fontSize: 11, color: "#6B7280", marginLeft: "auto" }}>RAG Enabled</span>
            </div>
            <div className="chat-bubble-ai" style={{ maxWidth: "100%", fontSize: 13 }}>
              Hi! I'm your AI helpdesk assistant powered by LLaMA 3.3.
              How can I help you today?
            </div>
            <Link href="/chat" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ width: "100%", marginTop: 12, justifyContent: "center" }}>
                Start Conversation
              </button>
            </Link>
          </div>

          {/* Activity Chart */}
          <div className="ds-card" style={{ padding: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "#F0F6FC", margin: "0 0 14px" }}>
              Ticket Volume <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 400 }}>— last 7 days</span>
            </h2>
            <BarChart />
          </div>
        </div>
      </div>
    </div>
  );
}
