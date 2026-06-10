import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, MessageSquare, Mail, Sparkles, ArrowRight, Zap, Shield, Clock } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — WorkMind AI" },
      { name: "description", content: "Your AI workplace productivity dashboard." },
    ],
  }),
  component: Dashboard,
});

const features = [
  {
    to: "/chat",
    icon: MessageSquare,
    title: "AI Chatbot",
    desc: "Conversational assistant for brainstorming, planning, and quick answers.",
    accent: "from-violet-500/20 to-blue-500/10",
  },
  {
    to: "/research",
    icon: Brain,
    title: "Research Assistant",
    desc: "Summarize topics, surface insights, and get actionable recommendations.",
    accent: "from-cyan-500/20 to-teal-500/10",
  },
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Draft professional emails in seconds — choose a tone that fits the moment.",
    accent: "from-fuchsia-500/20 to-rose-500/10",
  },
] as const;

const stats = [
  { icon: Zap, label: "Faster drafts", value: "10×" },
  { icon: Clock, label: "Time saved / day", value: "~2 hrs" },
  { icon: Shield, label: "Privacy-aware", value: "100%" },
];

function Dashboard() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-elegant sm:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Powered by Lovable AI
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
              Your AI <span className="text-gradient-brand">workplace co-pilot</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Automate the busywork. Chat, research, and draft emails with a single, thoughtfully
              designed assistant built for professionals.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-elegant transition-transform hover:scale-[1.02]"
              >
                Start chatting <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/email"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Draft an email
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
              <s.icon className="h-4 w-4 text-primary" />
              <div className="mt-2 text-xl font-bold sm:text-2xl">{s.value}</div>
              <div className="text-[11px] text-muted-foreground sm:text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <h2 className="mt-10 mb-4 text-lg font-bold">Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${f.accent} opacity-0 transition-opacity group-hover:opacity-100`} />
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
                  <f.icon className="h-5 w-5 text-brand-foreground" />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  Open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-10 rounded-xl border border-border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Responsible AI notice:</strong> WorkMind AI generates
          content using large language models. Output may contain inaccuracies or biased reasoning.
          Always review AI responses before sending, sharing, or acting on them. Don't paste
          confidential or personal data you wouldn't share with a third-party service.
        </p>
      </div>
    </AppShell>
  );
}
