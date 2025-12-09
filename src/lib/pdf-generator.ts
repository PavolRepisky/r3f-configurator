import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FEATURES } from "@/data/features";
import { OPTIONS } from "@/data/options";
import { formatPrice } from "@/lib/price";
import { getModelDetails } from "@/lib/repository";
import type { CurrencyCode } from "@/types/configurator";

interface GeneratePDFProps {
  modelId: string;
  selections: Record<string, string>;
  totalPrice: number;
  currency: CurrencyCode;
  showVat: boolean;
  imageDataUrl: string;
  t: (key: string) => string; // <--- We pass the translation function
}

export function generateQuotePDF({
  modelId,
  selections,
  totalPrice,
  currency,
  showVat,
  imageDataUrl,
  t,
}: GeneratePDFProps) {
  const doc = new jsPDF();
  const model = getModelDetails(modelId);
  if (!model) return;

  // --- 1. HEADER ---
  doc.setFontSize(22);
  doc.setTextColor(234, 88, 12); // Orange #ea580c
  doc.text("TERRABOX", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 28);
  doc.text(`Ref: TB-${Math.floor(Math.random() * 10000)}`, 14, 33);

  let finalY : number;

  // --- 2. 3D SCREENSHOT ---
  try {
    const imgProps = doc.getImageProperties(imageDataUrl);
    const pdfWidth = doc.internal.pageSize.getWidth();
    // Calculate height to fit width (minus margins)
    const imgHeight = (imgProps.height * (pdfWidth - 28)) / imgProps.width;
    doc.addImage(imageDataUrl, "PNG", 14, 40, pdfWidth - 28, imgHeight);

    // Move cursor below image
    finalY = 40 + imgHeight + 10;
  } catch (e) {
    console.error("PDF Image Error", e);
    finalY = 50;
  }

  // --- 3. CONFIGURATION TABLE ---
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text(t("ui.summary_title"), 14, finalY);
  finalY += 8;

  const tableData: any[] = [];

  // Row: Base Model
  tableData.push([
    t("ui.base_price"),
    t(model.label), // Translate "model.e3.label"
    formatPrice(model.basePrice, currency),
  ]);

  // Rows: Selected Options
  Object.entries(selections).forEach(([featureId, optionId]) => {
    const feature = FEATURES[featureId];
    const option = OPTIONS[optionId];

    if (feature && option) {
      tableData.push([
        t(feature.label),
        t(option.label),
        option.price > 0
          ? formatPrice(option.price, currency)
          : t("ui.included"),
      ]);
    }
  });

  autoTable(doc, {
    startY: finalY,
    head: [[t("feature.exterior.tech"), "Selection", "Price"]], // Just reusing a label for header
    body: tableData,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [20, 20, 20], textColor: [255, 255, 255] },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      2: { halign: "right" },
    },
  });

  // --- 4. TOTALS ---
  // @ts-expect-error
  finalY = doc.lastAutoTable.finalY + 10;

  const vatRate = 0.23;
  const vatAmount = totalPrice * vatRate;
  const totalWithVat = totalPrice + vatAmount;

  doc.setFontSize(10);
  doc.text(t("ui.subtotal") + ":", 140, finalY);
  doc.text(formatPrice(totalPrice, currency), 195, finalY, { align: "right" });

  if (showVat) {
    finalY += 6;
    doc.text(t("ui.vat_label") + ":", 140, finalY);
    doc.text(formatPrice(vatAmount, currency), 195, finalY, { align: "right" });

    finalY += 8;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(t("ui.total") + ":", 140, finalY);
    doc.setTextColor(234, 88, 12);
    doc.text(formatPrice(totalWithVat, currency), 195, finalY, {
      align: "right",
    });
  } else {
    finalY += 8;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(t("ui.total") + ":", 140, finalY);
    doc.setTextColor(234, 88, 12);
    doc.text(formatPrice(totalPrice, currency), 195, finalY, {
      align: "right",
    });
  }

  // --- 5. FOOTER ---
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.setFont("helvetica", "normal");
  doc.text(
    "SmartModule s.r.o. | info@terrabox.sk | +421 900 000 000",
    14,
    pageHeight - 10,
  );

  doc.save("terrabox-quote.pdf");
}
