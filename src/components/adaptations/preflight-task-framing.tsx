"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type PreflightVariant = "short_card" | "intent_canvas";

type FormState = {
  goal: string;
  audience: string;
  constraints: string;
  sources: string;
  output: string;
};

function defaultsFromPrompt(promptLabel: string | null, promptText: string | null): FormState {
  if (!promptLabel && !promptText) {
    return {
      goal: "Clarify the request before answering.",
      audience: "Internal requester",
      constraints: "Check sensitivity, approval needs, and sharing boundaries.",
      sources: "Use policy-approved internal sources only.",
      output: "Safe summary with scope confirmed first.",
    };
  }

  if (promptLabel?.includes("salary") || promptText?.toLowerCase().includes("salary")) {
    return {
      goal: "Provide a safe summary of role-based salary differences.",
      audience: "Manager requesting HR-related information",
      constraints: "Use aggregated patterns only. Do not expose identifiable salary data. Review against HR policy.",
      sources: "Approved HR policy summaries and aggregated internal compensation guidance.",
      output: "Policy-aligned summary draft with a clear review step.",
    };
  }

  return {
    goal: "Summarise the policy conditions for external sharing.",
    audience: "Internal employee preparing vendor-facing communication",
    constraints: "Confirm document class, approval path, redaction requirements, and transfer conditions.",
    sources: "Relevant internal policy pages and sharing rules.",
    output: "Concise policy summary after context confirmation.",
  };
}

export function PreflightTaskFraming({
  variant,
  onVariantChange,
  promptLabel,
  promptText,
}: {
  variant: PreflightVariant;
  onVariantChange: (variant: PreflightVariant) => void;
  promptLabel: string | null;
  promptText: string | null;
}) {
  const defaults = useMemo(() => defaultsFromPrompt(promptLabel, promptText), [promptLabel, promptText]);
  const [form, setForm] = useState<FormState>(defaults);

  useEffect(() => {
    setForm(defaults);
  }, [defaults]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
            A06 · Preflight task framing
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Confirm sensitive request intent before the assistant proceeds.
          </div>
        </div>

        <div className="inline-flex rounded-full border border-white/10 bg-slate-950/50 p-1 text-xs">
          <button
            type="button"
            onClick={() => onVariantChange("short_card")}
            className={cn(
              "rounded-full px-3 py-1.5 transition",
              variant === "short_card" ? "bg-violet-500/90 text-white" : "text-slate-300 hover:bg-white/8",
            )}
          >
            Short card
          </button>
          <button
            type="button"
            onClick={() => onVariantChange("intent_canvas")}
            className={cn(
              "rounded-full px-3 py-1.5 transition",
              variant === "intent_canvas" ? "bg-violet-500/90 text-white" : "text-slate-300 hover:bg-white/8",
            )}
          >
            Intent canvas
          </button>
        </div>
      </div>

      {promptLabel ? (
        <div className="mb-3 rounded-lg border border-white/10 bg-slate-950/35 px-3 py-2 text-[11px] text-slate-400">
          Current branch: <span className="text-slate-200">{promptLabel}</span>
        </div>
      ) : null}

      {variant === "short_card" ? (
        <div className="rounded-xl border border-violet-400/15 bg-violet-500/6 p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-sm font-medium text-slate-100">Short confirmation card</div>
            <div className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-[11px] text-violet-200">
              Compact variant
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <SummaryItem label="Goal" value={form.goal} />
            <SummaryItem label="Audience" value={form.audience} />
            <SummaryItem label="Constraints" value={form.constraints} />
            <SummaryItem label="Output" value={form.output} />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200 transition hover:bg-emerald-500/15"
            >
              Confirm framing
            </button>
            <button
              type="button"
              onClick={() => onVariantChange("intent_canvas")}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
            >
              Expand to editable canvas
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-slate-100">Full editable intent canvas</div>
              <div className="mt-1 text-[11px] text-slate-400">
                Prototype variant for richer confirmation before a sensitive answer is generated.
              </div>
            </div>
            <div className="rounded-full border border-sky-400/20 bg-sky-500/10 px-2.5 py-1 text-[11px] text-sky-200">
              Editable variant
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field
              label="Goal"
              value={form.goal}
              onChange={(value) => setForm((current) => ({ ...current, goal: value }))}
            />
            <Field
              label="Audience"
              value={form.audience}
              onChange={(value) => setForm((current) => ({ ...current, audience: value }))}
            />
            <Field
              label="Constraints"
              value={form.constraints}
              onChange={(value) => setForm((current) => ({ ...current, constraints: value }))}
              textarea
            />
            <Field
              label="Allowed sources"
              value={form.sources}
              onChange={(value) => setForm((current) => ({ ...current, sources: value }))}
              textarea
            />
            <div className="md:col-span-2">
              <Field
                label="Requested output"
                value={form.output}
                onChange={(value) => setForm((current) => ({ ...current, output: value }))}
              />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200 transition hover:bg-emerald-500/15"
            >
              Use this framing
            </button>
            <button
              type="button"
              onClick={() => setForm(defaults)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
            >
              Reset fields
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-2.5">
      <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="mt-1 text-sm text-slate-100">{value}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[11px] uppercase tracking-[0.16em] text-slate-400">{label}</div>
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-violet-400/40"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-violet-400/40"
        />
      )}
    </label>
  );
}
