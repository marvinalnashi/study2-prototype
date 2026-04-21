import { orderedScenarios } from "@/machines/studyPrototypeMachine";
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
    <aside className="flex h-full flex-col gap-4 border-r border-white/10 bg-slate-950/45 p-4 backdrop-blur-xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Walkthrough scenarios</p>
        <h2 className="mt-2 text-sm font-medium text-slate-200">Select the branch you want to simulate</h2>
      </div>

      <div className="flex flex-col gap-3">
        {orderedScenarios.map((scenario) => {
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
                {active ? <Badge className="border-violet-400/20 bg-violet-500/10 text-violet-200">Active</Badge> : null}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
