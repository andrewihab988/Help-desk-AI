from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from app.models import Ticket, TicketStatus, TicketPriority, TicketCategory


def create_ticket(
    session: Session,
    title: str,
    description: str,
    priority: TicketPriority = TicketPriority.medium,
    category: TicketCategory = TicketCategory.general,
) -> Ticket:
    ticket = Ticket(
        title=title,
        description=description,
        priority=priority,
        category=category,
        status=TicketStatus.open,
    )
    session.add(ticket)
    session.commit()
    session.refresh(ticket)
    return ticket


def get_tickets(
    session: Session,
    status: Optional[TicketStatus] = None,
    priority: Optional[TicketPriority] = None,
    category: Optional[TicketCategory] = None,
    limit: int = 100,
    offset: int = 0,
) -> List[Ticket]:
    statement = select(Ticket).order_by(Ticket.created_at.desc())

    if status:
        statement = statement.where(Ticket.status == status)
    if priority:
        statement = statement.where(Ticket.priority == priority)
    if category:
        statement = statement.where(Ticket.category == category)

    statement = statement.limit(limit).offset(offset)

    return session.exec(statement).all()


def get_ticket(session: Session, ticket_id: int) -> Optional[Ticket]:
    return session.get(Ticket, ticket_id)


def update_ticket_status(
    session: Session, ticket_id: int, status: TicketStatus
) -> Optional[Ticket]:
    ticket = session.get(Ticket, ticket_id)
    if ticket:
        ticket.status = status
        ticket.updated_at = datetime.utcnow()
        if status == TicketStatus.resolved:
            ticket.resolved_at = datetime.utcnow()
        session.commit()
        session.refresh(ticket)
    return ticket


def get_ticket_stats(session: Session) -> dict:
    all_tickets = session.exec(select(Ticket)).all()

    stats = {
        "total": len(all_tickets),
        "open": len([t for t in all_tickets if t.status == TicketStatus.open]),
        "in_progress": len(
            [t for t in all_tickets if t.status == TicketStatus.in_progress]
        ),
        "resolved": len([t for t in all_tickets if t.status == TicketStatus.resolved]),
        "closed": len([t for t in all_tickets if t.status == TicketStatus.closed]),
        "by_priority": {
            "low": len([t for t in all_tickets if t.priority == TicketPriority.low]),
            "medium": len(
                [t for t in all_tickets if t.priority == TicketPriority.medium]
            ),
            "high": len([t for t in all_tickets if t.priority == TicketPriority.high]),
            "urgent": len(
                [t for t in all_tickets if t.priority == TicketPriority.urgent]
            ),
        },
    }

    return stats
