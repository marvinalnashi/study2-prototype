import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, LayoutTemplate, Sparkles } from "lucide-react";
import type { ControlVariant, ScenarioDefinition } from "@/types/prototype";

export function PrototypeHeader({
  scenario,
  controlVariant,
  onVariantChange,
}: {
  scenario: ScenarioDefinition;
  controlVariant: ControlVariant;
  onVariantChange: (next: ControlVariant) => void;
}) {
  return (
    <div className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/65 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-200">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-50">Enterprise Assistant Prototype</h1>
              <Badge className="border-violet-400/20 bg-violet-500/10 text-violet-200">Study 2</Badge>
            </div>
            <p className="text-sm text-slate-400">{scenario.title} · {scenario.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5">
          <span className="px-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">A03 variant</span>
          <Button
            type="button"
            variant={controlVariant === "slider" ? "default" : "ghost"}
            size="sm"
            className="rounded-xl"
            onClick={() => onVariantChange("slider")}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Visible slider
          </Button>
          <Button
            type="button"
            variant={controlVariant === "profiles" ? "default" : "ghost"}
            size="sm"
            className="rounded-xl"
            onClick={() => onVariantChange("profiles")}
          >
            <LayoutTemplate className="mr-2 h-4 w-4" />
            Profiles
          </Button>
        </div>
      </div>
    </div>
  );
}
