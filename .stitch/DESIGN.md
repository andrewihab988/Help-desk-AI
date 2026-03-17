# Design System: HelpDesk AI - Ticketing Chatbot
**Project ID:** 7505895826769386244

## 1. Visual Theme & Atmosphere
The interface exudes a **premium, enterprise dark aesthetic** — like a NASA mission control meets modern SaaS. The mood is "Dense Precision": every pixel serves a purpose, with a deep cosmic backdrop that makes vibrant accent colors pop dramatically. The feel is confident, data-rich, and purposefully technical without being cold. Glassmorphism is used sparingly on inputs for a subtle depth layer.

## 2. Color Palette & Roles
- **Deep Space (#0D1117)** — Primary background canvas; the darkest layer
- **Elevated Surface (#161B22)** — Card and panel backgrounds; lifted one step above the canvas
- **Borderline Gray (#21262D)** — Subtle borders and dividers between sections
- **Deep Violet-Indigo (#6366F1)** — Primary brand accent; used for active nav states, primary CTAs, and indigo chat bubbles
- **Vivid Cyan (#06B6D4)** — Secondary accent; used for secondary buttons, source citation chips, and KB sync actions
- **Emerald Green (#10B981)** — Success state; resolved tickets, online indicators, positive trends
- **Warm Amber (#F59E0B)** — Warning state; high-priority tickets, in-progress status badges
- **Danger Rose (#F43F5E)** — Error/urgent state; urgent priority badges, delete actions
- **Muted Gray (#6B7280)** — Low-priority labels, secondary text, disabled states

## 3. Typography Rules
- **Font Family:** Inter (Google Fonts) — clean, neutral, highly legible at all weights
- **Page Headers:** 28–32px, weight 700, white (#F0F6FC)
- **Section Headers:** 18–20px, weight 600, white (#F0F6FC)  
- **Body Text:** 14px, weight 400, muted white (#8B949E)
- **Mono Labels:** 12px, JetBrains Mono or system mono — used for ticket IDs, code snippets, timestamps
- **Badge Text:** 11–12px, weight 500, all-caps or title case in pill shapes

## 4. Component Stylings
- **Buttons (Primary):** Pill-adjacent (6px radius), Indigo (#6366F1) background, white text, subtle hover glow (`box-shadow: 0 0 12px rgba(99,102,241,0.4)`)
- **Buttons (Secondary):** Same radius, transparent background with Indigo border, Indigo text — hover fills lightly
- **Cards/Containers:** 8px border-radius, #161B22 background, 1px border `#21262D`, optional indigo top-accent (`border-top: 2px solid #6366F1`), very subtle box-shadow `0 4px 16px rgba(0,0,0,0.4)`
- **Chat Bubbles (User):** 20px radius, Indigo (#6366F1) background, right-aligned, white text
- **Chat Bubbles (AI):** 8px radius, #161B22 background, left-aligned, 2px left border accent in Indigo, source chips in Cyan
- **Inputs/Forms:** Glass style — `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(255,255,255,0.08)`, 6px radius, focus ring in Indigo
- **Status Badges:** Pill shape (full border-radius), semi-transparent colored backgrounds (e.g., `rgba(16,185,129,0.15)` with Emerald text for "Resolved")
- **Priority Badges:** Same pill style — Rose for Urgent, Amber for High, Cyan for Medium, Gray for Low
- **Sidebar Nav Items:** 6px radius, transparent default, Indigo highlight on active (`background: rgba(99,102,241,0.15)`, left border 3px Indigo), hover with slight lightening

## 5. Layout Principles
- **App Shell:** Fixed left sidebar (240px wide), full-height, Dark #0D1117 background. Main content area fills the remainder.
- **Content Padding:** 32px horizontal, 24px vertical padding inside main area
- **Card Grid:** 4-col KPI row uses `gap: 16px`. Content areas use 2:1 or 3-col grids.
- **Whitespace:** Generous padding inside cards (20–24px). Tables use 16px row padding.
- **Dividers:** 1px `#21262D` lines — never heavy. Prefer whitespace over hard rules.
- **Z-layers:** Sidebar at z-20, sticky headers z-10, modals z-50 with `backdrop-blur(8px)` dark overlay

## 6. Design System Notes for Stitch Generation
Use this block verbatim in all future Stitch prompts:

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first
- Background: Deep space (#0D1117), elevated surface (#161B22), border (#21262D)
- Accents: Violet-Indigo (#6366F1) primary CTA/active, Vivid Cyan (#06B6D4) secondary, Emerald (#10B981) success, Amber (#F59E0B) warning, Rose (#F43F5E) danger
- Typography: Inter font, 700/32px page headers, 600/18px sections, 400/14px body, mono for IDs/code
- Roundness: 8px cards, 6px buttons, 20px chat bubbles, full-pill for badges
- Elevation: Glass inputs (rgba white 0.04 bg + rgba white 0.08 border), inner glow on active states
- Sidebar: 240px fixed, #0D1117 bg, indigo left-border + bg-tint on active nav item
