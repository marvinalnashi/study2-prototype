import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";
import type { ScenarioDefinition } from "@/types/prototype";

export function PrototypeHeader({ scenario }: { scenario: ScenarioDefinition }) {
  return (
    <div className="border-b border-white/10 bg-slate-950/65 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-200">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-50">Enterprise Assistant Prototype</h1>
              <Badge className="border-violet-400/20 bg-violet-500/10 text-violet-200">Study 2</Badge>
            </div>
            <p className="text-sm text-slate-400">{scenario.subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
