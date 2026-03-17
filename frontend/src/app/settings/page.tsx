"use client";

import React, { useState } from "react";
import { User, Key, Database, Bell, AlertTriangle, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState("gsk_••••••••••••••••••••••••••••••••");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding: "32px", maxWidth: 780 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#F0F6FC", margin: 0 }}>Settings</h1>
        <p style={{ fontSize: 14, color: "#6B7280", margin: "4px 0 0" }}>Manage your account and integrations</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Profile */}
        <section className="ds-card ds-card-accent" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#F0F6FC", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <User size={16} color="#6366F1" /> Profile
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: "#8B949E", display: "block", marginBottom: 6 }}>Full Name</label>
              <input className="glass-input" defaultValue="Andrew Ihab" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#8B949E", display: "block", marginBottom: 6 }}>Email</label>
              <input className="glass-input" defaultValue="andrew@helpdesk.ai" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#8B949E", display: "block", marginBottom: 6 }}>Role</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="badge badge-open">Support Admin</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <button className="btn-primary" onClick={handleSave}>
              {saved ? "✓ Saved" : "Save Changes"}
            </button>
          </div>
        </section>

        {/* API Config */}
        <section className="ds-card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#F0F6FC", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <Key size={16} color="#06B6D4" /> API Configuration
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: "#8B949E", display: "block", marginBottom: 6 }}>Groq API Key</label>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <input className="glass-input" type={showKey ? "text" : "password"} value={apiKey} onChange={(e) => setApiKey(e.target.value)} style={{ paddingRight: 36 }} />
                  <button onClick={() => setShowKey(!showKey)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6B7280", cursor: "pointer" }}>
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <button className="btn-secondary" style={{ whiteSpace: "nowrap" }}>Test Connection</button>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#8B949E", display: "block", marginBottom: 6 }}>LLM Model</label>
              <select className="glass-input">
                <option>llama-3.3-70b-versatile</option>
                <option>llama-3.1-8b-instant</option>
                <option>mixtral-8x7b-32768</option>
              </select>
            </div>
          </div>
        </section>

        {/* RAG Settings */}
        <section className="ds-card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#F0F6FC", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <Database size={16} color="#10B981" /> RAG Settings
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: "#8B949E", display: "block", marginBottom: 6 }}>Embedding Model</label>
              <input className="glass-input" disabled defaultValue="all-MiniLM-L6-v2 (local)" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#8B949E", display: "block", marginBottom: 6 }}>ChromaDB Collection</label>
              <input className="glass-input" defaultValue="helpdesk_knowledge" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#8B949E", display: "block", marginBottom: 6 }}>Max Retrieved Chunks</label>
              <input className="glass-input" type="number" defaultValue={5} min={1} max={20} />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn-secondary">
              <Database size={14} /> Re-index Knowledge Base
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section className="ds-card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#F0F6FC", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <Bell size={16} color="#F59E0B" /> Notifications
          </h2>
          {[
            { label: "New ticket assigned", desc: "Get notified when a ticket is assigned to you" },
            { label: "Ticket status updates", desc: "Updates when a ticket status changes" },
            { label: "Weekly digest", desc: "Summary of ticket activity every Monday" },
          ].map((n, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: i > 0 ? "1px solid #21262D" : "none" }}>
              <div>
                <p style={{ fontSize: 14, color: "#F0F6FC", margin: 0, fontWeight: 500 }}>{n.label}</p>
                <p style={{ fontSize: 12, color: "#6B7280", margin: "2px 0 0" }}>{n.desc}</p>
              </div>
              <label style={{ cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ accentColor: "#6366F1", width: 16, height: 16 }} />
              </label>
            </div>
          ))}
        </section>

        {/* Danger Zone */}
        <section className="ds-card" style={{ padding: 24, borderColor: "rgba(244,63,94,0.3)", borderTop: "2px solid #F43F5E" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#F43F5E", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={16} /> Danger Zone
          </h2>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{ background: "none", border: "1px solid #F43F5E", color: "#F43F5E", borderRadius: 6, padding: "8px 16px", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              Delete All Tickets
            </button>
            <button style={{ background: "none", border: "1px solid rgba(244,63,94,0.4)", color: "#FDA4AF", borderRadius: 6, padding: "8px 16px", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              Reset Knowledge Base
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
