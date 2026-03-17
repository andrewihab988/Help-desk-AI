# AI Helpdesk Chatbot

A professional full-stack AI-powered chatbot for a ticketing/helpdesk system. Users can chat with an AI assistant that retrieves context from the ticket knowledge base (RAG) to provide accurate, context-aware answers.

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  Next.js 14 Frontend                │
│   Chat UI | Tickets Dashboard | KB Management       │
└────────────────────┬────────────────────────────────┘
                     │ HTTP / REST
┌────────────────────▼────────────────────────────────┐
│               FastAPI Backend (Python)               │
│  /api/chat  |  /api/tickets  |  /api/knowledge      │
└──────┬─────────────────────────┬─────────────────────┘
       │                         │
┌──────▼──────┐         ┌────────▼────────┐
│  Groq API   │         │  ChromaDB       │
│  (Free LLM) │         │  (Vector Store) │
│  LLaMA 3.3  │         │  RAG Retrieval  │
└─────────────┘         └─────────────────┘
```

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| LLM | Groq API (LLaMA 3.3 70B) | Free tier, fastest inference |
| Vector DB | ChromaDB | Local, no infra needed |
| Embeddings | sentence-transformers | Free, runs locally |
| Backend | FastAPI + Python 3.11 | Fast, modern, type-safe |
| Frontend | Next.js 14 + TypeScript | App Router, RSC, modern |
| Styling | Tailwind CSS + shadcn/ui | Beautiful, accessible |
| State | Zustand | Lightweight state management |
| ORM | SQLite + SQLModel | Simple, no server required |

## Prerequisites

1. **Groq API Key**: Get a free API key from [console.groq.com](https://console.groq.com) (free tier: 14,400 requests/day)
2. **Python 3.11+**
3. **Node.js 18+**

## Setup

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env and add your GROQ_API_KEY

# Run the server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## Usage

1. Start the backend: `cd backend && uvicorn app.main:app --reload --port 8000`
2. Start the frontend: `cd frontend && npm run dev`
3. Open http://localhost:3000

### Features

- **Dashboard**: View ticket stats and recent tickets
- **AI Chat**: Ask questions and get AI-powered answers with RAG citations
- **Tickets**: Create, view, filter, and manage support tickets

### API Endpoints

- `GET /health` - Health check
- `POST /api/chat` - Send a chat message
- `POST /api/chat/stream` - Stream chat response
- `GET /api/tickets` - List tickets
- `POST /api/tickets` - Create ticket
- `PATCH /api/tickets/{id}` - Update ticket
- `GET /api/tickets/stats` - Get ticket statistics
- `GET /api/knowledge` - List knowledge base articles
- `POST /api/knowledge` - Add knowledge base article

## Environment Variables

### Backend (.env)

```
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=sqlite:///./helpdesk.db
CHROMA_PERSIST_DIR=./chroma_data
```

## License

MIT
