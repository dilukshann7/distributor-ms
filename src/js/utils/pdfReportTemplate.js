import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "./reportUtils.js";

export function preparePdfDoc(title, dateLabel) {
  const doc = new jsPDF();

  // Set default font to Helvetica
  doc.setFont("helvetica", "bold");

  // Header with Company Name (Left) and Report Title (Right)
  doc.setFontSize(20);
  doc.setTextColor(41, 128, 185); // Professional Blue
  doc.text("ADP Namasinghe Distributors", 14, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(127, 140, 141); // Gray
  doc.text(title, doc.internal.pageSize.getWidth() - 14, 20, {
    align: "right",
  });

  // Line Separator with gradient-like effect (two lines)
  doc.setDrawColor(41, 128, 185);
  doc.setLineWidth(1);
  doc.line(14, 25, doc.internal.pageSize.getWidth() - 14, 25);

  doc.setDrawColor(236, 240, 241); // Light gray under-line
  doc.setLineWidth(0.5);
  doc.line(14, 26, doc.internal.pageSize.getWidth() - 14, 26);

  doc.setFontSize(9);
  doc.setTextColor(52, 73, 94);
  doc.setFont("helvetica", "italic");
  doc.text(`Generated: ${formatDate(dateLabel)}`, 14, 33);
  doc.setFont("helvetica", "normal"); // Reset

  return doc;
}

export function addFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(149, 165, 166); // Lighter gray for footer
    doc.setFont("helvetica", "normal");

    doc.text(`Page ${i} of ${pageCount}`, width / 2, height - 10, {
      align: "center",
    });

    doc.text("Confidential - ADP Namasinghe Distributors", 14, height - 10);

    const date = new Date().toLocaleDateString();
    doc.text(date, width - 14, height - 10, { align: "right" });
  }
}

export function addSummarySection(doc, title, metrics, startY) {
  doc.setFontSize(13);
  doc.setTextColor(44, 62, 80);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, startY);

  // Create a nice grid for metrics using autoTable
  autoTable(doc, {
    startY: startY + 5,
    head: [],
    body: [
      metrics.map((m) => m.label.toUpperCase()),
      metrics.map((m) => m.value),
    ],
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 10,
      halign: "center",
      valign: "middle",
      cellPadding: 6,
      lineWidth: 0.1,
      lineColor: [224, 224, 224],
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
    },
    columnStyles: {
      // evenly distribute columns could be complex, but let's rely on autoTable defaults
    },
    didParseCell: (data) => {
      // Label Row
      if (data.row.index === 0) {
        data.cell.styles.fillColor = [244, 246, 247];
        data.cell.styles.textColor = [127, 140, 141];
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fontSize = 8;
      }
      // Value Row
      if (data.row.index === 1) {
        data.cell.styles.fillColor = [255, 255, 255];
        data.cell.styles.textColor = [41, 128, 185]; // Brand Blue
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fontSize = 12;
      }
    },
  });

  return doc.lastAutoTable.finalY + 12;
}

export function exportTable(doc, headers, rows, options = {}) {
  const startY = options.startY ?? 50;

  autoTable(doc, {
    startY,
    head: [headers],
    body: rows,
    theme: "striped",
    styles: {
      font: "helvetica",
      fontSize: options.fontSize ?? 9,
      overflow: "linebreak",
      cellPadding: 4,
      valign: "middle",
    },
    headStyles: {
      fillColor: options.headColor ?? [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: options.columnStyles,
    margin: options.margin || { left: 14, right: 14 },
    ...options,
  });
}
