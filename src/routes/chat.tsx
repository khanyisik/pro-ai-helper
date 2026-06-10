import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, User, Square } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Markdown } from "@/components/markdown";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [{ title: "AI Chatbot — WorkMind AI" }],
  }),
  component: ChatPage,
});

const suggestions = [
  "Summarize the key points of agile retrospectives",
  "Help me prepare for a difficult 1:1 with my manager",
  "Draft a project status update for stakeholders",
  "Brainstorm 5 ways to improve team focus time",
];

function ChatPage() {
  const [input, setInput] = useState("");
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;
  const { messages, sendMessage, status, stop } = useChat({
    transport,
    onError: (e) => toast.error(e.message || "Something went wrong"),
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const loading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [status]);

  const submit = async (text: string) => {
    const t = text.trim();
    if (!t || loading) return;
    setInput("");
    await sendMessage({ text: t });
  };

  return (
    <AppShell>
      <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-4xl flex-col px-4 py-4 sm:h-screen sm:px-8 sm:py-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
            <Sparkles className="h-5 w-5 text-brand-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">AI Chatbot</h1>
            <p className="text-xs text-muted-foreground">Your interactive workplace assistant</p>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-4 sm:p-6"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow">
                <Sparkles className="h-7 w-7 text-brand-foreground" />
              </div>
              <h2 className="text-lg font-semibold">How can I help you today?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask anything about your workday — I'll keep it concise and actionable.
              </p>
              <div className="mt-6 grid w-full max-w-xl gap-2 sm:grid-cols-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="rounded-xl border border-border bg-background p-3 text-left text-sm text-foreground transition-all hover:border-primary hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m) => {
                const text = m.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("");
                const isUser = m.role === "user";
                return (
                  <div key={m.id} className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isUser ? "bg-muted" : "bg-gradient-brand shadow-glow"
                      }`}
                    >
                      {isUser ? (
                        <User className="h-4 w-4 text-foreground" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-brand-foreground" />
                      )}
                    </div>
                    <div
                      className={`min-w-0 max-w-[85%] ${
                        isUser
                          ? "rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-primary-foreground"
                          : ""
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap text-sm">{text}</p>
                      ) : (
                        <Markdown>{text || "_Thinking…_"}</Markdown>
                      )}
                    </div>
                  </div>
                );
              })}
              {status === "submitted" && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-brand shadow-glow">
                    <Sparkles className="h-4 w-4 text-brand-foreground" />
                  </div>
                  <div className="flex items-center gap-1 pt-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" style={{ animationDelay: "0.15s" }} />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="mt-3 flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-elegant"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(input);
              }
            }}
            rows={1}
            placeholder="Ask anything about your work…"
            className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          {loading ? (
            <button
              type="button"
              onClick={stop}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive text-destructive-foreground transition-colors"
              aria-label="Stop"
            >
              <Square className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground shadow-elegant transition-opacity disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
        </form>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          AI may produce inaccurate information. Verify important details.
        </p>
      </div>
    </AppShell>
  );
}
