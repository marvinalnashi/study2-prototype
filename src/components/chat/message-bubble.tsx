"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/prototype";
import { WorkArtefactComposer } from "@/components/adaptations/work-artefact-composer";
import { EvidenceRegister } from "@/components/adaptations/evidence-register";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isAssistant = message.role === "assistant";
  const hasArtefact = Boolean(message.artefact);
  const hasEvidence = Boolean(message.evidence);
  const [showSources, setShowSources] = useState(false);

  return (
    <div className={cn("flex w-full flex-col gap-3", isAssistant ? "items-start" : "items-end")}>
      <div
        className={cn(
          "rounded-3xl border px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.18)]",
          hasArtefact ? "w-full max-w-full" : "max-w-[82%]",
          isAssistant
            ? "border-white/10 bg-white/8 text-slate-100"
            : "border-violet-400/20 bg-violet-500/14 text-violet-50",
        )}
      >
        <div className="whitespace-pre-wrap text-sm leading-7">{message.content}</div>

        {message.meta ? <div className="mt-3 text-xs text-slate-400">{message.meta}</div> : null}

        {hasEvidence ? (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowSources((current) => !current)}
              className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-100 transition hover:bg-white/10"
            >
              {showSources ? "Hide sources" : "Show sources"}
            </button>

            {showSources && message.evidence ? <EvidenceRegister ledger={message.evidence} /> : null}
          </div>
        ) : null}

        {message.artefact ? <WorkArtefactComposer artefact={message.artefact} /> : null}
      </div>
    </div>
  );
}
