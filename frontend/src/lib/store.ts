import { create } from "zustand";
import type { Ticket, TicketStats, ChatMessage } from "@/types";

interface AppState {
  tickets: Ticket[];
  stats: TicketStats | null;
  isLoading: boolean;
  setTickets: (tickets: Ticket[]) => void;
  setStats: (stats: TicketStats) => void;
  setLoading: (loading: boolean) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (id: number, updates: Partial<Ticket>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  tickets: [],
  stats: null,
  isLoading: false,
  setTickets: (tickets) => set({ tickets }),
  setStats: (stats) => set({ stats }),
  setLoading: (isLoading) => set({ isLoading }),
  addTicket: (ticket) => set((state) => ({ tickets: [ticket, ...state.tickets] })),
  updateTicket: (id, updates) =>
    set((state) => ({
      tickets: state.tickets.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
}));

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (content: string, sources?: any[]) => void;
  setTyping: (typing: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isTyping: false,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (content, sources) =>
    set((state) => ({
      messages: state.messages.map((m, i) =>
        i === state.messages.length - 1
          ? { ...m, content, sources: sources || m.sources }
          : m
      ),
    })),
  setTyping: (isTyping) => set({ isTyping }),
  clearMessages: () => set({ messages: [] }),
}));
