"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn, createId } from "@/lib/utils";
import { visualMap, workArtefactOptions } from "@/lib/prototype-data";
import { exportDocumentAsDocx, exportPresentationAsPptx } from "@/lib/export-utils";
import type {
  DocumentArtefactPayload,
  DocumentBlockTemplate,
  DocumentPageTemplate,
  PresentationArtefactPayload,
  PresentationSlideTemplate,
} from "@/types/prototype";
import { Download, ImagePlus, Minus, MoveDown, MoveUp, Plus, Presentation, FileText } from "lucide-react";

export function WorkArtefactComposer({
  artefact,
}: {
  artefact: PresentationArtefactPayload | DocumentArtefactPayload;
}) {
  if (artefact.type === "presentation") {
    return <PresentationComposer initialArtefact={artefact} />;
  }

  return <DocumentComposer initialArtefact={artefact} />;
}

function PresentationComposer({ initialArtefact }: { initialArtefact: PresentationArtefactPayload }) {
  const [slides, setSlides] = useState<PresentationSlideTemplate[]>(() => structuredClone(initialArtefact.slides));
  const [isExporting, setIsExporting] = useState(false);

  const titleOptions = workArtefactOptions.presentation.titleOptions;
  const bodyOptions = workArtefactOptions.presentation.bodyOptions;
  const visualOptions = workArtefactOptions.visualOptions;

  const updateSlide = (slideId: string, patch: Partial<PresentationSlideTemplate>) => {
    setSlides((current) => current.map((slide) => (slide.id === slideId ? { ...slide, ...patch } : slide)));
  };

  const addSlide = () => {
    setSlides((current) => {
      if (current.length >= 15) return current;
      return [
        ...current,
        {
          id: createId("slide"),
          titleOptionId: titleOptions[0]?.id ?? "exec-summary",
          bodyOptionId: bodyOptions[0]?.id ?? "body-summary",
          visuals: [],
        },
      ];
    });
  };

  const removeSlide = (slideId: string) => {
    setSlides((current) => {
      if (current.length <= 2) return current;
      return current.filter((slide) => slide.id !== slideId);
    });
  };

  const addVisualSelector = (slideId: string) => {
    setSlides((current) =>
      current.map((slide) => {
        if (slide.id !== slideId || slide.visuals.length >= 3) return slide;
        return {
          ...slide,
          visuals: [...slide.visuals, visualOptions[0]?.id ?? "photo-team"],
        };
      }),
    );
  };

  const updateVisual = (slideId: string, index: number, visualId: string) => {
    setSlides((current) =>
      current.map((slide) => {
        if (slide.id !== slideId) return slide;
        const visuals = [...slide.visuals];
        visuals[index] = visualId;
        return { ...slide, visuals };
      }),
    );
  };

  const removeVisual = (slideId: string, index: number) => {
    setSlides((current) =>
      current.map((slide) => {
        if (slide.id !== slideId) return slide;
        return { ...slide, visuals: slide.visuals.filter((_, visualIndex) => visualIndex !== index) };
      }),
    );
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportPresentationAsPptx({
        fileName: initialArtefact.fileName,
        artefactLabel: initialArtefact.artefactLabel,
        slides,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="mt-3 overflow-hidden border-violet-400/20 bg-slate-950/45">
      <CardHeader className="border-b border-white/10 bg-white/5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Presentation className="h-5 w-5 text-violet-200" />
              {initialArtefact.artefactLabel}
            </CardTitle>
            <CardDescription>
              Dropdown-only presentation editor with PPTX export, slide add/remove, and up to 3 visuals per slide.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={addSlide} disabled={slides.length >= 15}>
              <Plus className="mr-2 h-4 w-4" />
              Add slide
            </Button>
            <Button type="button" onClick={handleExport} disabled={isExporting}>
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "Exporting..." : "Download PPTX"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {slides.map((slide, index) => (
          <div key={slide.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-100">Slide {index + 1}</div>
                <div className="text-xs text-slate-400">Minimum 2 slides, maximum 15 slides.</div>
              </div>
              <Button type="button" variant="outline" onClick={() => removeSlide(slide.id)} disabled={slides.length <= 2}>
                <Minus className="mr-2 h-4 w-4" />
                Remove slide
              </Button>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="space-y-3">
                <LabeledSelect
                  label="Slide title"
                  value={slide.titleOptionId}
                  options={titleOptions}
                  onChange={(value) => updateSlide(slide.id, { titleOptionId: value })}
                />
                <LabeledSelect
                  label="Slide body"
                  value={slide.bodyOptionId}
                  options={bodyOptions}
                  onChange={(value) => updateSlide(slide.id, { bodyOptionId: value })}
                />

                <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Images / figures</div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addVisualSelector(slide.id)}
                      disabled={slide.visuals.length >= 3}
                    >
                      <ImagePlus className="mr-2 h-4 w-4" />
                      Add visual
                    </Button>
                  </div>

                  {slide.visuals.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-sm text-slate-400">
                      No visual selected for this slide yet.
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    {slide.visuals.map((visualId, visualIndex) => (
                      <div key={`${slide.id}-${visualIndex}`} className="flex items-center gap-2">
                        <select
                          value={visualId}
                          onChange={(event) => updateVisual(slide.id, visualIndex, event.target.value)}
                          className="h-10 flex-1 rounded-xl border border-white/10 bg-slate-900/60 px-3 text-sm text-slate-100 outline-none focus:border-violet-400/40"
                        >
                          {visualOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <Button type="button" variant="outline" onClick={() => removeVisual(slide.id, visualIndex)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-300/20 bg-white p-4 text-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.16)]">
                <div className="mb-3 text-xs uppercase tracking-[0.14em] text-slate-500">Slide preview</div>
                <div className="text-xl font-semibold text-slate-900">
                  {labelFrom(slide.titleOptionId, titleOptions)}
                </div>
                <div className="mt-3 text-sm leading-6 text-slate-700">
                  {labelFrom(slide.bodyOptionId, bodyOptions)}
                </div>
                <div className={cn("mt-4 grid gap-2", slide.visuals.length <= 1 ? "grid-cols-1" : slide.visuals.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
                  {slide.visuals.map((visualId) => {
                    const visual = visualMap[visualId];
                    if (!visual) return null;
                    return (
                      <div key={visualId} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <img src={visual.src} alt={visual.label} className="h-24 w-full object-cover" />
                        <div className="px-2 py-1 text-[11px] text-slate-600">{visual.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DocumentComposer({ initialArtefact }: { initialArtefact: DocumentArtefactPayload }) {
  const [pages, setPages] = useState<DocumentPageTemplate[]>(() => structuredClone(initialArtefact.pages));
  const [isExporting, setIsExporting] = useState(false);

  const titleOptions = workArtefactOptions.document.titleOptions;
  const bodyOptions = workArtefactOptions.document.bodyOptions;
  const visualOptions = workArtefactOptions.visualOptions;

  const addPage = () => {
    setPages((current) => {
      if (current.length >= 15) return current;
      return [
        ...current,
        {
          id: createId("page"),
          blocks: [
            {
              id: createId("block"),
              type: "text",
              titleOptionId: titleOptions[0]?.id ?? "doc-overview",
              bodyOptionId: bodyOptions[0]?.id ?? "doc-body-overview",
            },
          ],
        },
      ];
    });
  };

  const removePage = (pageId: string) => {
    setPages((current) => {
      if (current.length <= 2) return current;
      return current.filter((page) => page.id !== pageId);
    });
  };

  const updateBlock = (pageId: string, blockId: string, updater: (block: DocumentBlockTemplate) => DocumentBlockTemplate) => {
    setPages((current) =>
      current.map((page) =>
        page.id === pageId
          ? {
              ...page,
              blocks: page.blocks.map((block) => (block.id === blockId ? updater(block) : block)),
            }
          : page,
      ),
    );
  };

  const addTextBlock = (pageId: string) => {
    setPages((current) =>
      current.map((page) =>
        page.id === pageId
          ? {
              ...page,
              blocks: [
                ...page.blocks,
                {
                  id: createId("block"),
                  type: "text",
                  titleOptionId: titleOptions[0]?.id ?? "doc-overview",
                  bodyOptionId: bodyOptions[0]?.id ?? "doc-body-overview",
                },
              ],
            }
          : page,
      ),
    );
  };

  const addImageBlock = (pageId: string) => {
    setPages((current) =>
      current.map((page) =>
        page.id === pageId
          ? {
              ...page,
              blocks: [
                ...page.blocks,
                {
                  id: createId("block"),
                  type: "image",
                  visualId: visualOptions[0]?.id ?? "photo-team",
                },
              ],
            }
          : page,
      ),
    );
  };

  const removeBlock = (pageId: string, blockId: string) => {
    setPages((current) =>
      current.map((page) => {
        if (page.id !== pageId || page.blocks.length <= 1) return page;
        return { ...page, blocks: page.blocks.filter((block) => block.id !== blockId) };
      }),
    );
  };

  const moveBlock = (pageId: string, blockId: string, direction: -1 | 1) => {
    setPages((current) =>
      current.map((page) => {
        if (page.id !== pageId) return page;
        const index = page.blocks.findIndex((block) => block.id === blockId);
        const nextIndex = index + direction;
        if (index < 0 || nextIndex < 0 || nextIndex >= page.blocks.length) return page;
        const blocks = [...page.blocks];
        const [item] = blocks.splice(index, 1);
        blocks.splice(nextIndex, 0, item);
        return { ...page, blocks };
      }),
    );
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportDocumentAsDocx({
        fileName: initialArtefact.fileName,
        artefactLabel: initialArtefact.artefactLabel,
        pages,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="mt-3 overflow-hidden border-emerald-400/20 bg-slate-950/45">
      <CardHeader className="border-b border-white/10 bg-white/5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-200" />
              {initialArtefact.artefactLabel}
            </CardTitle>
            <CardDescription>
              A4-style document editor with dropdown-only text/image blocks, page add/remove, and DOCX export.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={addPage} disabled={pages.length >= 15}>
              <Plus className="mr-2 h-4 w-4" />
              Add page
            </Button>
            <Button type="button" onClick={handleExport} disabled={isExporting}>
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "Exporting..." : "Download DOCX"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {pages.map((page, pageIndex) => (
          <div key={page.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-100">Page {pageIndex + 1}</div>
                <div className="text-xs text-slate-400">Minimum 2 pages, maximum 15 pages.</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => addTextBlock(page.id)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add text block
                </Button>
                <Button type="button" variant="outline" onClick={() => addImageBlock(page.id)}>
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Add image block
                </Button>
                <Button type="button" variant="outline" onClick={() => removePage(page.id)} disabled={pages.length <= 2}>
                  <Minus className="mr-2 h-4 w-4" />
                  Remove page
                </Button>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-3">
                {page.blocks.map((block, blockIndex) => (
                  <div key={block.id} className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs uppercase tracking-[0.12em] text-slate-500">
                        Block {blockIndex + 1} · {block.type === "text" ? "Text" : "Image"}
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => moveBlock(page.id, block.id, -1)} disabled={blockIndex === 0}>
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => moveBlock(page.id, block.id, 1)}
                          disabled={blockIndex === page.blocks.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeBlock(page.id, block.id)}
                          disabled={page.blocks.length <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {block.type === "text" ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        <LabeledSelect
                          label="Section heading"
                          value={block.titleOptionId ?? titleOptions[0]?.id ?? "doc-overview"}
                          options={titleOptions}
                          onChange={(value) =>
                            updateBlock(page.id, block.id, (current) => ({
                              ...current,
                              type: "text",
                              titleOptionId: value,
                            }))
                          }
                        />
                        <LabeledSelect
                          label="Section text"
                          value={block.bodyOptionId ?? bodyOptions[0]?.id ?? "doc-body-overview"}
                          options={bodyOptions}
                          onChange={(value) =>
                            updateBlock(page.id, block.id, (current) => ({
                              ...current,
                              type: "text",
                              bodyOptionId: value,
                            }))
                          }
                        />
                      </div>
                    ) : (
                      <LabeledSelect
                        label="Image / figure"
                        value={block.visualId ?? visualOptions[0]?.id ?? "photo-team"}
                        options={visualOptions.map((option) => ({ id: option.id, label: option.label }))}
                        onChange={(value) =>
                          updateBlock(page.id, block.id, () => ({
                            id: block.id,
                            type: "image",
                            visualId: value,
                          }))
                        }
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mx-auto w-full max-w-[340px] rounded-[28px] border border-slate-300/20 bg-white p-5 text-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.16)]">
                <div className="mb-3 text-xs uppercase tracking-[0.14em] text-slate-500">A4 preview</div>
                <div className="space-y-4">
                  {page.blocks.map((block) => {
                    if (block.type === "text") {
                      return (
                        <div key={block.id} className="space-y-2">
                          <div className="text-base font-semibold text-slate-900">
                            {labelFrom(block.titleOptionId, titleOptions)}
                          </div>
                          <div className="text-sm leading-6 text-slate-700">
                            {labelFrom(block.bodyOptionId, bodyOptions)}
                          </div>
                        </div>
                      );
                    }

                    const visual = block.visualId ? visualMap[block.visualId] : null;
                    if (!visual) return null;
                    return (
                      <div key={block.id} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <img src={visual.src} alt={visual.label} className="h-36 w-full object-cover" />
                        <div className="px-3 py-2 text-xs text-slate-600">{visual.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function LabeledSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ id: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2 rounded-xl border border-white/10 bg-slate-900/30 p-3 text-sm text-slate-200">
      <span className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-xl border border-white/10 bg-slate-900/60 px-3 text-sm text-slate-100 outline-none focus:border-violet-400/40"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function labelFrom(id: string | undefined, options: Array<{ id: string; label: string }>) {
  if (!id) return "";
  return options.find((option) => option.id === id)?.label ?? "";
}
