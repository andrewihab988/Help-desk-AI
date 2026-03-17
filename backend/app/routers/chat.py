from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.services.rag_service import retrieve_context
from app.services.llm_service import generate_response_sync, generate_response

router = APIRouter(prefix="/api/chat", tags=["chat"])


class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    history: Optional[List[Dict[str, str]]] = None


class ChatResponse(BaseModel):
    response: str
    sources: List[Dict[str, Any]]


@router.post("", response_model=ChatResponse)
async def chat(message: ChatMessage):
    try:
        context_docs = retrieve_context(message.message, k=5)

        if not context_docs:
            response_text = "I don't have any relevant information in my knowledge base to answer your question. Would you like me to create a support ticket for you?"
            return ChatResponse(response=response_text, sources=[])

        response_text, sources = generate_response_sync(
            query=message.message, context_docs=context_docs, history=message.history
        )

        return ChatResponse(response=response_text, sources=sources)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stream")
async def chat_stream(message: ChatMessage):
    from fastapi.responses import StreamingResponse
    import json

    try:
        context_docs = retrieve_context(message.message, k=5)

        if not context_docs:

            async def generate():
                yield (
                    "data: "
                    + json.dumps(
                        {"type": "error", "content": "No relevant context found"}
                    )
                    + "\n\n"
                )

            return StreamingResponse(generate(), media_type="text/event-stream")

        async def generate():
            sources_sent = False
            for chunk in generate_response(
                query=message.message,
                context_docs=context_docs,
                history=message.history,
            ):
                yield (
                    "data: "
                    + json.dumps({"type": "content", "content": chunk})
                    + "\n\n"
                )

                if not sources_sent:
                    sources = [
                        {
                            "title": doc["metadata"].get("title", "Unknown"),
                            "category": doc["metadata"].get("category", "general"),
                        }
                        for doc in context_docs
                    ]
                    yield (
                        "data: "
                        + json.dumps({"type": "sources", "sources": sources})
                        + "\n\n"
                    )
                    sources_sent = True

            yield "data: " + json.dumps({"type": "done"}) + "\n\n"

        return StreamingResponse(generate(), media_type="text/event-stream")

    except Exception as e:

        async def generate():
            yield "data: " + json.dumps({"type": "error", "content": str(e)}) + "\n\n"

        return StreamingResponse(generate(), media_type="text/event-stream")
