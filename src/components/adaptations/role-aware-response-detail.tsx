import { adaptationStates } from "@/lib/prototype-data";
import type { RolePersona } from "@/types/prototype";
import { cn } from "@/lib/utils";

export function RoleAwareResponseDetail({
  rolePersona,
  onChange,
}: {
  rolePersona: RolePersona;
  onChange: (rolePersona: RolePersona) => void;
}) {
  const selected = adaptationStates.rolePersonas.find((item) => item.id === rolePersona);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
          A02 · Audience
        </div>
        <div className="text-[11px] text-slate-400">Choose who the next response should be written for.</div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {adaptationStates.rolePersonas.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "rounded-lg border px-3 py-2 text-left transition",
              rolePersona === item.id
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                : "border-white/10 bg-slate-950/35 text-slate-300 hover:bg-white/8",
            )}
          >
            <div className="text-xs font-medium">{item.label}</div>
            <div className="mt-1 text-[11px] leading-4 text-slate-400">{item.hint}</div>
          </button>
        ))}
      </div>

      {selected ? <div className="mt-2 text-[11px] text-slate-400">Selected audience: {selected.label}.</div> : null}
    </div>
  );
}
