---
page: settings
---
A professional dark-themed Settings page for HelpDesk AI where users configure their account, API keys, and notification preferences.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first
- Background: Deep space (#0D1117), elevated surface (#161B22), border (#21262D)
- Accents: Violet-Indigo (#6366F1) primary CTA/active, Vivid Cyan (#06B6D4) secondary, Emerald (#10B981) success, Amber (#F59E0B) warning, Rose (#F43F5E) danger
- Typography: Inter font, 700/32px page headers, 600/18px sections, 400/14px body, mono for IDs/code
- Roundness: 8px cards, 6px buttons, 20px chat bubbles, full-pill for badges
- Elevation: Glass inputs (rgba white 0.04 bg + rgba white 0.08 border), inner glow on active states
- Sidebar: 240px fixed, #0D1117 bg, indigo left-border + bg-tint on active nav item

**Page Structure:**
1. Left Sidebar (same as all pages): Logo "HelpDesk AI", nav links (Dashboard, Tickets, Chat, Knowledge Base, Settings [active])
2. Page Header: "Settings", subtitle "Manage your account and integrations"
3. Settings Sections (vertical stacked cards):
   - Profile: Avatar, name "Alex Rivera", email, role badge "Support Admin", Save button
   - API Configuration: Groq API Key field (masked, with eye icon toggle), Model selector (LLaMA 3.3 70B), Test Connection button (cyan)
   - RAG Settings: Embedding model display, ChromaDB collection name, chunk size slider, "Re-index Knowledge Base" button
   - Notifications: Toggle switches for email alerts, Slack integration, Weekly digest
4. Danger Zone card (bottom, rose accent border): "Delete All Tickets" and "Reset Knowledge Base" buttons
