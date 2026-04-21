import { adaptationStates } from "@/lib/prototype-data";
import type { DetailLevel } from "@/types/prototype";

export function ProfileControl({
  detailLevel,
  onChange,
}: {
  detailLevel: DetailLevel;
  onChange: (level: DetailLevel) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3">
        <div className="text-sm font-medium text-slate-100">A03 · Profile-based control</div>
        <p className="text-xs text-slate-400">Choose a profile instead of manipulating every response manually.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {adaptationStates.profiles.map((profile) => {
          const active = profile.id === detailLevel;
          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => onChange(profile.id)}
              className={active ? "rounded-2xl border border-emerald-400/20 bg-emerald-500/12 p-4 text-left shadow-[0_10px_24px_rgba(34,197,94,0.15)]" : "rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10"}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-slate-100">{profile.label}</div>
                {active ? <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-200">Selected</span> : null}
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{profile.hint}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
