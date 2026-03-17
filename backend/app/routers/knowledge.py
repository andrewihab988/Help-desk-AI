from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.services.rag_service import (
    retrieve_context,
    ingest_document,
    get_or_create_collection,
)

router = APIRouter(prefix="/api/knowledge", tags=["knowledge"])


class ArticleCreate(BaseModel):
    title: str
    content: str
    category: str


class ArticleResponse(BaseModel):
    id: str
    title: str
    content: str
    category: str


@router.get("", response_model=List[ArticleResponse])
def list_articles():
    collection = get_or_create_collection()
    results = collection.get()

    articles = []
    if results["ids"]:
        for i, doc_id in enumerate(results["ids"]):
            articles.append(
                ArticleResponse(
                    id=doc_id,
                    title=results["metadatas"][i].get("title", "Untitled"),
                    content=results["documents"][i]
                    if i < len(results["documents"])
                    else "",
                    category=results["metadatas"][i].get("category", "general"),
                )
            )

    return articles


@router.get("/search")
def search_knowledge(query: str, k: int = 5):
    results = retrieve_context(query, k=k)
    return results


@router.post("", response_model=ArticleResponse)
def create_article(article: ArticleCreate):
    doc_id = ingest_document(
        text=article.content,
        metadata={"title": article.title, "category": article.category},
    )

    return ArticleResponse(
        id=doc_id,
        title=article.title,
        content=article.content,
        category=article.category,
    )


@router.delete("/{article_id}")
def delete_article(article_id: str):
    collection = get_or_create_collection()
    collection.delete(ids=[article_id])
    return {"success": True}
