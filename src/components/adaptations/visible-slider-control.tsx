import { adaptationStates } from "@/lib/prototype-data";
import type { DetailLevel } from "@/types/prototype";
import { cn } from "@/lib/utils";

export function VisibleSliderControl({
  detailLevel,
  onChange,
}: {
  detailLevel: DetailLevel | null;
  onChange: (level: DetailLevel) => void;
}) {
  const selected = adaptationStates.detailLevels.find((item) => item.id === detailLevel);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
          A03 · Answer detail
        </div>
        <div className="text-[11px] text-slate-400">Choose how much detail the next answer should contain.</div>
      </div>

      <div className="relative mb-2 px-1">
        <div className="absolute left-4 right-4 top-4 h-px bg-white/10" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {adaptationStates.detailLevels.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "relative rounded-lg border px-2 py-2 text-left transition",
                detailLevel === item.id
                  ? "border-violet-400/40 bg-violet-500/12 text-violet-100 shadow-[0_0_0_1px_rgba(167,139,250,0.12)]"
                  : "border-white/10 bg-slate-950/35 text-slate-300 hover:bg-white/8",
              )}
            >
              <div className="mb-1 h-3 w-3 rounded-full border border-white/15 bg-slate-900/70" />
              <div className="text-xs font-medium">{item.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-4 text-[11px] text-slate-400">
        {selected ? `${selected.label}: ${selected.hint} This choice resets after sending.` : "Choose a detail level for the next response."}
      </div>
    </div>
  );
}
