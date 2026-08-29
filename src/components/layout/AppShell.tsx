import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
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
} from "lucide-react";
import { COURSE } from "@/data/syllabus";
import { useTheme } from "@/lib/theme";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "./GlobalSearch";

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
        <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-sidebar-foreground">
            <ShieldCheck className="size-4 text-success" />
            100% in your browser
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Python runs locally with Pyodide. Your datasets and code never leave this device.
          </p>
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
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <FlaskConical className="size-[18px]" />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-bold tracking-tight">{COURSE.product}</span>
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
                <span className="font-semibold text-foreground">{stats.overall}%</span>
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
          <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
