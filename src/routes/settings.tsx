import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Settings,
  Palette,
  Brain,
  Bell,
  Shield,
  Info,
  Monitor,
  Sun,
  Moon,
  Check,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — WorkMind AI" },
      { name: "description", content: "Customize your WorkMind AI experience." },
    ],
  }),
  component: SettingsPage,
});

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem("theme") as "light" | "dark" | "system") || "system";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}

function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [aiTone, setAiTone] = useState("balanced");
  const [autoSave, setAutoSave] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [emailTips, setEmailTips] = useState(true);
  const [researchAlerts, setResearchAlerts] = useState(false);
  const [dataCollection, setDataCollection] = useState(false);

  const clearHistory = () => {
    toast.success("Chat history cleared");
  };

  const tabItems = [
    { value: "appearance", label: "Appearance", icon: Palette },
    { value: "ai", label: "AI Preferences", icon: Brain },
    { value: "notifications", label: "Notifications", icon: Bell },
    { value: "privacy", label: "Privacy & Data", icon: Shield },
    { value: "about", label: "About", icon: Info },
  ] as const;

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
            <Settings className="h-5 w-5 text-brand-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">Settings</h1>
            <p className="text-xs text-muted-foreground">
              Customize your WorkMind AI experience
            </p>
          </div>
        </div>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 gap-1 sm:grid-cols-5">
            {tabItems.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <t.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Appearance */}
          <TabsContent value="appearance" className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-elegant">
              <h2 className="mb-4 text-sm font-semibold">Theme</h2>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: "light", label: "Light", icon: Sun },
                  { value: "dark", label: "Dark", icon: Moon },
                  { value: "system", label: "System", icon: Monitor },
                ] as const).map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                      theme === t.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <t.icon
                      className={`h-6 w-6 ${
                        theme === t.value ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-sm font-medium">{t.label}</span>
                    {theme === t.value && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* AI Preferences */}
          <TabsContent value="ai" className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-elegant">
              <h2 className="mb-4 text-sm font-semibold">Response Style</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-muted-foreground">
                    Default AI tone
                  </label>
                  <Select value={aiTone} onValueChange={setAiTone}>
                    <SelectTrigger className="w-full sm:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">Concise — brief, direct answers</SelectItem>
                      <SelectItem value="balanced">Balanced — moderate detail</SelectItem>
                      <SelectItem value="detailed">Detailed — thorough explanations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Auto-save chats</div>
                    <div className="text-xs text-muted-foreground">
                      Keep conversation history across sessions
                    </div>
                  </div>
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Sound effects</div>
                    <div className="text-xs text-muted-foreground">
                      Play sounds on message send and receive
                    </div>
                  </div>
                  <Switch checked={soundEffects} onCheckedChange={setSoundEffects} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-elegant">
              <h2 className="mb-4 text-sm font-semibold">Email Notifications</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Email tips</div>
                    <div className="text-xs text-muted-foreground">
                      Get suggestions for improving your email drafts
                    </div>
                  </div>
                  <Switch checked={emailTips} onCheckedChange={setEmailTips} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Research alerts</div>
                    <div className="text-xs text-muted-foreground">
                      Notify when research briefings are ready
                    </div>
                  </div>
                  <Switch checked={researchAlerts} onCheckedChange={setResearchAlerts} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Privacy & Data */}
          <TabsContent value="privacy" className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-elegant">
              <h2 className="mb-4 text-sm font-semibold">Data & Privacy</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Usage analytics</div>
                    <div className="text-xs text-muted-foreground">
                      Help improve WorkMind by sharing anonymous usage data
                    </div>
                  </div>
                  <Switch checked={dataCollection} onCheckedChange={setDataCollection} />
                </div>

                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-destructive">Danger Zone</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Clear all your local conversation history. This cannot be undone.
                      </p>
                      <button
                        onClick={clearHistory}
                        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Clear all history
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* About */}
          <TabsContent value="about" className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-elegant">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
                  <Settings className="h-6 w-6 text-brand-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">WorkMind AI</h2>
                  <p className="text-xs text-muted-foreground">
                    Workplace Productivity Assistant
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">AI Model</span>
                  <span className="font-medium">Gemini 3 Flash Preview</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Framework</span>
                  <span className="font-medium">TanStack Start + React 19</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Styling</span>
                  <span className="font-medium">Tailwind CSS v4</span>
                </div>
              </div>
              <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
                WorkMind AI is built to help professionals automate everyday workplace tasks
                responsibly. AI-generated content should always be reviewed before use.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
