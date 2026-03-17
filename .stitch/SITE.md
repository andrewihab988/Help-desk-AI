# HelpDesk AI - Site Vision & Roadmap

## 1. Project Vision
A professional AI-powered helpdesk and ticketing system. Users and support agents interact with a LLaMA 3.3-powered chatbot backed by a RAG knowledge base (ChromaDB). The interface is enterprise-grade dark SaaS, managed via a Next.js 14 frontend over a FastAPI backend.

**Stitch Project ID:** `7505895826769386244`

## 2. Design System
See `.stitch/DESIGN.md` for the full design system. Always include Section 6 in Stitch prompts.

## 3. Tech Stack
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** FastAPI (Python) + Groq LLM (LLaMA 3.3 70B) + ChromaDB (RAG) + SQLite
- **Stitch:** UI design loop for all pages

## 4. Sitemap (Completed Pages)
- [x] **Dashboard** (`/`) — KPI cards, recent tickets, quick actions, activity chart
- [x] **Chat** (`/chat`) — AI chat with RAG source citations, typing indicator, context sidebar
- [x] **Tickets** (`/tickets`) — Filterable table, create ticket modal, pagination
- [x] **Knowledge Base** (`/knowledge`) — Article grid, add/edit/delete, sync vector DB

## 5. Roadmap (Pending)
- [ ] **Settings** (`/settings`) — User profile, API key config, notification preferences
- [ ] **Ticket Detail** (`/tickets/[id]`) — Full ticket view with AI suggested resolution, activity log
- [ ] **Analytics** (`/analytics`) — Ticket volume charts, resolution time stats, AI usage metrics

## 6. Creative Freedom (New Ideas)
- A **Login/Onboarding** screen where new users enter their Groq API key and configure their knowledge base
- A **Mobile-responsive** version of the chat page
- A **Ticket Merge** modal for combining duplicate tickets via AI suggestion

## 7. Baton History
| Iteration | Page | Status |
|-----------|------|--------|
| 1 | Dashboard (`index`) | ✅ Done |
| 2 | Chat (`chat`) | ✅ Done |
| 3 | Tickets (`tickets`) | ✅ Done |
| 4 | Knowledge Base (`knowledge`) | ✅ Done |
