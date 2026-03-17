from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session
from typing import List, Optional
from pydantic import BaseModel
from app.database import get_session
from app.models import Ticket, TicketStatus, TicketPriority, TicketCategory
from app.services import ticket_service

router = APIRouter(prefix="/api/tickets", tags=["tickets"])


class TicketCreate(BaseModel):
    title: str
    description: str
    priority: TicketPriority = TicketPriority.medium
    category: TicketCategory = TicketCategory.general


class TicketUpdate(BaseModel):
    status: Optional[TicketStatus] = None


class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    status: TicketStatus
    priority: TicketPriority
    category: TicketCategory
    created_at: str
    resolved_at: Optional[str] = None

    class Config:
        from_attributes = True


@router.get("", response_model=List[TicketResponse])
def list_tickets(
    status: Optional[TicketStatus] = None,
    priority: Optional[TicketPriority] = None,
    category: Optional[TicketCategory] = None,
    limit: int = 100,
    offset: int = 0,
    session: Session = Depends(get_session),
):
    tickets = ticket_service.get_tickets(
        session,
        status=status,
        priority=priority,
        category=category,
        limit=limit,
        offset=offset,
    )

    return [
        TicketResponse(
            id=t.id,
            title=t.title,
            description=t.description,
            status=t.status,
            priority=t.priority,
            category=t.category,
            created_at=t.created_at.isoformat(),
            resolved_at=t.resolved_at.isoformat() if t.resolved_at else None,
        )
        for t in tickets
    ]


@router.get("/stats")
def get_stats(session: Session = Depends(get_session)):
    return ticket_service.get_ticket_stats(session)


@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id: int, session: Session = Depends(get_session)):
    ticket = ticket_service.get_ticket(session, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    return TicketResponse(
        id=ticket.id,
        title=ticket.title,
        description=ticket.description,
        status=ticket.status,
        priority=ticket.priority,
        category=ticket.category,
        created_at=ticket.created_at.isoformat(),
        resolved_at=ticket.resolved_at.isoformat() if ticket.resolved_at else None,
    )


@router.post("", response_model=TicketResponse)
def create_ticket(ticket_data: TicketCreate, session: Session = Depends(get_session)):
    ticket = ticket_service.create_ticket(
        session,
        title=ticket_data.title,
        description=ticket_data.description,
        priority=ticket_data.priority,
        category=ticket_data.category,
    )

    return TicketResponse(
        id=ticket.id,
        title=ticket.title,
        description=ticket.description,
        status=ticket.status,
        priority=ticket.priority,
        category=ticket.category,
        created_at=ticket.created_at.isoformat(),
        resolved_at=ticket.resolved_at.isoformat() if ticket.resolved_at else None,
    )


@router.patch("/{ticket_id}", response_model=TicketResponse)
def update_ticket(
    ticket_id: int, update_data: TicketUpdate, session: Session = Depends(get_session)
):
    if update_data.status is None:
        raise HTTPException(status_code=400, detail="No valid update data provided")

    ticket = ticket_service.update_ticket_status(session, ticket_id, update_data.status)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    return TicketResponse(
        id=ticket.id,
        title=ticket.title,
        description=ticket.description,
        status=ticket.status,
        priority=ticket.priority,
        category=ticket.category,
        created_at=ticket.created_at.isoformat(),
        resolved_at=ticket.resolved_at.isoformat() if ticket.resolved_at else None,
    )
