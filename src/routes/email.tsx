import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Mail, Loader2, Copy, Check, Briefcase, Smile, Sparkles, AlertCircle, Minimize2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { generateEmail } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Email Generator — WorkMind AI" }] }),
  component: EmailPage,
});

const tones = [
  { value: "formal", label: "Formal", icon: Briefcase, desc: "Polished & corporate" },
  { value: "friendly", label: "Friendly", icon: Smile, desc: "Warm & approachable" },
  { value: "persuasive", label: "Persuasive", icon: Sparkles, desc: "Confident & compelling" },
  { value: "apologetic", label: "Apologetic", icon: AlertCircle, desc: "Sincere & accountable" },
  { value: "concise", label: "Concise", icon: Minimize2, desc: "Brief & direct" },
] as const;

type Tone = (typeof tones)[number]["value"];

function EmailPage() {
  const gen = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim() || loading) return;
    setLoading(true);
    setResult("");
    try {
      const res = await gen({ data: { purpose: purpose.trim(), recipient, tone, length } });
      setResult(res.content);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
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
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
            <Mail className="h-5 w-5 text-brand-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">Smart Email Generator</h1>
            <p className="text-xs text-muted-foreground">
              Draft professional emails with the perfect tone, in seconds
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-elegant"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold">Recipient (optional)</label>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. My team lead Priya"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">What's this email about?</label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={5}
                placeholder="e.g. Request a 1-week extension on the Q3 report due to additional data validation needed."
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Tone</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {tones.map((t) => {
                  const Icon = t.icon;
                  const active = tone === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTone(t.value)}
                      className={`flex flex-col items-start gap-1 rounded-lg border p-2.5 text-left transition-all ${
                        active ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="text-sm font-semibold">{t.label}</div>
                      <div className="text-[10px] text-muted-foreground">{t.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Length</label>
              <div className="grid grid-cols-3 gap-2">
                {(["short", "medium", "long"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLength(l)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-all ${
                      length === l ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !purpose.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-elegant transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Drafting…</>
              ) : (
                <><Mail className="h-4 w-4" /> Generate email</>
              )}
            </button>
          </form>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-elegant">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Draft</h2>
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
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${60 + Math.random() * 40}%` }} />
                ))}
              </div>
            )}
            {!loading && !result && (
              <div className="flex h-72 items-center justify-center text-center text-sm text-muted-foreground">
                Your AI-generated email draft will appear here.
              </div>
            )}
            {!loading && result && (
              <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground">
                {result}
              </pre>
            )}
          </div>
        </div>

        <p className="mt-6 text-[11px] text-muted-foreground">
          ⚠ Always review AI-generated emails for tone, accuracy, and confidential details before
          sending. Replace [Your Name] and verify recipient information.
        </p>
      </div>
    </AppShell>
  );
}
