import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { variantConditions } from "@/lib/prototype-data";
import type { ScenarioDefinition, ScenarioId } from "@/types/prototype";

export function AdaptationRail({
  scenario,
  scenarioId,
}: {
  scenario: ScenarioDefinition;
  scenarioId: ScenarioId;
}) {
  const condition = variantConditions.find((entry) => entry.scenarioId === scenarioId);

  return (
    <aside className="hidden h-full border-l border-white/10 bg-slate-950/45 p-4 xl:flex xl:w-[308px] xl:flex-col xl:gap-4 xl:overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle>What to look at</CardTitle>
          <CardDescription>{condition?.primaryTest ?? "No main focus assigned yet."}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <p>{scenario.goal}</p>
          {condition?.secondaryTest ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
              {condition.secondaryTest}
            </div>
          ) : null}

          {scenario.walkthroughSteps?.length ? (
            <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Steps</div>
              <ol className="mt-2 space-y-2 pl-4 text-sm text-slate-300">
                {scenario.walkthroughSteps.map((step) => (
                  <li key={step} className="list-decimal">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        {scenario.placeholderCards.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle>{item.label}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
                <Badge
                  className={
                    item.status === "implemented"
                      ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                      : "border-amber-400/20 bg-amber-500/10 text-amber-200"
                  }
                >
                  {item.status === "implemented" ? "Ready" : "Later"}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </aside>
  );
}
