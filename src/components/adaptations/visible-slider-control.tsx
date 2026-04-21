import { adaptationStates } from "@/lib/prototype-data";
import type { DetailLevel } from "@/types/prototype";

const detailIndex: DetailLevel[] = ["brief", "standard", "guided", "audit"];

export function VisibleSliderControl({
  detailLevel,
  onChange,
}: {
  detailLevel: DetailLevel;
  onChange: (level: DetailLevel) => void;
}) {
  const currentIndex = detailIndex.indexOf(detailLevel);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-slate-100">A03 · Visible slider</div>
          <p className="text-xs text-slate-400">Adjust guidance and evidence depth per prompt.</p>
        </div>
        <div className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
          {adaptationStates.detailLevels.find((item) => item.id === detailLevel)?.label}
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={detailIndex.length - 1}
        step={1}
        value={currentIndex}
        onChange={(event) => onChange(detailIndex[Number(event.target.value)])}
        className="w-full accent-violet-400"
        aria-label="Adaptive interaction control"
      />

      <div className="mt-3 grid grid-cols-4 gap-2">
        {adaptationStates.detailLevels.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={detailLevel === item.id ? "rounded-xl border border-violet-400/20 bg-violet-500/12 px-3 py-2 text-left" : "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left hover:bg-white/10"}
          >
            <div className="text-xs font-medium text-slate-100">{item.label}</div>
            <div className="mt-1 text-[11px] leading-4 text-slate-400">{item.hint}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
