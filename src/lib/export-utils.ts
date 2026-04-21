import PptxGenJS from "pptxgenjs";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  PageBreak,
  Paragraph,
  TextRun,
} from "docx";
import { visualMap, workArtefactOptions } from "@/lib/prototype-data";
import type { DocumentPageTemplate, PresentationSlideTemplate } from "@/types/prototype";

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function fetchImageAsDataUrl(src: string) {
  const response = await fetch(src);
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function fetchImageAsUint8Array(src: string) {
  const response = await fetch(src);
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

function labelForOption(options: Array<{ id: string; label: string }>, id: string | undefined) {
  if (!id) return "";
  return options.find((item) => item.id === id)?.label ?? "";
}

export async function exportPresentationAsPptx({
  fileName,
  artefactLabel,
  slides,
}: {
  fileName: string;
  artefactLabel: string;
  slides: PresentationSlideTemplate[];
}) {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "OpenAI";
  pptx.company = "Study 2 Prototype";
  pptx.subject = artefactLabel;
  pptx.title = artefactLabel;
  pptx.lang = "en-US";
  pptx.theme = {
    headFontFace: "Aptos Display",
    bodyFontFace: "Aptos",
    lang: "en-US",
  };

  const titleOptions = workArtefactOptions.presentation.titleOptions;
  const bodyOptions = workArtefactOptions.presentation.bodyOptions;

  for (const slideTemplate of slides) {
    const slide = pptx.addSlide();
    slide.background = { color: "F7F8FC" };

    slide.addText(labelForOption(titleOptions, slideTemplate.titleOptionId), {
      x: 0.6,
      y: 0.4,
      w: 11.4,
      h: 0.6,
      fontSize: 24,
      bold: true,
      color: "1F2937",
      margin: 0,
    });

    slide.addText(labelForOption(bodyOptions, slideTemplate.bodyOptionId), {
      x: 0.65,
      y: 1.15,
      w: 6.5,
      h: 2.0,
      fontSize: 14,
      color: "334155",
      breakLine: false,
      valign: "top",
      margin: 0,
    });

    const visuals = slideTemplate.visuals.slice(0, 3);
    if (visuals.length > 0) {
      const visualWidth = visuals.length === 1 ? 4.4 : visuals.length === 2 ? 2.15 : 1.38;
      const gap = 0.18;
      let x = 7.3;
      for (const visualId of visuals) {
        const visual = visualMap[visualId];
        if (!visual) continue;
        const data = await fetchImageAsDataUrl(visual.src);
        slide.addImage({ data, x, y: 1.18, w: visualWidth, h: 1.62 });
        slide.addText(visual.label, {
          x,
          y: 2.88,
          w: visualWidth,
          h: 0.22,
          fontSize: 9,
          color: "475569",
          align: "center",
          margin: 0,
        });
        x += visualWidth + gap;
      }
    }

    slide.addText("Prototype export · Study 2 work artefact composer", {
      x: 0.65,
      y: 6.65,
      w: 11.2,
      h: 0.2,
      fontSize: 8,
      color: "64748B",
      align: "right",
      margin: 0,
    });
  }

  await pptx.writeFile({ fileName });
}

export async function exportDocumentAsDocx({
  fileName,
  artefactLabel,
  pages,
}: {
  fileName: string;
  artefactLabel: string;
  pages: DocumentPageTemplate[];
}) {
  const headingOptions = workArtefactOptions.document.titleOptions;
  const bodyOptions = workArtefactOptions.document.bodyOptions;
  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.LEFT,
      children: [new TextRun({ text: artefactLabel, bold: true, size: 34 })],
    }),
  );

  for (const [pageIndex, page] of pages.entries()) {
    for (const block of page.blocks) {
      if (block.type === "text") {
        const headingLabel = labelForOption(headingOptions, block.titleOptionId);
        const bodyLabel = labelForOption(bodyOptions, block.bodyOptionId);

        children.push(
          new Paragraph({
            spacing: { before: 220, after: 120 },
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: headingLabel || "Section", bold: true })],
          }),
        );
        children.push(
          new Paragraph({
            spacing: { after: 180 },
            children: [new TextRun({ text: bodyLabel || "Choose a predefined text block." })],
          }),
        );
      } else if (block.visualId) {
        const visual = visualMap[block.visualId];
        if (!visual) continue;
        const data = await fetchImageAsUint8Array(visual.src);
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 120 },
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                data,
                transformation: {
                  width: 420,
                  height: 220,
                },
              }),
            ],
          }),
        );
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 180 },
            children: [new TextRun({ text: visual.label, italics: true, color: "666666", size: 18 })],
          }),
        );
      }
    }

    if (pageIndex < pages.length - 1) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
  }

  const doc = new Document({
    creator: "OpenAI",
    title: artefactLabel,
    description: "Study 2 prototype export",
    sections: [{ properties: {}, children }],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, fileName);
}
