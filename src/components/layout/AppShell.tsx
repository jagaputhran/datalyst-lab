import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  BookMarked,
  GraduationCap,
  FlaskConical,
  Database,
  BarChart3,
  ListChecks,
  TrendingUp,
  Menu,
  Moon,
  Sun,
  Search,
  X,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { COURSE } from "@/data/syllabus";
import { useTheme } from "@/lib/theme";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "./GlobalSearch";
import { initPython, subscribeRuntime, type RuntimeStatus } from "@/services/pythonRunner";

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void) => number;
};

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/syllabus", label: "Course Syllabus", icon: BookMarked },
  { to: "/learn", label: "Learn", icon: GraduationCap },
  { to: "/experiments", label: "Virtual Experiments", icon: FlaskConical },
  { to: "/playground", label: "Data Playground", icon: Database },
  { to: "/studio", label: "Visualization Studio", icon: BarChart3 },
  { to: "/practice", label: "Practice & MCQs", icon: ListChecks },
  { to: "/progress", label: "Progress", icon: TrendingUp },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { stats } = useProgress();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [runtime, setRuntime] = useState<{ status: RuntimeStatus; message: string }>({
    status: "idle",
    message: "Python lab not started",
  });

  useEffect(() => subscribeRuntime((status, message) => setRuntime({ status, message })), []);

  // Warm up the Pyodide worker once the browser is idle, so it's usually ready
  // by the time a learner opens a lesson or experiment — without competing
  // with the initial page render for bandwidth/CPU.
  useEffect(() => {
    const win = window as IdleWindow;
    const idleId = win.requestIdleCallback
      ? win.requestIdleCallback(() => initPython())
      : window.setTimeout(() => initPython(), 1500);
    return () => {
      if (win.requestIdleCallback) return;
      window.clearTimeout(idleId as number);
    };
  }, []);

  const sidebar = (
    <nav className="flex h-full flex-col gap-1 p-3">
      {nav.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to as never}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary/12 text-sidebar-primary"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
            title={item.label}
          >
            <Icon className="size-[18px] shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}

      {!collapsed && (
        <div className="mt-auto rounded-lg border border-sidebar-border p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground">
            <ShieldCheck className="size-3.5 text-muted-foreground" />
            Runs entirely in your browser
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            Python executes locally via Pyodide — datasets and code never leave this device.
          </p>
          <div
            className={cn(
              "mt-2.5 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-medium",
              runtime.status === "ready" && "bg-success/10 text-success",
              runtime.status === "loading" && "bg-info/10 text-info",
              runtime.status === "error" && "bg-destructive/10 text-destructive",
              runtime.status === "idle" && "bg-muted text-muted-foreground",
            )}
          >
            {runtime.status === "loading" && <Loader2 className="size-3 shrink-0 animate-spin" />}
            <span className="truncate">
              {runtime.status === "idle" ? "Python lab warming up…" : runtime.message}
            </span>
          </div>
        </div>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="flex h-16 items-center gap-3 px-3 sm:px-5">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Collapse sidebar"
          >
            <Menu className="size-5" />
          </Button>

          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
              <FlaskConical className="size-4" />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-semibold tracking-tight">{COURSE.product}</span>
              <span className="hidden text-[11px] text-muted-foreground sm:block">
                {COURSE.code} · {COURSE.name}
              </span>
            </span>
          </Link>

          <button
            onClick={() => setSearchOpen(true)}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent/10 md:ml-6 md:w-full md:max-w-sm md:justify-start md:gap-2 md:px-3"
          >
            <Search className="size-4" />
            <span className="hidden text-sm md:inline">Search lessons, experiments, topics…</span>
            <kbd className="ml-auto hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] md:inline">
              /
            </kbd>
          </button>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            <div className="w-40">
              <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                <span>Course progress</span>
                <span className="tnum font-semibold text-foreground">{stats.overall}%</span>
              </div>
              <Progress value={stats.overall} className="h-1.5" />
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
        </div>
      </header>

      <div className="flex">
        <aside
          className={cn(
            "sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] lg:block",
            collapsed ? "w-[68px]" : "w-64",
          )}
        >
          {sidebar}
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 top-16 z-30 lg:hidden">
            <div className="absolute inset-0 bg-foreground/30" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 border-r border-sidebar-border bg-sidebar">
              {sidebar}
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8"
          >
            {children}
          </motion.div>
        </main>
      </div>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
