"use client";

import React from "react";
import type { Ticket } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TicketListProps {
  tickets: Ticket[];
  onSelect?: (ticket: Ticket) => void;
}

export function TicketList({ tickets, onSelect }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tickets found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} onClick={() => onSelect?.(ticket)} />
      ))}
    </div>
  );
}

export function TicketCard({ ticket, onClick }: { ticket: Ticket; onClick?: () => void }) {
  const statusColors = {
    open: "bg-blue-500",
    in_progress: "bg-yellow-500",
    resolved: "bg-green-500",
    closed: "bg-gray-500",
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 border rounded-lg bg-card hover:bg-accent/50 cursor-pointer transition-colors",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">#{ticket.id}</span>
          </div>
          <h3 className="font-medium truncate">{ticket.title}</h3>
          <p className="text-sm text-muted-foreground truncate mt-1">
            {ticket.description}
          </p>
        </div>
        <div className={cn("w-2 h-2 rounded-full mt-2", statusColors[ticket.status])} />
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className={cn("text-xs px-2 py-1 rounded-full", priorityColors[ticket.priority])}>
          {ticket.priority}
        </span>
        <span className="text-xs text-muted-foreground capitalize">
          {ticket.category.replace("_", " ")}
        </span>
        <span className="text-xs text-muted-foreground ml-auto">
          {formatDistanceToNow(ticket.created_at)}
        </span>
      </div>
    </div>
  );
}
