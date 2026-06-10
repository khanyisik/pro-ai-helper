import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Brain, Loader2, Copy, Check } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Markdown } from "@/components/markdown";
import { researchTopic } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research Assistant — WorkMind AI" }] }),
  component: ResearchPage,
});

const depths = [
  { value: "quick", label: "Quick", desc: "~200 words" },
  { value: "standard", label: "Standard", desc: "~400 words" },
  { value: "deep", label: "Deep", desc: "~700 words" },
] as const;

function ResearchPage() {
  const research = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<"quick" | "standard" | "deep">("standard");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || loading) return;
    setLoading(true);
    setResult("");
    try {
      const res = await research({ data: { topic: topic.trim(), depth } });
      setResult(res.content);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Research failed");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
            <Brain className="h-5 w-5 text-brand-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">AI Research Assistant</h1>
            <p className="text-xs text-muted-foreground">
              Summaries, insights, and recommendations on any topic
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-elegant"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold">Topic or question</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={6}
                placeholder="e.g. The impact of async-first communication on hybrid engineering teams"
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Depth</label>
              <div className="grid grid-cols-3 gap-2">
                {depths.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDepth(d.value)}
                    className={`rounded-lg border p-2.5 text-left transition-all ${
                      depth === d.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="text-sm font-semibold">{d.label}</div>
                    <div className="text-[11px] text-muted-foreground">{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-elegant transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Researching…
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" /> Generate briefing
                </>
              )}
            </button>
          </form>

          {/* Output */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-elegant">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Briefing</h2>
              {result && (
                <button
                  onClick={copy}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs hover:bg-muted"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>

            {loading && (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${70 + Math.random() * 30}%` }} />
                ))}
              </div>
            )}
            {!loading && !result && (
              <div className="flex h-64 items-center justify-center text-center text-sm text-muted-foreground">
                Your AI-generated research briefing will appear here.
              </div>
            )}
            {!loading && result && <Markdown>{result}</Markdown>}
          </div>
        </div>

        <p className="mt-6 text-[11px] text-muted-foreground">
          ⚠ AI briefings can contain inaccuracies. Always cross-reference key facts before
          relying on them for important decisions.
        </p>
      </div>
    </AppShell>
  );
}
