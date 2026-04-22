import { promptOptions } from "@/lib/prototype-data";
import { Button } from "@/components/ui/button";
import type { ScenarioId } from "@/types/prototype";
import { ChevronRight, RotateCcw, SendHorizontal } from "lucide-react";

export function ChatComposer({
  scenarioId,
  selectedPromptId,
  completedPromptIds,
  onPromptChange,
  onSend,
  onNextStep,
  onReset,
}: {
  scenarioId: ScenarioId;
  selectedPromptId: string | null;
  completedPromptIds: string[];
  onPromptChange: (promptId: string) => void;
  onSend: () => void;
  onNextStep: () => void;
  onReset: () => void;
}) {
  const scenarioPrompts = promptOptions.filter((item) => item.scenarioId === scenarioId);
  const nextPrompt =
    scenarioPrompts.find((item) => !completedPromptIds.includes(item.id)) ?? null;

  const nextStepDisabled = !nextPrompt || nextPrompt.id === selectedPromptId;
  const nextStepLabel = !nextPrompt
    ? "All steps done"
    : nextPrompt.id === selectedPromptId
      ? "Current step selected"
      : "Next step";

  return (
    <div className="border-t border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-xl sm:px-5">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-[0_12px_40px_rgba(15,23,42,0.25)]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-slate-100">Choose a walkthrough prompt</div>
            <p className="text-xs text-slate-400">
              Only prompts for the current scenario are shown.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            Active scenario: {scenarioId.toUpperCase()}
          </div>
        </div>

        <div className="mb-3 rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-2 text-xs text-slate-300">
          {nextPrompt
            ? `Suggested next step: ${nextPrompt.label}`
            : "You have completed the available prompt steps for this scenario."}
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <select
            value={selectedPromptId ?? ""}
            onChange={(event) => onPromptChange(event.target.value)}
            className="h-11 w-full min-w-0 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm text-slate-100 outline-none ring-0 transition focus:border-violet-400/40"
          >
            <option value="" disabled>
              Select one of the walkthrough prompts for this scenario
            </option>
            {scenarioPrompts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <Button type="button" variant="outline" onClick={onReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset chat
            </Button>
            <Button type="button" variant="secondary" onClick={onNextStep} disabled={nextStepDisabled}>
              <ChevronRight className="mr-2 h-4 w-4" />
              {nextStepLabel}
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
