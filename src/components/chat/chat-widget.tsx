"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function renderContent(content: string) {
  return content.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm the ZEEVARA support assistant. I can help with tracking orders, claiming discount codes, returns, and shipping — what do you need?",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();

      if (!res.ok || !data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.error ?? "Something went wrong — please email support@zeevara.in.",
          },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong — please email support@zeevara.in.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed right-4 bottom-24 z-50 md:right-6 md:bottom-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="shadow-soft-lg bg-background absolute right-0 bottom-16 flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border sm:w-96"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2.5">
                <Avatar size="sm">
                  <AvatarFallback className="bg-foreground text-background">
                    <Bot className="size-3.5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">ZEEVARA Support</p>
                  <p className="text-muted-foreground text-xs">Usually replies in a few minutes</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-end gap-2",
                    m.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {m.role === "assistant" && (
                    <Avatar size="sm" className="mb-0.5 shrink-0">
                      <AvatarFallback className="bg-foreground text-background">
                        <Bot className="size-3.5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                      m.role === "user"
                        ? "bg-foreground text-background"
                        : "bg-muted text-foreground",
                    )}
                  >
                    {renderContent(m.content)}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-end justify-start gap-2">
                  <Avatar size="sm" className="mb-0.5 shrink-0">
                    <AvatarFallback className="bg-foreground text-background">
                      <Bot className="size-3.5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted text-muted-foreground rounded-xl px-3 py-2 text-sm">
                    Typing…
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 border-t p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your order…"
                className="border-input placeholder:text-muted-foreground h-9 flex-1 rounded-lg border bg-transparent px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <Button
                type="submit"
                size="icon"
                aria-label="Send message"
                disabled={loading || !input.trim()}
              >
                <Send className="size-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon-lg"
        aria-label={open ? "Close support chat" : "Open support chat"}
        onClick={() => setOpen((o) => !o)}
        className="size-10 rounded-full shadow-soft-lg md:size-12"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X className="size-5" /> : <Bot className="size-5" />}
          </motion.span>
        </AnimatePresence>
      </Button>
    </div>
  );
}
