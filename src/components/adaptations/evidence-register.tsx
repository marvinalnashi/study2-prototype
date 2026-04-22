"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { EvidenceRegisterVariant } from "@/types/prototype";
import { BookMarked, Clock3, Files, Lock, X } from "lucide-react";

type EvidenceEntry = {
  source: string;
  note: string;
  tag: string;
};

type EvidenceLedger = {
  title: string;
  summary: string;
  confidence: string;
  freshness: string;
  used: EvidenceEntry[];
  omitted: EvidenceEntry[];
  inaccessible: EvidenceEntry[];
};

const evidenceByPrompt: Record<string, EvidenceLedger> = {
  "p-s3-1": {
    title: "Evidence for the current accessibility obligation",
    summary:
      "This answer depends on recent policy language, current legal framing, and whether the organisation falls inside the relevant obligation scope.",
    confidence: "Medium (72%)",
    freshness: "2 sources current · 1 source older than 12 months",
    used: [
      {
        source: "Internal accessibility policy v3.2",
        note: "Used to confirm how the organisation currently interprets the obligation for internal teams.",
        tag: "Updated Mar 2026",
      },
      {
        source: "Public regulation summary",
        note: "Used to anchor the requirement to the latest externally visible obligation wording.",
        tag: "Updated Jan 2026",
      },
      {
        source: "Implementation checklist",
        note: "Used to connect the obligation to concrete reporting and remediation steps.",
        tag: "Operational source",
      },
    ],
    omitted: [
      {
        source: "Legacy procurement checklist",
        note: "Considered but left out because it predates the current obligation scope and uses older terminology.",
        tag: "Outdated",
      },
      {
        source: "Industry blog commentary",
        note: "Considered but omitted because it interpreted the rule more broadly than the source policy supports.",
        tag: "Low authority",
      },
    ],
    inaccessible: [
      {
        source: "Legal counsel memo",
        note: "Not accessible in this prototype path because it is permission-restricted and not available to the current user role.",
        tag: "Restricted",
      },
    ],
  },
  "p-s3-2": {
    title: "Evidence used for the policy comparison",
    summary:
      "The comparison is strongest when the assistant shows which text fragments support each reported difference and which apparent differences were discarded.",
    confidence: "High (81%)",
    freshness: "Version mismatch detected · one compared source is older",
    used: [
      {
        source: "Policy summary A · version 2026.1",
        note: "Used for the current wording on approval steps and external-sharing conditions.",
        tag: "Current version",
      },
      {
        source: "Policy summary B · approved guidance note",
        note: "Used to verify where the process diverges and where it only appears different because of wording.",
        tag: "Reviewed source",
      },
    ],
    omitted: [
      {
        source: "Archived comparison deck",
        note: "Considered but omitted because it summarised an older workflow and would overstate the difference between the two policies.",
        tag: "Superseded",
      },
      {
        source: "Working draft excerpt",
        note: "Considered but not used because the draft was incomplete and not approved for operational use.",
        tag: "Unapproved",
      },
    ],
    inaccessible: [
      {
        source: "Department-specific exception log",
        note: "Not accessible in this prototype path because the current role does not have access to the exception register.",
        tag: "Role-limited",
      },
    ],
  },
};

function LedgerColumns({ ledger }: { ledger: EvidenceLedger }) {
  return (
    <div className="grid gap-3 xl:grid-cols-3">
      <EvidenceColumn
        title="Used evidence"
        description="What the assistant relied on in the answer."
        icon={<BookMarked className="h-4 w-4" />}
        tone="emerald"
        entries={ledger.used}
      />
      <EvidenceColumn
        title="Considered but omitted"
        description="What was checked but intentionally left out."
        icon={<Files className="h-4 w-4" />}
        tone="amber"
        entries={ledger.omitted}
      />
      <EvidenceColumn
        title="Could not access"
        description="What remained outside the assistant's accessible scope."
        icon={<Lock className="h-4 w-4" />}
        tone="sky"
        entries={ledger.inaccessible}
      />
    </div>
  );
}

