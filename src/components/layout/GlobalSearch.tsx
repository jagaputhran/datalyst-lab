import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { lessons } from "@/data/lessons";
import { experiments } from "@/data/experiments";
import { quizQuestions } from "@/data/quizzes";
import { units } from "@/data/syllabus";

export function GlobalSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && ["INPUT", "TEXTAREA"].includes(target.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing && !target?.isContentEditable)) {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpenChange]);

  const go = (to: string) => {
    onOpenChange(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search concepts, lessons, experiments, quiz topics…" />
      <CommandList>
        <CommandEmpty>No results. Try “missing values”, “merge”, “histogram” or “NumPy”.</CommandEmpty>

        <CommandGroup heading="Lessons">
          {lessons.map((l) => (
            <CommandItem
              key={l.id}
              value={`${l.title} ${l.group} ${l.concept}`}
              onSelect={() => go(`/learn/${l.id}`)}
            >
              <span className="truncate">{l.title}</span>
              <span className="ml-auto text-xs text-muted-foreground">{l.group}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Experiments">
          {experiments.map((e) => (
            <CommandItem
              key={e.id}
              value={`${e.title} ${e.tags.join(" ")} ${e.objective}`}
              onSelect={() => go(`/experiments/${e.id}`)}
            >
              <span className="truncate">
                Exp {e.number}. {e.title}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">{e.tags[0]}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Quiz topics">
          {quizQuestions.map((q) => (
            <CommandItem key={q.id} value={`${q.topic} ${q.prompt}`} onSelect={() => go("/practice")}>
              <span className="truncate">{q.topic}</span>
              <span className="ml-auto text-xs text-muted-foreground">{q.unit.replace("-", " ")}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Units">
          {units.map((u) => (
            <CommandItem key={u.id} value={`${u.title} ${u.summary}`} onSelect={() => go("/syllabus")}>
              Unit {u.number}: {u.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
