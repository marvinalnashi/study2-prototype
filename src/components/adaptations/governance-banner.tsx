"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { workArtefactOptions } from "@/lib/prototype-data";
import type { GovernanceBannerVariant, IntentFramingSelection } from "@/types/prototype";
import { AlertTriangle, ShieldCheck } from "lucide-react";

function labelFor(list: Array<{ id: string; label: string }>, id: string) {
  return list.find((item) => item.id === id)?.label ?? id;
}

export function GovernanceBanner({
  variant,
  onVariantChange,
  selectedPromptId,
  framing,
}: {
  variant: GovernanceBannerVariant;
  onVariantChange: (variant: GovernanceBannerVariant) => void;
  selectedPromptId: string | null;
  framing: IntentFramingSelection;
}) {
  const [showActionDetails, setShowActionDetails] = useState(false);

  useEffect(() => {
    setShowActionDetails(false);
  }, [variant, selectedPromptId, framing]);

  const promptCopy = useMemo(() => {
    if (selectedPromptId === "p-s2-1") {
      return {
        title: "Sensitive HR data request",
        message:
          "This request touches salary-related internal data. The assistant should stay aggregate, avoid identifiers, and keep a human owner in the loop before anything is shared.",
        riskTag: "HR / personal data",
        freshnessTag: "Verify current HR policy",
        actionTitle: "Review the safe path before answering",
        actionBody:
          "Recommended safe path: keep the answer aggregated, avoid identifiable salary details, and route final use through the relevant HR or compliance owner.",
      };
    }

    return {
      title: "External sharing policy request",
      message:
        "This request may affect what internal information is shared outside the organisation. The assistant should rely on approved policy sources and signal that external sharing conditions still need review.",
      riskTag: "External disclosure",
      freshnessTag: "Verify latest sharing policy",
      actionTitle: "Review the policy-safe response path",
      actionBody:
        "Recommended safe path: summarise only approved sharing conditions, keep caveats visible, and ask for policy review before external use if the answer will be actioned.",
    };
  }, [selectedPromptId]);

  const requestedOutput = labelFor(
    workArtefactOptions.intentFraming.requestedOutputs,
    framing.requestedOutput,
  );

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
            A09 · Governance banner
          </div>
          <div className="text-[11px] text-slate-400">
            Switch between a passive warning banner and a banner with an action prompt.
          </div>
        </div>

        <div className="inline-flex rounded-xl border border-white/10 bg-slate-950/40 p-1">
          <button
            type="button"
            onClick={() => onVariantChange("passive")}
            className={`rounded-lg px-3 py-1.5 text-xs transition ${
              variant === "passive"
                ? "bg-violet-500 text-white"
                : "text-slate-300 hover:bg-white/5"
            }`}
          >
            Passive banner
          </button>
          <button
            type="button"
            onClick={() => onVariantChange("action")}
            className={`rounded-lg px-3 py-1.5 text-xs transition ${
              variant === "action"
                ? "bg-violet-500 text-white"
                : "text-slate-300 hover:bg-white/5"
            }`}
          >
            Banner + action prompt
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-amber-100">
            <AlertTriangle className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-semibold text-amber-50">{promptCopy.title}</div>
              <span className="rounded-full border border-amber-300/20 bg-amber-200/10 px-2 py-0.5 text-[11px] text-amber-100">
                {promptCopy.riskTag}
              </span>
              <span className="rounded-full border border-sky-300/20 bg-sky-200/10 px-2 py-0.5 text-[11px] text-sky-100">
                Uncertainty: medium
              </span>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-200/10 px-2 py-0.5 text-[11px] text-emerald-100">
                {promptCopy.freshnessTag}
              </span>
            </div>

            <p className="mt-2 text-sm leading-6 text-amber-50/90">{promptCopy.message}</p>

            <div className="mt-2 text-xs text-slate-300">
              Requested output from A06 framing: {requestedOutput}
            </div>

            {variant === "action" ? (
              <div className="mt-3 space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowActionDetails((current) => !current)}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {showActionDetails ? "Hide review prompt" : "Review the governance prompt"}
                </Button>

                {showActionDetails ? (
                  <div className="rounded-xl border border-white/10 bg-slate-950/35 px-3 py-3 text-sm text-slate-100">
                    <div className="font-medium text-slate-50">{promptCopy.actionTitle}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{promptCopy.actionBody}</p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
