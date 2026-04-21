import { promptOptions } from "@/lib/prototype-data";
import { Button } from "@/components/ui/button";
import type { ScenarioId } from "@/types/prototype";
import { SendHorizontal, RotateCcw, ChevronRight } from "lucide-react";

export function ChatComposer({
  scenarioId,
  selectedPromptId,
  onPromptChange,
  onSend,
  onReset,
}: {
  scenarioId: ScenarioId;
  selectedPromptId: string | null;
  onPromptChange: (promptId: string) => void;
  onSend: () => void;
  onReset: () => void;
}) {
  return (
    <div className="border-t border-white/10 bg-slate-950/65 px-6 py-4 backdrop-blur-xl">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.25)]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-slate-100">Hardcoded prompt selector</div>
            <p className="text-xs text-slate-400">
              The participant chooses from predefined prompts instead of free text.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            Scenario active: {scenarioId.toUpperCase()}
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <select
            value={selectedPromptId ?? ""}
            onChange={(event) => onPromptChange(event.target.value)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm text-slate-100 outline-none ring-0 transition focus:border-violet-400/40"
          >
            <option value="" disabled>
              Select a prompt to simulate a walkthrough branch
            </option>
            <optgroup label="Scenario 1 · Ambiguous request">
              {promptOptions
                .filter((item) => item.scenarioId === "s1")
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Scenario 2 · Sensitive request">
              {promptOptions
                .filter((item) => item.scenarioId === "s2")
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Scenario 3 · Evidence-heavy request">
              {promptOptions
                .filter((item) => item.scenarioId === "s3")
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Scenario 4 · Output generation">
              {promptOptions
                .filter((item) => item.scenarioId === "s4")
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
            </optgroup>
          </select>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <Button type="button" variant="outline" onClick={onReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset chat
            </Button>
            <Button type="button" variant="secondary">
              <ChevronRight className="mr-2 h-4 w-4" />
              Next step
            </Button>
            <Button type="button" onClick={onSend} disabled={!selectedPromptId}>
              <SendHorizontal className="mr-2 h-4 w-4" />
              Send prompt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
