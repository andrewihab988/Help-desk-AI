from groq import Groq
from typing import List, Dict, Any, Generator
from app.config import get_settings

settings = get_settings()


def get_groq_client():
    return Groq(api_key=settings.groq_api_key)


def generate_response(
    query: str, context_docs: List[Dict[str, Any]], history: List[Dict[str, str]] = None
) -> Generator[str, None]:
    client = get_groq_client()

    context_text = "\n\n".join(
        [
            f"Source: {doc['metadata'].get('title', 'Unknown')}\n{doc['content']}"
            for doc in context_docs
        ]
    )

    history_text = ""
    if history:
        history_text = "\n".join(
            [f"{msg['role'].capitalize()}: {msg['content']}" for msg in history[-5:]]
        )

    system_prompt = f"""You are a helpful support assistant. Use the knowledge base below to answer user questions.

Context:
{context_text}

{"Conversation history:" if history_text else ""}
{history_text}

Answer the user's question based on the context provided. If you can't find the answer, say so."""

    messages = [{"role": "system", "content": system_prompt}]

    if history:
        for msg in history[-5:]:
            messages.append({"role": msg["role"], "content": msg["content"]})

    messages.append({"role": "user", "content": query})

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.7,
        max_tokens=1024,
        stream=True,
    )

    for chunk in response:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content


def generate_response_sync(
    query: str, context_docs: List[Dict[str, Any]], history: List[Dict[str, str]] = None
) -> tuple[str, List[Dict[str, Any]]]:
    client = get_groq_client()

    context_text = "\n\n".join(
        [
            f"Source: {doc['metadata'].get('title', 'Unknown')}\n{doc['content']}"
            for doc in context_docs
        ]
    )

    history_text = ""
    if history:
        history_text = "\n".join(
            [f"{msg['role'].capitalize()}: {msg['content']}" for msg in history[-5:]]
        )

    system_prompt = f"""You are a helpful support assistant. Use the knowledge base below to answer user questions.

Context:
{context_text}

{"Conversation history:" if history_text else ""}
{history_text}

Answer the user's question based on the context provided. If you can't find the answer, say so."""

    messages = [{"role": "system", "content": system_prompt}]

    if history:
        for msg in history[-5:]:
            messages.append({"role": msg["role"], "content": msg["content"]})

    messages.append({"role": "user", "content": query})

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.7,
        max_tokens=1024,
        stream=False,
    )

    full_response = response.choices[0].message.content

    sources = [
        {
            "title": doc["metadata"].get("title", "Unknown"),
            "category": doc["metadata"].get("category", "general"),
            "relevance": 1 - (doc.get("distance") or 0),
        }
        for doc in context_docs
    ]

    return full_response, sources
