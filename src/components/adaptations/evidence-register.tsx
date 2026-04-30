"use client";

import { JSX, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { EvidenceEntry, EvidenceLedger } from "@/types/prototype";
import { BookMarked, Clock3, ExternalLink, Files, Lock, X } from "lucide-react";

type EvidenceStatus = "used" | "omitted" | "inaccessible";

export function EvidenceRegister({ ledger }: { ledger: EvidenceLedger }) {
  const [selected, setSelected] = useState<{ entry: EvidenceEntry; status: EvidenceStatus } | null>(null);

  return (
    <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-4">
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
          Confidence and freshness are shown here so the response can be checked, not just accepted.
        </div>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        <EvidenceColumn
          title="Used sources"
          description="Sources that shaped the response."
          icon={<BookMarked className="h-4 w-4" />}
          tone="emerald"
          entries={ledger.used}
          status="used"
          onSelect={(entry) => setSelected({ entry, status: "used" })}
        />
        <EvidenceColumn
          title="Checked but not used"
          description="Sources the assistant ignored on purpose."
          icon={<Files className="h-4 w-4" />}
          tone="amber"
          entries={ledger.omitted}
          status="omitted"
          onSelect={(entry) => setSelected({ entry, status: "omitted" })}
        />
        <EvidenceColumn
          title="Could not open"
          description="Sources that were outside the current access level."
          icon={<Lock className="h-4 w-4" />}
          tone="sky"
          entries={ledger.inaccessible}
          status="inaccessible"
          onSelect={(entry) => setSelected({ entry, status: "inaccessible" })}
        />
      </div>

      {selected ? (
        <EvidenceEntryModal
          entry={selected.entry}
          status={selected.status}
          onClose={() => setSelected(null)}
        />
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
  status,
  onSelect,
}: {
  title: string;
  description: string;
  icon: JSX.Element;
  tone: "emerald" | "amber" | "sky";
  entries: EvidenceEntry[];
  status: EvidenceStatus;
  onSelect: (entry: EvidenceEntry) => void;
}) {
  const toneMap = {
    emerald: "border-emerald-400/20 bg-emerald-500/8 text-emerald-50",
    amber: "border-amber-400/20 bg-amber-500/8 text-amber-50",
    sky: "border-sky-400/20 bg-sky-500/8 text-sky-50",
  } as const;

  const verbByStatus = {
    used: "Open used source details",
    omitted: "Open omitted source details",
    inaccessible: "Open inaccessible source details",
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
          <button
            key={`${title}-${entry.id}`}
            type="button"
            onClick={() => onSelect(entry)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/35 px-3 py-3 text-left transition hover:border-violet-300/30 hover:bg-slate-950/50"
            aria-label={verbByStatus[status]}
          >
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-medium text-slate-50">{entry.title}</div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300">
                {entry.tag}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function EvidenceEntryModal({
  entry,
  status,
  onClose,
}: {
  entry: EvidenceEntry;
  status: EvidenceStatus;
  onClose: () => void;
}) {
  const excerptHeading = useMemo(() => {
    if (status === "used") return "Text used in the response";
    if (status === "omitted") return "Text that was rejected";
    return null;
  }, [status]);

  const actionLabel = status === "inaccessible" ? "Try to open source" : "Open source in new tab";

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close evidence source details"
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950/96 shadow-[0_20px_80px_rgba(15,23,42,0.55)]">
          <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
            <div>
              <div className="text-sm font-semibold text-slate-50">{entry.title}</div>
              <div className="mt-1 text-xs text-slate-400">
                {status === "used"
                  ? "Used source"
                  : status === "omitted"
                    ? "Checked but not used"
                    : "Could not open"}
              </div>
            </div>

            <Button type="button" variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </div>

          <div className="space-y-4 px-5 py-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Why this source was handled this way</div>
              <p className="mt-2 text-sm leading-6 text-slate-100">{entry.note}</p>
            </div>

            {excerptHeading && entry.excerpt ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {excerptHeading}
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-100">{entry.excerpt}</p>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">
                {entry.tag}
              </span>

              <a
                href={entry.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 transition hover:bg-white/10"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {actionLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
