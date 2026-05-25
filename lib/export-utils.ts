import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import type { ArchitectureResponse } from "@/types/architecture";

export async function exportDiagramAsPng(
  element: HTMLElement,
  fileName: string
): Promise<void> {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: getComputedStyle(document.body).backgroundColor
  });

  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = `${fileName}-diagram.png`;
  anchor.click();
}

export function exportArchitectureAsJson(
  architecture: ArchitectureResponse,
  fileName: string
): void {
  const json = JSON.stringify(architecture, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${fileName}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportTerraformAsTf(
  architecture: ArchitectureResponse,
  fileName: string
): void {
  const blob = new Blob([architecture.terraformTemplate], {
    type: "text/plain"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${fileName}.tf`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportArchitectureAsPdf(
  architecture: ArchitectureResponse,
  fileName: string
): void {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // Helper function to add text with auto page break
  function addText(
    text: string,
    fontSize: number,
    fontStyle: "normal" | "bold" = "normal",
    color: [number, number, number] = [0, 0, 0]
  ) {
    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", fontStyle);
    pdf.setTextColor(color[0], color[1], color[2]);

    const lines = pdf.splitTextToSize(text, maxWidth);

    for (const line of lines) {
      if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    }
    yPosition += 3;
  }

  function addSpace(space: number) {
    yPosition += space;
    if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  }

  // Title
  addText(architecture.title, 20, "bold", [0, 0, 0]);
  addSpace(3);

  // Provider and Scale badges
  const badges = `${architecture.cloudProvider} • ${architecture.scale}`;
  addText(badges, 10, "normal", [100, 100, 100]);
  addSpace(5);

  // Summary
  addText("Summary", 14, "bold", [0, 0, 0]);
  addSpace(2);
  addText(architecture.summary, 11, "normal", [60, 60, 60]);
  addSpace(8);

  // Cost Estimate
  addText("Cost Estimate", 14, "bold", [0, 0, 0]);
  addSpace(2);
  addText(architecture.estimatedCost, 12, "bold", [0, 100, 0]);
  addSpace(8);

  // Services
  addText("Cloud Services", 14, "bold", [0, 0, 0]);
  addSpace(3);
  architecture.services.forEach((service) => {
    addText(`${service.name}`, 11, "bold", [0, 0, 0]);
    addText(`Category: ${service.category}`, 9, "normal", [100, 100, 100]);
    addText(service.description, 10, "normal", [60, 60, 60]);
    addSpace(4);
  });

  // Security Recommendations
  addSpace(3);
  addText("Security Recommendations", 14, "bold", [0, 0, 0]);
  addSpace(3);
  architecture.securityRecommendations.forEach((recommendation, index) => {
    addText(`${index + 1}. ${recommendation}`, 10, "normal", [60, 60, 60]);
    addSpace(2);
  });

  // Deployment Checklist
  addSpace(3);
  addText("Deployment Checklist", 14, "bold", [0, 0, 0]);
  addSpace(3);
  architecture.deploymentChecklist.forEach((item, index) => {
    addText(`${index + 1}. ${item}`, 10, "normal", [60, 60, 60]);
    addSpace(2);
  });

  // Save PDF
  pdf.save(`${fileName}.pdf`);
}
