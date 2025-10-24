import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message, getAssistantReply } from "@/lib/assist";
import { Bot, HelpCircle, Loader2, Send, X } from "lucide-react";

type ChatMessage = Message & { id: string; ts: number };

function useChatStorage(key = "hotelhb.chat.thread") {
  const load = (): ChatMessage[] => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  };
  const save = (msgs: ChatMessage[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(msgs.slice(-100)));
    } catch {
      // ignore
    }
  };
  return { load, save };
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const { load, save } = useChatStorage();
  const [messages, setMessages] = useState<ChatMessage[]>(() => load());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => save(messages), [messages, save]);

  // Auto-open helper event
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-help", onOpen);
    return () => window.removeEventListener("open-help", onOpen);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight });
  }, [messages, open, loading]);

  const quickPrompts = useMemo(
    () => [
      "How do I add a booking?",
      "How do I add a room?",
      "Keyboard shortcuts",
      "Troubleshooting",
      "Switch theme",
    ],
    []
  );

  const send = async (content: string) => {
    if (!content.trim()) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: content.trim(), ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const reply = await getAssistantReply(
        [...messages, userMsg].map(({ role, content }) => ({ role, content }))
      );
      const botMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: reply, ts: Date.now() };
      setMessages((m) => [...m, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 group rounded-2xl px-4 py-3 shadow-xl bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-2xl hover:scale-[1.03] transition-all"
          aria-label="Open help chat"
        >
          <span className="inline-flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Help
          </span>
          <span className="ml-2 hidden sm:inline text-xs opacity-80">Chat</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-[92vw] sm:w-[380px]">
          <Card className="rounded-2xl border shadow-2xl overflow-hidden card-modern gradient-border">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-accent text-white grid place-items-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight">HotelHub Assistant</div>
                  <div className="text-xs text-muted-foreground">Ask me how to do things</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)} aria-label="Close chat">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div ref={viewportRef} className="max-h-[50vh] sm:max-h-[420px] overflow-y-auto p-3 space-y-3">
              {messages.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  Hi! I can help you navigate and get things done faster.
                  Try a quick prompt below, or type your question.
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                </div>
              )}
            </div>

            {/* Quick prompts */}
            <div className="flex flex-wrap gap-2 px-3 pb-2">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="rounded-xl border px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/40 transition"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t">
              <Input
                placeholder="Type your question…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
              />
              <Button size="icon" onClick={() => send(input)} disabled={loading} aria-label="Send message">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

// Helper to programmatically open chat
export function openHelp() {
  window.dispatchEvent(new Event("open-help"));
}