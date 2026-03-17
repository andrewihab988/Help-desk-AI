from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class TicketStatus(str, Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"


class TicketPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"


class TicketCategory(str, Enum):
    technical = "technical"
    billing = "billing"
    account = "account"
    general = "general"
    feature_request = "feature_request"


class Ticket(SQLModel, table=True):
    __tablename__ = "tickets"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    description: str
    status: TicketStatus = Field(default=TicketStatus.open)
    priority: TicketPriority = Field(default=TicketPriority.medium)
    category: TicketCategory = Field(default=TicketCategory.general)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class KnowledgeArticle(SQLModel, table=True):
    __tablename__ = "knowledge_articles"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str
    category: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
