from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import create_db_and_tables
from app.services.rag_service import seed_knowledge_base
from app.routers import chat, tickets, knowledge


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    seed_knowledge_base()
    yield


app = FastAPI(
    title="Helpdesk AI Chatbot API",
    description="AI-powered helpdesk chatbot with RAG",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(tickets.router)
app.include_router(knowledge.router)


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/")
def root():
    return {"message": "Welcome to Helpdesk AI Chatbot API"}
