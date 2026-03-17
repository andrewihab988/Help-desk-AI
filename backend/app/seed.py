from sqlmodel import Session
from app.database import engine, create_db_and_tables
from app.models import Ticket, TicketStatus, TicketPriority, TicketCategory
from datetime import datetime, timedelta
import random


def seed_tickets():
    create_db_and_tables()

    sample_tickets = [
        {
            "title": "Cannot login to my account",
            "description": "I've been trying to login for the past hour but keep getting 'Invalid credentials' error. I've already tried resetting my password.",
            "status": TicketStatus.open,
            "priority": TicketPriority.high,
            "category": TicketCategory.account,
        },
        {
            "title": "Billing discrepancy on invoice",
            "description": "My latest invoice shows a charge of $99 but I'm on the $49/month plan. Please review and correct.",
            "status": TicketStatus.in_progress,
            "priority": TicketPriority.medium,
            "category": TicketCategory.billing,
        },
        {
            "title": "Feature request: Dark mode",
            "description": "Would love to have a dark mode option for the dashboard. Many users would benefit from this.",
            "status": TicketStatus.open,
            "priority": TicketPriority.low,
            "category": TicketCategory.feature_request,
        },
        {
            "title": "API returning 500 errors",
            "description": "Our integration has been failing since this morning. Getting frequent 500 errors on API calls.",
            "status": TicketStatus.open,
            "priority": TicketPriority.urgent,
            "category": TicketCategory.technical,
        },
        {
            "title": "How to upgrade my plan?",
            "description": "I want to upgrade from free tier to Pro. Can you guide me through the process?",
            "status": TicketStatus.resolved,
            "priority": TicketPriority.low,
            "category": TicketCategory.billing,
        },
        {
            "title": "Export data not working",
            "description": "When I try to export my data, the button just spins and nothing happens. Need this urgently.",
            "status": TicketStatus.in_progress,
            "priority": TicketPriority.high,
            "category": TicketCategory.technical,
        },
        {
            "title": "Two-factor auth setup help",
            "description": "I lost my phone and need to set up 2FA on a new device. How can I recover my account?",
            "status": TicketStatus.closed,
            "priority": TicketPriority.urgent,
            "category": TicketCategory.account,
        },
        {
            "title": "Team member cannot see tickets",
            "description": "Added a new team member but they can't view any tickets. They have 'Member' role.",
            "status": TicketStatus.open,
            "priority": TicketPriority.medium,
            "category": TicketCategory.technical,
        },
    ]

    with Session(engine) as session:
        for ticket_data in sample_tickets:
            ticket = Ticket(**ticket_data)
            session.add(ticket)

        session.commit()
        print(f"Seeded {len(sample_tickets)} sample tickets")


if __name__ == "__main__":
    seed_tickets()
