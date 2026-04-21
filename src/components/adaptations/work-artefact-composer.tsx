"use client";

import { useEffect, useMemo, useState } from "react";

type Slide = {
  id: string;
  title: string;
  body: string;
  visual: string;
};

function templateFromPrompt(promptId: string | null) {
  if (promptId === "p-s4-1") {
    return {
      name: "Workshop outline deck",
      fileName: "workshop-outline-prototype",
      slides: [
        {
          id: "s1",
          title: "Workshop overview",
          body: "Theme, audience, purpose, and what the session should achieve.",
          visual: "Hero image",
        },
        {
          id: "s2",
          title: "Agenda and timings",
          body: "Block the session into warm-up, core activity, reflection, and follow-up.",
          visual: "Timeline",
        },
        {
          id: "s3",
          title: "Activities and materials",
          body: "List activities, facilitation prompts, required materials, and room setup.",
          visual: "Checklist",
        },
        {
          id: "s4",
          title: "Next steps",
          body: "Capture owner, deadline, and what should be refined before delivery.",
          visual: "Action list",
        },
      ],
    };
  }

  return {
    name: "Executive presentation draft",
    fileName: "executive-update-prototype",
    slides: [
      {
        id: "s1",
        title: "Executive summary",
        body: "State the overall message in one sentence and anchor the decision needed.",
        visual: "Hero stat",
      },
      {
        id: "s2",
        title: "Current status",
        body: "Summarise current progress, what is on track, and what has shifted since the last update.",
        visual: "Progress chart",
      },
      {
        id: "s3",
        title: "Risks and dependencies",
        body: "Show the main blockers, likely impact, and what leadership should pay attention to.",
        visual: "Risk matrix",
      },
      {
        id: "s4",
        title: "Decision and next action",
        body: "State the decision required, owner, and expected next milestone.",
        visual: "Decision callout",
      },
    ],
  };
}

export function WorkArtefactComposer({
  promptId,
  promptLabel,
  enabled,
}: {
  promptId: string | null;
  promptLabel: string | null;
  enabled: boolean;
}) {
  const template = useMemo(() => templateFromPrompt(promptId), [promptId]);
  const [slides, setSlides] = useState<Slide[]>(template.slides);

  useEffect(() => {
    setSlides(template.slides);
  }, [template]);

  const downloadPrototype = () => {
    const payload = {
      artefact: template.name,
      promptId,
      promptLabel,
      slides,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${template.fileName}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (!enabled) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-4">
        <div className="text-sm font-medium text-slate-100">A05 · Work artefact composer</div>
        <div className="mt-1 text-sm text-slate-400">
          Send a Scenario 4 prompt to generate an editable deck preview inside the response area.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-cyan-400/15 bg-cyan-500/[0.04] p-4 shadow-[0_10px_30px_rgba(8,145,178,0.12)]">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
            A05 · Work artefact composer
          </div>
          <div className="mt-1 text-sm text-slate-100">{template.name}</div>
          <div className="mt-1 text-[11px] text-slate-400">
            Editable prototype output embedded into the assistant response area.
          </div>
          {promptLabel ? (
            <div className="mt-2 text-[11px] text-slate-400">
              Generated from: <span className="text-slate-200">{promptLabel}</span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSlides(template.slides)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
          >
            Reset deck
          </button>
          <button
            type="button"
            onClick={downloadPrototype}
            className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-200 transition hover:bg-cyan-500/15"
          >
            Download deck (prototype)
          </button>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {slides.map((slide, index) => (
          <div key={slide.id} className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Slide {index + 1}</div>
              <div className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300">
                Editable
              </div>
            </div>

            <label className="block">
              <div className="mb-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">Title</div>
              <input
                value={slide.title}
                onChange={(event) => {
                  const value = event.target.value;
                  setSlides((current) =>
                    current.map((item) => (item.id === slide.id ? { ...item, title: value } : item)),
                  );
                }}
                className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/40"
              />
            </label>

            <label className="mt-3 block">
              <div className="mb-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">Body</div>
              <textarea
                rows={4}
                value={slide.body}
                onChange={(event) => {
                  const value = event.target.value;
                  setSlides((current) =>
                    current.map((item) => (item.id === slide.id ? { ...item, body: value } : item)),
                  );
                }}
                className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/40"
              />
            </label>

            <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px] sm:items-end">
              <label className="block">
                <div className="mb-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">Visual placeholder</div>
                <select
                  value={slide.visual}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSlides((current) =>
                      current.map((item) => (item.id === slide.id ? { ...item, visual: value } : item)),
                    );
                  }}
                  className="h-10 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/40"
                >
                  <option>Hero image</option>
                  <option>Timeline</option>
                  <option>Checklist</option>
                  <option>Process diagram</option>
                  <option>Progress chart</option>
                  <option>Risk matrix</option>
                  <option>Decision callout</option>
                  <option>Action list</option>
                  <option>None</option>
                </select>
              </label>

              <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.03] text-center text-[11px] text-slate-400">
                {slide.visual}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
