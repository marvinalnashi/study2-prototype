import { scenarios } from "@/lib/prototype-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ScenarioId } from "@/types/prototype";

export function ScenarioSidebar({
  currentScenarioId,
  onSelectScenario,
}: {
  currentScenarioId: ScenarioId;
  onSelectScenario: (scenarioId: ScenarioId) => void;
}) {
  return (
    <aside className="hidden h-full border-r border-white/10 bg-slate-950/60 xl:flex xl:w-[272px] xl:flex-col xl:p-4">
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Scenarios</div>
        <p className="mt-2 text-sm text-slate-200">Choose the part of the prototype you want to test.</p>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-1">
        {scenarios.map((scenario) => {
          const active = scenario.id === currentScenarioId;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => onSelectScenario(scenario.id)}
              className={cn(
                "rounded-2xl border p-4 text-left transition-all duration-200",
                active
                  ? "border-violet-400/40 bg-violet-500/12 shadow-[0_10px_30px_rgba(124,58,237,0.18)]"
                  : "border-white/10 bg-white/5 hover:bg-white/8",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-100">{scenario.title}</div>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{scenario.goal}</p>
                </div>
                {active ? (
                  <Badge className="border-violet-400/20 bg-violet-500/10 text-violet-200">Open</Badge>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
