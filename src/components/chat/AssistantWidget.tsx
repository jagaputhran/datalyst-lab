import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FALLBACK_ANSWER,
  GREETING,
  STARTER_QUESTIONS,
  faqEntries,
  type FaqEntry,
} from "@/data/assistantFaq";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  /** Follow-up chips rendered under a bot message. */
  followUps?: string[];
}

/** Score a message against an entry's keywords; simple but effective for FAQ. */
function matchEntry(input: string): FaqEntry | null {
  const text = input.toLowerCase();
  let best: { entry: FaqEntry; score: number } | null = null;
  for (const entry of faqEntries) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (text.includes(kw)) score += kw.length > 4 ? 2 : 1;
    }
    if (score > 0 && (!best || score > best.score)) best = { entry, score };
  }
  return best && best.score >= 2 ? best.entry : null;
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "bot", text: GREETING, followUps: STARTER_QUESTIONS },
  ]);
  const idRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q || typing) return;
    setInput("");
    setMessages((m) => [...m, { id: idRef.current++, role: "user", text: q }]);
    setTyping(true);

    // Small delay so the exchange feels conversational rather than instant.
    window.setTimeout(() => {
      const entry = matchEntry(q);
      const reply: Message = entry
        ? { id: idRef.current++, role: "bot", text: entry.answer, followUps: entry.followUps }
        : { id: idRef.current++, role: "bot", text: FALLBACK_ANSWER, followUps: STARTER_QUESTIONS };
      setMessages((m) => [...m, reply]);
      setTyping(false);
    }, 550 + Math.random() * 350);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-4 z-50 flex h-[480px] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl sm:right-6"
            role="dialog"
            aria-label="VirtualLab guide chatbot"
          >
            <div className="flex items-center gap-2.5 border-b border-border bg-muted/40 px-4 py-3">
              <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
                <Bot className="size-4" />
              </span>
              <div className="flex-1 leading-tight">
                <p className="text-sm font-semibold">VirtualLab guide</p>
                <p className="text-[11px] text-muted-foreground">Answers about this site — runs offline</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close chat">
                <X className="size-4" />
              </Button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => (
                <div key={m.id}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                      m.role === "user"
                        ? "ml-auto rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-muted text-foreground",
                    )}
                  >
                    {m.text}
                  </div>
                  {m.role === "bot" && m.followUps && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.followUps.map((f) => (
                        <button
                          key={f}
                          onClick={() => ask(f)}
                          className="rounded-full border border-border bg-card px-3 py-1 text-[11.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {typing && (
                <div className="flex w-14 items-center justify-center gap-1 rounded-xl rounded-bl-sm bg-muted px-3 py-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                      style={{ animationDelay: `${i * 140}ms` }}
                    />
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the course, labs, quizzes…"
                className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-[13px] outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
                aria-label="Your question"
              />
              <Button type="submit" size="icon" className="size-9 shrink-0" disabled={!input.trim() || typing} aria-label="Send">
                <Send className="size-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-4 z-50 grid size-13 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 sm:right-6"
        aria-label={open ? "Close VirtualLab guide" : "Open VirtualLab guide"}
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </motion.button>
    </>
  );
}
