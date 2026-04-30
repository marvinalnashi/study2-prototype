import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { workArtefactOptions } from "@/lib/prototype-data";
import type { IntentFramingSelection } from "@/types/prototype";
import { ShieldCheck, SquarePen } from "lucide-react";

function labelFor(list: Array<{ id: string; label: string }>, id: string) {
  return list.find((item) => item.id === id)?.label ?? id;
}

export function PreflightTaskFraming({
  appliedSelection,
  draftSelection,
  isEditing,
  onOpenEditor,
  onCancel,
  onUpdateField,
  onApply,
}: {
  appliedSelection: IntentFramingSelection;
  draftSelection: IntentFramingSelection;
  isEditing: boolean;
  onOpenEditor: () => void;
  onCancel: () => void;
  onUpdateField: (field: keyof IntentFramingSelection, value: string) => void;
  onApply: () => void;
}) {
  const summary = useMemo(
    () => [
      { label: "Goal", value: labelFor(workArtefactOptions.intentFraming.goals, appliedSelection.goal) },
      { label: "Audience", value: labelFor(workArtefactOptions.intentFraming.audiences, appliedSelection.audience) },
      { label: "Limit", value: labelFor(workArtefactOptions.intentFraming.constraints, appliedSelection.constraints) },
      { label: "Sources", value: labelFor(workArtefactOptions.intentFraming.allowedSources, appliedSelection.allowedSources) },
      {
        label: "Output",
        value: labelFor(workArtefactOptions.intentFraming.requestedOutputs, appliedSelection.requestedOutput),
      },
    ],
    [appliedSelection],
  );

  if (!isEditing) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
            A06 · Request check
          </div>
          <div className="text-[11px] text-slate-400">Review the setup before the assistant answers.</div>
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {summary.map((item) => (
            <Card key={item.label} className="border-white/10 bg-slate-950/35">
              <CardContent className="p-3">
                <div className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{item.label}</div>
                <div className="mt-1 text-sm text-slate-100">{item.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-400/15 bg-emerald-500/8 px-3 py-2 text-xs text-emerald-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            The assistant will use this setup for the sensitive response.
          </div>
          <Button type="button" variant="outline" onClick={onOpenEditor}>
            <SquarePen className="mr-2 h-4 w-4" />
            Edit setup
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
          A06 · Edit request check
        </div>
        <div className="text-[11px] text-slate-400">Pick what the assistant should assume before answering.</div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <CanvasSelect
          label="Goal"
          value={draftSelection.goal}
          options={workArtefactOptions.intentFraming.goals}
          onChange={(value) => onUpdateField("goal", value)}
        />
        <CanvasSelect
          label="Audience"
          value={draftSelection.audience}
          options={workArtefactOptions.intentFraming.audiences}
          onChange={(value) => onUpdateField("audience", value)}
        />
        <CanvasSelect
          label="Limit"
          value={draftSelection.constraints}
          options={workArtefactOptions.intentFraming.constraints}
          onChange={(value) => onUpdateField("constraints", value)}
        />
        <CanvasSelect
          label="Sources"
          value={draftSelection.allowedSources}
          options={workArtefactOptions.intentFraming.allowedSources}
          onChange={(value) => onUpdateField("allowedSources", value)}
        />
        <CanvasSelect
          label="Output"
          value={draftSelection.requestedOutput}
          options={workArtefactOptions.intentFraming.requestedOutputs}
          onChange={(value) => onUpdateField("requestedOutput", value)}
        />
      </div>

      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onApply}>
          Use this setup
        </Button>
      </div>
    </div>
  );
}

function CanvasSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ id: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2 rounded-xl border border-white/10 bg-slate-950/35 p-3 text-sm text-slate-200">
      <span className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-xl border border-white/10 bg-slate-900/60 px-3 text-sm text-slate-100 outline-none focus:border-violet-400/40"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
