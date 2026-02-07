import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "./reportUtils.js";

const COMPANY_NAME = "ADP Namasinghe Distributors";
const BRAND_COLOR = [41, 128, 185]; // Professional Blue
const ACCENT_COLOR = [52, 152, 219]; // Lighter Blue
const TEXT_COLOR = [44, 62, 80]; // Dark Gray
const HEADER_BG_COLOR = [236, 240, 241]; // Light Gray Background

export function preparePdfDoc(title, dateLabel) {
  const doc = new jsPDF();
  const width = doc.internal.pageSize.getWidth();

  // --- Header Section ---
  // Blue top strip
  doc.setFillColor(...BRAND_COLOR);
  doc.rect(0, 0, width, 5, "F");

  // Company Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...BRAND_COLOR);
  doc.text(COMPANY_NAME, 14, 22);

  // Report Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...TEXT_COLOR);
  doc.text(title.toUpperCase(), width - 14, 22, { align: "right" });

  // Date Information
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(127, 140, 141);
  doc.text(`Generated on: ${formatDate(dateLabel)}`, width - 14, 28, {
    align: "right",
  });

  // Decorative Line
  doc.setDrawColor(...BRAND_COLOR);
  doc.setLineWidth(0.5);
  doc.line(14, 35, width - 14, 35);

  return doc;
}

export function addFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer Line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.line(14, height - 15, width - 14, height - 15);

    // Footer Text
    doc.setFontSize(8);
    doc.setTextColor(149, 165, 166);
    doc.setFont("helvetica", "italic");

    // Left: Confidentiality Notice
    doc.text("Confidential - Internal Use Only", 14, height - 10);

    // Center: Company Name Small
    doc.text(COMPANY_NAME, width / 2, height - 10, { align: "center" });

    // Right: Page Number
    doc.text(`Page ${i} of ${pageCount}`, width - 14, height - 10, {
      align: "right",
    });
  }
}

export function addSummarySection(doc, title, metrics, startY) {
  doc.setFontSize(14);
  doc.setTextColor(...BRAND_COLOR);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, startY);

  // Summary Table
  const tableBody = [];
  // Split metrics into rows of 2 or 3 for better layout, or just list them vertically if detailed
  // Ideally, a summary is key-value pairs. Let's make it a clean vertical list or 2-column grid.

  // Let's use a 2-column layout for metrics
  for (let i = 0; i < metrics.length; i += 2) {
    const row = [];
    row.push(metrics[i].label.toUpperCase());
    row.push(metrics[i].value);
    if (i + 1 < metrics.length) {
      row.push(metrics[i + 1].label.toUpperCase());
      row.push(metrics[i + 1].value);
    } else {
      row.push("");
      row.push("");
    }
    tableBody.push(row);
  }

  // However, the original code used a horizontal layout (all labels in row 0, all values in row 1).
  // This can get crowded if there are many metrics.
  // Let's switch to a vertical key-value list for better readability if there are many,
  // OR stick to horizontal if few. The existing implementation was horizontal.
  // Let's keep it horizontal but styled better.

  autoTable(doc, {
    startY: startY + 5,
    head: [metrics.map((m) => m.label.toUpperCase())],
    body: [metrics.map((m) => m.value)],
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 9,
      halign: "center",
      valign: "middle",
      cellPadding: 8,
      lineWidth: 0.1,
      lineColor: [189, 195, 199], // Light gray border
    },
    headStyles: {
      fillColor: HEADER_BG_COLOR,
      textColor: [127, 140, 141],
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
      textColor: TEXT_COLOR,
      fontStyle: "bold",
      fontSize: 11,
    },
    columnStyles: {
      // dynamic distribution
    },
  });

  return doc.lastAutoTable.finalY + 15;
}

export function exportTable(doc, headers, rows, options = {}) {
  const startY = options.startY ?? 45;

  autoTable(doc, {
    startY,
    head: [headers],
    body: rows,
    theme: "striped",
    styles: {
      font: "helvetica",
      fontSize: options.fontSize ?? 9,
      cellPadding: 6,
      valign: "middle",
      overflow: "linebreak",
      lineColor: [230, 230, 230],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: BRAND_COLOR,
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
      minCellHeight: 12,
      valign: "middle",
    },
    bodyStyles: {
      textColor: [50, 50, 50],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // Very light blue-gray
    },
    columnStyles: options.columnStyles,
    margin: options.margin || { left: 14, right: 14 },
    ...options,
  });
}
