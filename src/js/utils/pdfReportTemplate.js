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

  // Build a 2-column key-value pair grid for better readability
  const tableBody = [];
  for (let i = 0; i < metrics.length; i += 2) {
    const row = [metrics[i].label.toUpperCase(), metrics[i].value];
    if (i + 1 < metrics.length) {
      row.push(metrics[i + 1].label.toUpperCase());
      row.push(metrics[i + 1].value);
    } else {
      row.push("");
      row.push("");
    }
    tableBody.push(row);
  }

  autoTable(doc, {
    startY: startY + 5,
    body: tableBody,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 9,
      valign: "middle",
      cellPadding: 5,
      lineWidth: 0.1,
      lineColor: [189, 195, 199],
      overflow: "visible",
    },
    columnStyles: {
      0: {
        fontStyle: "bold",
        textColor: [127, 140, 141],
        fillColor: HEADER_BG_COLOR,
        fontSize: 8,
      },
      1: {
        fontStyle: "bold",
        textColor: TEXT_COLOR,
        fontSize: 11,
        halign: "center",
      },
      2: {
        fontStyle: "bold",
        textColor: [127, 140, 141],
        fillColor: HEADER_BG_COLOR,
        fontSize: 8,
      },
      3: {
        fontStyle: "bold",
        textColor: TEXT_COLOR,
        fontSize: 11,
        halign: "center",
      },
    },
    margin: { left: 14, right: 14 },
  });

  return doc.lastAutoTable.finalY + 15;
}

export function exportTable(doc, headers, rows, options = {}) {
  const {
    startY: rawStartY,
    columnStyles: rawColumnStyles,
    margin,
    fontSize,
    ...extraOptions
  } = options;

  const startY = rawStartY ?? 45;
  const columnStyles = rawColumnStyles
    ? Object.fromEntries(
        Object.entries(rawColumnStyles).map(([key, style]) => {
          if (style?.cellWidth && typeof style.cellWidth === "number") {
            return [key, { ...style, cellWidth: "auto" }];
          }
          return [key, style];
        }),
      )
    : undefined;

  autoTable(doc, {
    ...extraOptions,
    startY,
    head: [headers],
    body: rows,
    theme: "striped",
    styles: {
      font: "helvetica",
      fontSize: fontSize ?? 9,
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
      overflow: "visible",
    },
    bodyStyles: {
      textColor: [50, 50, 50],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // Very light blue-gray
    },
    columnStyles,
    margin: margin || { left: 14, right: 14 },
  });
}
