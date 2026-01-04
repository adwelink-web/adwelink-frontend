import { Database } from './database.types';

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type ChatHistory = Database["public"]["Tables"]["ai_chat_history"]["Row"];

// The Composite Type (Lead + Brain)
export type SmartLead = Lead & {
    brain_scan?: {
        sentiment: string | null;  // e.g., "positive", "angry"
        intent: string | null;     // e.g., "fees", "admission"
        last_message_at: string | null;
        confidence: number | null;
    }
};

export type Agent = Database["public"]["Tables"]["agents"]["Row"];