export function EvidenceRegister({
  variant,
  onVariantChange,
  selectedPromptId,
}: {
  variant: EvidenceRegisterVariant;
  onVariantChange: (variant: EvidenceRegisterVariant) => void;
  selectedPromptId: string | null;
}) {
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);

  useEffect(() => {
    setIsLedgerOpen(false);
  }, [variant, selectedPromptId]);

  const ledger = useMemo(
    () => (selectedPromptId ? evidenceByPrompt[selectedPromptId] ?? null : null),
    [selectedPromptId],
  );

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
            A08 · Evidence register
          </div>
          <div className="text-[11px] text-slate-400">
            Compare an inline evidence panel with a side-panel / pop-up ledger.
          </div>
        </div>

        <div className="inline-flex rounded-xl border border-white/10 bg-slate-950/40 p-1">
          <button
            type="button"
            onClick={() => onVariantChange("inline")}
            className={`rounded-lg px-3 py-1.5 text-xs transition ${
              variant === "inline" ? "bg-violet-500 text-white" : "text-slate-300 hover:bg-white/5"
            }`}
          >
            Inline evidence panel
          </button>
          <button
            type="button"
            onClick={() => onVariantChange("ledger")}
            className={`rounded-lg px-3 py-1.5 text-xs transition ${
              variant === "ledger" ? "bg-violet-500 text-white" : "text-slate-300 hover:bg-white/5"
            }`}
          >
            Side-panel / pop-up ledger
          </button>
        </div>
      </div>

      {!ledger ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/30 px-4 py-5 text-sm text-slate-400">
          Select and send one of the Scenario 3 prompts to inspect the evidence register for that answer.
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-emerald-400/15 bg-emerald-500/8 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-semibold text-emerald-50">{ledger.title}</div>
              <span className="rounded-full border border-sky-300/20 bg-sky-200/10 px-2 py-0.5 text-[11px] text-sky-100">
                Confidence: {ledger.confidence}
              </span>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-200/10 px-2 py-0.5 text-[11px] text-emerald-100">
                Freshness: {ledger.freshness}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-emerald-50/90">{ledger.summary}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
              <Clock3 className="h-3.5 w-3.5" />
              Embedded A07 / A14 cues are shown through confidence and freshness metadata.
            </div>
          </div>

          {variant === "inline" ? (
            <div className="mt-3">
              <LedgerColumns ledger={ledger} />
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-slate-100">Ledger preview hidden by default</div>
                  <div className="text-xs text-slate-400">
                    Open the side-panel ledger to inspect used, omitted, and inaccessible evidence.
                  </div>
                </div>
                <Button type="button" variant="outline" onClick={() => setIsLedgerOpen(true)}>
                  Open evidence ledger
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {variant === "ledger" && ledger && isLedgerOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setIsLedgerOpen(false)}
            aria-label="Close evidence ledger overlay"
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-[880px]">
            <div className="ml-auto flex h-full w-full flex-col border-l border-white/10 bg-slate-950/96 shadow-[0_20px_80px_rgba(15,23,42,0.55)]">
              <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
                <div>
                  <div className="text-sm font-semibold text-slate-100">{ledger.title}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    Side-panel / pop-up ledger variant for A08 Evidence Register.
                  </div>
                </div>
                <Button type="button" variant="outline" onClick={() => setIsLedgerOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Close
                </Button>
              </div>

              <div className="overflow-y-auto px-5 py-4">
                <div className="mb-4 rounded-2xl border border-emerald-400/15 bg-emerald-500/8 px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-sky-300/20 bg-sky-200/10 px-2 py-0.5 text-[11px] text-sky-100">
                      Confidence: {ledger.confidence}
                    </span>
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-200/10 px-2 py-0.5 text-[11px] text-emerald-100">
                      Freshness: {ledger.freshness}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-emerald-50/90">{ledger.summary}</p>
                </div>

                <LedgerColumns ledger={ledger} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EvidenceColumn({
  title,
  description,
  icon,
  tone,
  entries,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  tone: "emerald" | "amber" | "sky";
  entries: EvidenceEntry[];
}) {
  const toneMap = {
    emerald: "border-emerald-400/20 bg-emerald-500/8 text-emerald-50",
    amber: "border-amber-400/20 bg-amber-500/8 text-amber-50",
    sky: "border-sky-400/20 bg-sky-500/8 text-sky-50",
  } as const;

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneMap[tone]}`}>
      <div className="flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </div>
      <div className="mt-1 text-xs text-slate-300">{description}</div>

      <div className="mt-3 space-y-3">
        {entries.map((entry) => (
          <div key={`${title}-${entry.source}`} className="rounded-xl border border-white/10 bg-slate-950/35 px-3 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-medium text-slate-50">{entry.source}</div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300">
                {entry.tag}
              </span>
            </div>
            <div className="mt-1 text-sm leading-6 text-slate-300">{entry.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
