type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

const FALLBACK_FAQ: Array<{ q: string; a: string; tags?: string[] }> = [
  {
    q: "How do I add a booking?",
    a: "Go to Bookings → Add Booking. In the dialog, select a guest and room, set check-in/out, and submit.",
    tags: ["booking", "add", "create", "reservation"],
  },
  {
    q: "How do I add a room?",
    a: "Go to Rooms → Add Room. Provide a unique room number, type, price, and amenities, then save.",
    tags: ["room", "add", "create", "inventory"],
  },
  {
    q: "Keyboard shortcuts",
    a: "Press Cmd/Ctrl+K to open the command palette. Then type the page name or action (e.g., 'Rooms', 'Bookings').",
    tags: ["shortcut", "keyboard", "command", "palette"],
  },
  {
    q: "Troubleshooting",
    a: "If something looks wrong, try: 1) refresh, 2) clear cache, 3) sign out/in. For persistent issues, capture the error and share with support.",
    tags: ["troubleshoot", "error", "issue", "bug"],
  },
  {
    q: "How do I switch themes?",
    a: "Use the sun/moon icon in the header or open the command palette and select 'Switch theme'.",
    tags: ["theme", "dark", "light", "appearance"],
  },
];

function localAnswer(query: string): string {
  const q = query.toLowerCase().trim();
  let best: { score: number; a: string } | null = null;
  for (const item of FALLBACK_FAQ) {
    let score = 0;
    if (item.q.toLowerCase().includes(q)) score += 3;
    for (const tag of item.tags ?? []) {
      if (q.includes(tag)) score += 2;
    }
    // partial term match
    for (const token of q.split(/\s+/)) {
      if (token && (item.q.toLowerCase().includes(token) || (item.tags ?? []).some(t => t.includes(token)))) {
        score += 1;
      }
    }
    if (!best || score > best.score) best = { score, a: item.a };
  }
  return (best?.score ?? 0) > 0 ? (best!.a) : "I couldn’t find an exact match. Try rephrasing, or tell me what you’re trying to do.";
}

/**
 * Optionally forwards messages to a backend chat endpoint if VITE_CHAT_API_URL is set.
 * Expected shape: POST { messages: Message[] } -> { reply: string }
 */
export async function getAssistantReply(messages: Message[]): Promise<string> {
  const apiUrl = import.meta.env.VITE_CHAT_API_URL;
  const last = messages[messages.length - 1];
  if (!apiUrl) {
    return localAnswer(last?.content ?? "");
  }
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error(`Chat API ${res.status}`);
    const data = await res.json();
    return String(data.reply ?? localAnswer(last?.content ?? ""));
  } catch {
    return localAnswer(last?.content ?? "");
  }
}

export type { Message };