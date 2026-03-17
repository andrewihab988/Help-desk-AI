"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen, Plus, Database, Search, Edit2, Eye, Trash2,
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  account: "Account", technical: "Technical", billing: "Billing",
  security: "Security", general: "General",
};

const API_BASE = "http://localhost:8000";

async function fetchArticles() {
  const res = await fetch(`${API_BASE}/api/knowledge`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

function ArticleCard({ article, onDelete }: { article: Article; onDelete: (id: string) => void }) {
  return (
    <div className="ds-card ds-card-accent" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#F0F6FC", margin: 0, lineHeight: 1.4 }}>
          {article.title}
        </h3>
        <span className={`badge badge-${article.category}`} style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
          {CATEGORY_LABELS[article.category] || article.category}
        </span>
      </div>
      <p style={{ fontSize: 13, color: "#8B949E", margin: 0, lineHeight: 1.5 }}>
        {article.content.length > 120 ? article.content.slice(0, 120) + "..." : article.content}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
        <span style={{ fontSize: 11, color: "#6B7280" }}>ID: {article.id}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ background: "none", border: "none", color: "#8B949E", cursor: "pointer", padding: 4, borderRadius: 4 }}
            title="Edit"><Edit2 size={14} /></button>
          <button style={{ background: "none", border: "none", color: "#8B949E", cursor: "pointer", padding: 4, borderRadius: 4 }}
            title="Preview"><Eye size={14} /></button>
          <button onClick={() => onDelete(article.id)}
            style={{ background: "none", border: "none", color: "#F43F5E", cursor: "pointer", padding: 4, borderRadius: 4 }}
            title="Delete"><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  );
}

export default function KnowledgePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("general");

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await fetchArticles();
      setArticles(data);
    } catch (err) {
      console.error("Failed to load articles:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || a.category === category;
    return matchSearch && matchCat;
  });

  const handleSync = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSyncing(false);
  };

  const handleAdd = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/knowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent, category: newCategory }),
      });
      if (res.ok) {
        loadArticles();
      }
    } catch (err) {
      console.error("Failed to add article:", err);
    }
    setNewTitle(""); setNewContent(""); setNewCategory("general");
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/knowledge/${id}`, { method: "DELETE" });
      setArticles(articles.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to delete article:", err);
    }
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#F0F6FC", margin: 0 }}>Knowledge Base</h1>
          <p style={{ fontSize: 14, color: "#6B7280", margin: "4px 0 0" }}>
            Articles used for AI-powered responses (RAG)
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-secondary" onClick={handleSync} disabled={syncing}>
            <Database size={14} /> {syncing ? "Syncing…" : "Sync Vector DB"}
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={14} /> Add Article
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Articles", value: articles.length, icon: <BookOpen size={16} color="#6366F1" /> },
          { label: "Categories", value: new Set(articles.map(a => a.category)).size, icon: <BookOpen size={16} color="#06B6D4" /> },
          { label: "Vector DB", value: "Active", icon: <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px rgba(16,185,129,0.5)" }} /> },
        ].map((s, i) => (
          <div key={i} className="ds-card" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 4px" }}>{s.label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#F0F6FC", margin: 0 }}>{s.value}</p>
            </div>
            {s.icon}
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#6B7280" }} />
          <input
            className="glass-input"
            placeholder="Search articles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 32 }}
          />
        </div>
        <select className="glass-input" value={category} onChange={(e) => setCategory(e.target.value)}
          style={{ width: 180 }}>
          <option value="">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {/* Article Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {loading ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#6B7280" }}>
            Loading articles...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#6B7280" }}>
            No articles found
          </div>
        ) : (
          filtered.map((a) => (
            <ArticleCard key={a.id} article={a} onDelete={handleDelete} />
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 50,
        }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="ds-card ds-card-accent" style={{ width: 520, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#F0F6FC", margin: "0 0 20px" }}>
              Add Knowledge Article
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: "#8B949E", marginBottom: 6, display: "block" }}>Title</label>
                <input className="glass-input" placeholder="Article title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#8B949E", marginBottom: 6, display: "block" }}>
                  Content <span style={{ fontSize: 10, background: "rgba(99,102,241,0.15)", color: "#A5B4FC", padding: "1px 6px", borderRadius: 4, marginLeft: 4 }}>MD</span>
                </label>
                <textarea
                  className="glass-input"
                  placeholder="Article content (supports markdown)…"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={5}
                  style={{ resize: "vertical" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#8B949E", marginBottom: 6, display: "block" }}>Category</label>
                <select className="glass-input" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                  {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                <button className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleAdd}>Submit Article</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
