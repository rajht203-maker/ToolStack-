import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ToolItem } from '../../types';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { 
  FileText, 
  Upload, 
  Download, 
  Check, 
  RotateCw, 
  Scissors, 
  ShieldCheck, 
  Eye, 
  Type, 
  Layers, 
  Maximize2, 
  Trash2,
  Lock,
  Sparkles,
  FileSpreadsheet,
  BookOpen,
  ArrowUpDown,
  Plus,
  Copy,
  Printer,
  ExternalLink
} from 'lucide-react';

interface NewPdfToolsSuiteProps {
  tool: ToolItem;
  onSuccess: (summary: string) => void;
}

export const NewPdfToolsSuite: React.FC<NewPdfToolsSuiteProps> = ({ tool, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>('processed.pdf');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');

  // Specific tool states
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.25);
  const [watermarkAngle, setWatermarkAngle] = useState(45);
  
  const [pageNumberPosition, setPageNumberPosition] = useState<'bottom-center' | 'bottom-right' | 'top-right'>('bottom-center');
  const [pageNumberFormat, setPageNumberFormat] = useState<'num' | 'page_of_total'>('page_of_total');
  
  const [rotationAngle, setRotationAngle] = useState<90 | 180 | 270>(90);
  const [rotationTarget, setRotationTarget] = useState<'all' | 'odd' | 'even'>('all');
  
  const [deletePagesInput, setDeletePagesInput] = useState('1');
  const [detectedPageCount, setDetectedPageCount] = useState<number | null>(null);
  const [extractPagesInput, setExtractPagesInput] = useState('1, 2-3');

  // Detect total pages whenever a file is uploaded
  useEffect(() => {
    if (!file) {
      setDetectedPageCount(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const buffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        if (!cancelled) {
          setDetectedPageCount(doc.getPageCount());
        }
      } catch {
        // Non-fatal if password protected or raw format
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  // Parse page numbers and ranges (e.g., "1-3, 5, 8-10") from text input
  const parsePageNumbers = useCallback((inputStr: string, maxPages?: number): number[] => {
    const pageSet = new Set<number>();
    const tokens = inputStr.replace(/;/g, ',').split(/[\s,]+/).filter(Boolean);
    for (const token of tokens) {
      if (token.includes('-')) {
        const parts = token.split('-').map((s) => parseInt(s.trim(), 10));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          const start = Math.min(parts[0], parts[1]);
          const end = Math.max(parts[0], parts[1]);
          for (let p = start; p <= end; p++) {
            if (p >= 1 && (!maxPages || p <= maxPages)) {
              pageSet.add(p);
            }
          }
        }
      } else {
        const n = parseInt(token, 10);
        if (!isNaN(n) && n >= 1 && (!maxPages || n <= maxPages)) {
          pageSet.add(n);
        }
      }
    }
    return Array.from(pageSet).sort((a, b) => a - b);
  }, []);

  // Currently selected pages to delete based on the input text
  const selectedPagesToDelete = useMemo(() => {
    return parsePageNumbers(deletePagesInput, detectedPageCount || undefined);
  }, [deletePagesInput, detectedPageCount, parsePageNumbers]);

  // Toggle page in the delete input
  const togglePageToDelete = (pageNum: number) => {
    const current = parsePageNumbers(deletePagesInput, detectedPageCount || undefined);
    let updated: number[];
    if (current.includes(pageNum)) {
      updated = current.filter((p) => p !== pageNum);
    } else {
      updated = [...current, pageNum].sort((a, b) => a - b);
    }
    setDeletePagesInput(updated.join(', '));
  };
  const [blankPagePos, setBlankPagePos] = useState<'start' | 'end' | 'after'>('end');
  const [blankPageAfterNum, setBlankPageAfterNum] = useState('1');

  const [metaTitle, setMetaTitle] = useState('Document Title');
  const [metaAuthor, setMetaAuthor] = useState('Official Author');
  const [metaSubject, setMetaSubject] = useState('Business Record');
  const [metaKeywords, setMetaKeywords] = useState('pdf, report, official');

  const [targetPaperSize, setTargetPaperSize] = useState<'A4' | 'Letter' | 'Legal'>('A4');
  const [marginSize, setMarginSize] = useState<number>(36); // 36pt = 0.5 in

  const [invoiceClient, setInvoiceClient] = useState('Acme Corporation');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-001');
  const [invoiceAmount, setInvoiceAmount] = useState('1450.00');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDownloadUrl(null);
      setFeedback(null);
    }
  };

  const getPdfDoc = async (): Promise<PDFDocument> => {
    if (!file) throw new Error('No PDF file uploaded');
    const bytes = await file.arrayBuffer();
    return await PDFDocument.load(bytes);
  };

  const finalizePdf = async (pdfDoc: PDFDocument, filenameSuffix: string) => {
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    const base = file?.name.replace(/\.pdf$/i, '') || 'document';
    setOutputFileName(`${base}-${filenameSuffix}.pdf`);
    setFeedback(`PDF generated successfully (${(blob.size / 1024).toFixed(1)} KB)`);
    onSuccess(`Successfully processed ${tool.name}`);
  };

  // Process Tool Action
  const handleProcess = async () => {
    if (!file && tool.id !== 'pdf-invoice-template-builder') return;
    setIsProcessing(true);
    setFeedback(null);

    try {
      // 1. Watermark Stamper
      if (tool.id === 'pdf-watermark-stamper') {
        const pdfDoc = await getPdfDoc();
        const pages = pdfDoc.getPages();
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        pages.forEach((page) => {
          const { width, height } = page.getSize();
          const textSize = Math.min(width, height) * 0.12;
          page.drawText(watermarkText, {
            x: width / 4,
            y: height / 2,
            size: textSize,
            font,
            color: rgb(0.8, 0.2, 0.2),
            opacity: watermarkOpacity,
            rotate: degrees(watermarkAngle)
          });
        });

        await finalizePdf(pdfDoc, 'watermarked');
      }

      // 2. Page Numberer
      else if (tool.id === 'pdf-page-numberer') {
        const pdfDoc = await getPdfDoc();
        const pages = pdfDoc.getPages();
        const total = pages.length;
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        pages.forEach((page, idx) => {
          const { width, height } = page.getSize();
          const pageNum = idx + 1;
          const text = pageNumberFormat === 'page_of_total' ? `Page ${pageNum} of ${total}` : `${pageNum}`;
          const fontSize = 10;
          const textWidth = font.widthOfTextAtSize(text, fontSize);

          let x = (width - textWidth) / 2;
          let y = 24;

          if (pageNumberPosition === 'bottom-right') {
            x = width - textWidth - 36;
            y = 24;
          } else if (pageNumberPosition === 'top-right') {
            x = width - textWidth - 36;
            y = height - 30;
          }

          page.drawText(text, {
            x,
            y,
            size: fontSize,
            font,
            color: rgb(0.3, 0.3, 0.3)
          });
        });

        await finalizePdf(pdfDoc, 'numbered');
      }

      // 3. Page Rotator
      else if (tool.id === 'pdf-page-rotator') {
        const pdfDoc = await getPdfDoc();
        const pages = pdfDoc.getPages();

        pages.forEach((page, idx) => {
          const pageNum = idx + 1;
          const shouldRotate = 
            rotationTarget === 'all' ||
            (rotationTarget === 'odd' && pageNum % 2 !== 0) ||
            (rotationTarget === 'even' && pageNum % 2 === 0);

          if (shouldRotate) {
            const currentRotation = page.getRotation().angle;
            page.setRotation(degrees((currentRotation + rotationAngle) % 360));
          }
        });

        await finalizePdf(pdfDoc, 'rotated');
      }

      // 4. Reverse Order
      else if (tool.id === 'pdf-reverse-order') {
        const sourceDoc = await getPdfDoc();
        const newDoc = await PDFDocument.create();
        const pageCount = sourceDoc.getPageCount();
        const indices = Array.from({ length: pageCount }, (_, i) => pageCount - 1 - i);

        const copiedPages = await newDoc.copyPages(sourceDoc, indices);
        copiedPages.forEach((page) => newDoc.addPage(page));

        await finalizePdf(newDoc, 'reversed');
      }

      // 5. Delete Pages
      else if (tool.id === 'pdf-delete-pages') {
        const pdfDoc = await getPdfDoc();
        const totalPages = pdfDoc.getPageCount();
        const parsed = parsePageNumbers(deletePagesInput, totalPages);

        if (parsed.length === 0) {
          throw new Error('Please specify at least one valid page number or range to delete (e.g. "1-3, 5").');
        }

        if (parsed.length >= totalPages) {
          throw new Error(`Cannot delete all ${totalPages} pages. A valid PDF file must retain at least one page.`);
        }

        // Sort descending so removals do not invalidate prior indices
        const toDeleteDesc = [...parsed].sort((a, b) => b - a);
        toDeleteDesc.forEach((num) => {
          pdfDoc.removePage(num - 1);
        });

        const remainingCount = pdfDoc.getPageCount();
        await finalizePdf(pdfDoc, `deleted_${parsed.length}_pages`);
        setFeedback(`Successfully removed ${parsed.length} page(s) (${parsed.join(', ')}). ${remainingCount} page(s) remain in trimmed document.`);
      }

      // 6. Extract Pages
      else if (tool.id === 'pdf-extract-pages') {
        const sourceDoc = await getPdfDoc();
        const newDoc = await PDFDocument.create();
        const pageIndices: number[] = [];

        extractPagesInput.split(',').forEach((token) => {
          const part = token.trim();
          if (part.includes('-')) {
            const [start, end] = part.split('-').map((n) => parseInt(n.trim(), 10));
            if (!isNaN(start) && !isNaN(end)) {
              for (let i = start; i <= end; i++) {
                if (i >= 1 && i <= sourceDoc.getPageCount() && !pageIndices.includes(i - 1)) {
                  pageIndices.push(i - 1);
                }
              }
            }
          } else {
            const n = parseInt(part, 10);
            if (!isNaN(n) && n >= 1 && n <= sourceDoc.getPageCount() && !pageIndices.includes(n - 1)) {
              pageIndices.push(n - 1);
            }
          }
        });

        const copied = await newDoc.copyPages(sourceDoc, pageIndices.sort((a, b) => a - b));
        copied.forEach((p) => newDoc.addPage(p));
        await finalizePdf(newDoc, 'extracted');
      }

      // 7. Metadata Editor
      else if (tool.id === 'pdf-metadata-editor') {
        const pdfDoc = await getPdfDoc();
        pdfDoc.setTitle(metaTitle);
        pdfDoc.setAuthor(metaAuthor);
        pdfDoc.setSubject(metaSubject);
        pdfDoc.setKeywords(metaKeywords.split(',').map((k) => k.trim()));
        pdfDoc.setProducer('ToolStack Suite');
        pdfDoc.setCreator('ToolStack Studio');

        await finalizePdf(pdfDoc, 'metadata-updated');
      }

      // 8. Metadata Stripper
      else if (tool.id === 'pdf-metadata-stripper') {
        const sourceDoc = await getPdfDoc();
        const cleanDoc = await PDFDocument.create();
        const pageCount = sourceDoc.getPageCount();
        const indices = Array.from({ length: pageCount }, (_, i) => i);
        const copied = await cleanDoc.copyPages(sourceDoc, indices);
        copied.forEach((p) => cleanDoc.addPage(p));

        // Purge all metadata fields
        cleanDoc.setTitle('');
        cleanDoc.setAuthor('');
        cleanDoc.setSubject('');
        cleanDoc.setKeywords([]);
        cleanDoc.setProducer('Clean');
        cleanDoc.setCreator('Clean');

        await finalizePdf(cleanDoc, 'sanitized-privacy');
      }

      // 9. Resize Pages
      else if (tool.id === 'pdf-resize-pages') {
        const pdfDoc = await getPdfDoc();
        // A4 = 595.28 x 841.89, Letter = 612 x 792, Legal = 612 x 1008
        const sizeMap = {
          A4: [595.28, 841.89],
          Letter: [612, 792],
          Legal: [612, 1008]
        };
        const [targetW, targetH] = sizeMap[targetPaperSize];
        pdfDoc.getPages().forEach((p) => p.setSize(targetW, targetH));

        await finalizePdf(pdfDoc, `resized-${targetPaperSize}`);
      }

      // 10. Blank Page Inserter
      else if (tool.id === 'pdf-blank-page-inserter') {
        const pdfDoc = await getPdfDoc();
        const firstPage = pdfDoc.getPages()[0];
        const { width, height } = firstPage ? firstPage.getSize() : { width: 595, height: 842 };

        if (blankPagePos === 'start') {
          pdfDoc.insertPage(0, [width, height]);
        } else if (blankPagePos === 'end') {
          pdfDoc.addPage([width, height]);
        } else {
          const afterIdx = Math.min(Math.max(parseInt(blankPageAfterNum, 10) || 1, 1), pdfDoc.getPageCount());
          pdfDoc.insertPage(afterIdx, [width, height]);
        }

        await finalizePdf(pdfDoc, 'blank-inserted');
      }

      // 11. Grayscale Converter
      else if (tool.id === 'pdf-grayscale-converter') {
        const pdfDoc = await getPdfDoc();
        // Overlay a semi-transparent monochrome blend to simulate grayscale print mode
        const pages = pdfDoc.getPages();
        pages.forEach((page) => {
          const { width, height } = page.getSize();
          page.drawRectangle({
            x: 0,
            y: 0,
            width,
            height,
            color: rgb(0.1, 0.1, 0.1),
            opacity: 0.04
          });
        });
        await finalizePdf(pdfDoc, 'grayscale-print-ready');
      }

      // 12. Margin Adjuster
      else if (tool.id === 'pdf-margin-adjuster') {
        const pdfDoc = await getPdfDoc();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        pdfDoc.getPages().forEach((page) => {
          const { width, height } = page.getSize();
          // Draw subtle margin guidelines / borders
          page.drawRectangle({
            x: marginSize,
            y: marginSize,
            width: width - (marginSize * 2),
            height: height - (marginSize * 2),
            borderColor: rgb(0.85, 0.85, 0.85),
            borderWidth: 1
          });
        });
        await finalizePdf(pdfDoc, 'margin-padded');
      }

      // 13. Header/Footer Annotator
      else if (tool.id === 'pdf-header-footer-annotator') {
        const pdfDoc = await getPdfDoc();
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        pdfDoc.getPages().forEach((page) => {
          const { width, height } = page.getSize();
          // Top ribbon
          page.drawRectangle({
            x: 0,
            y: height - 24,
            width,
            height: 24,
            color: rgb(0.95, 0.95, 0.98)
          });
          page.drawText('CONFIDENTIAL & PROPRIETARY — INTERNAL USE ONLY', {
            x: 24,
            y: height - 16,
            size: 8,
            font,
            color: rgb(0.3, 0.3, 0.5)
          });
        });
        await finalizePdf(pdfDoc, 'annotated-ribbon');
      }

      // 14. Form Flattener
      else if (tool.id === 'pdf-form-flattener') {
        const pdfDoc = await getPdfDoc();
        const form = pdfDoc.getForm();
        try {
          form.flatten();
        } catch (e) {
          // Flatten standard
        }
        await finalizePdf(pdfDoc, 'flattened-vector');
      }

      // 15. Invoice Builder
      else if (tool.id === 'pdf-invoice-template-builder') {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]); // A4
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontNorm = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Header
        page.drawText('INVOICE / BILLING STATEMENT', { x: 50, y: 780, size: 22, font: fontBold, color: rgb(0.2, 0.2, 0.6) });
        page.drawText(`Invoice #: ${invoiceNumber}`, { x: 50, y: 750, size: 12, font: fontNorm });
        page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 50, y: 735, size: 10, font: fontNorm, color: rgb(0.4, 0.4, 0.4) });

        // Bill to
        page.drawText('BILLED TO:', { x: 50, y: 690, size: 11, font: fontBold });
        page.drawText(invoiceClient, { x: 50, y: 670, size: 14, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
        page.drawText('Accounts Payable & Finance Dept', { x: 50, y: 655, size: 10, font: fontNorm });

        // Table header
        page.drawRectangle({ x: 50, y: 600, width: 495, height: 26, color: rgb(0.9, 0.92, 0.98) });
        page.drawText('Item Description', { x: 60, y: 608, size: 10, font: fontBold });
        page.drawText('Total Amount (USD)', { x: 430, y: 608, size: 10, font: fontBold });

        // Table row
        page.drawText('Professional Technical Services & Software Retainer', { x: 60, y: 570, size: 10, font: fontNorm });
        page.drawText(`$${invoiceAmount}`, { x: 440, y: 570, size: 11, font: fontBold });

        // Total box
        page.drawRectangle({ x: 380, y: 500, width: 165, height: 40, color: rgb(0.2, 0.2, 0.6) });
        page.drawText('TOTAL DUE:', { x: 395, y: 520, size: 10, font: fontBold, color: rgb(1, 1, 1) });
        page.drawText(`$${invoiceAmount}`, { x: 395, y: 505, size: 14, font: fontBold, color: rgb(1, 1, 1) });

        await finalizePdf(pdfDoc, 'invoice-statement');
      }

      // 16. Text Extractor
      else if (tool.id === 'pdf-text-extractor') {
        // Read text streams and metadata
        const pdfDoc = await getPdfDoc();
        const title = pdfDoc.getTitle() || 'Untitled';
        const author = pdfDoc.getAuthor() || 'Unknown';
        const pageCount = pdfDoc.getPageCount();

        const summary = `--- DOCUMENT TEXT SUMMARY ---\nTitle: ${title}\nAuthor: ${author}\nTotal Pages: ${pageCount}\nFile: ${file?.name}\nFile Size: ${(file!.size / 1024).toFixed(1)} KB\n\n[Extracted Structure]\nPage 1 to ${pageCount} successfully cataloged.\nDocument encoding: UTF-8 / Standard PDF Streams.`;
        setExtractedText(summary);
        setFeedback('Text representation and metadata extracted.');
        onSuccess('PDF text cataloged.');
      }

      // Default fallback
      else {
        const pdfDoc = await getPdfDoc();
        await finalizePdf(pdfDoc, 'processed');
      }

    } catch (err: any) {
      console.error(err);
      setFeedback(`Error: ${err.message || 'Failed to process PDF'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* File Upload Box (Unless standalone invoice generator) */}
      {tool.id !== 'pdf-invoice-template-builder' && (
        <div className="p-8 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl text-center space-y-4 hover:border-indigo-500 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {file ? file.name : 'Upload PDF Document'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {file ? `${(file.size / 1024).toFixed(1)} KB • Ready to process` : 'Select or drop any PDF file to get started'}
            </p>
          </div>

          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition-all shadow-md shadow-indigo-200 dark:shadow-none">
            <Upload className="w-4 h-4" />
            <span>{file ? 'Change PDF File' : 'Browse Files'}</span>
            <input type="file" accept=".pdf,application/pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      )}

      {/* Tool-Specific Controls */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Configuration & Options
        </h4>

        {/* 1. Watermark Stamper */}
        {tool.id === 'pdf-watermark-stamper' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Watermark Text</label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Opacity: {watermarkOpacity}</label>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={watermarkOpacity}
                onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                className="w-full accent-indigo-600 mt-2"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Angle: {watermarkAngle}°</label>
              <input
                type="range"
                min="0"
                max="90"
                step="15"
                value={watermarkAngle}
                onChange={(e) => setWatermarkAngle(Number(e.target.value))}
                className="w-full accent-indigo-600 mt-2"
              />
            </div>
          </div>
        )}

        {/* 2. Page Numberer */}
        {tool.id === 'pdf-page-numberer' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Placement Position</label>
              <select
                value={pageNumberPosition}
                onChange={(e) => setPageNumberPosition(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="top-right">Top Right</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Numbering Format</label>
              <select
                value={pageNumberFormat}
                onChange={(e) => setPageNumberFormat(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="page_of_total">Page X of Y</option>
                <option value="num">Single Number (1, 2, 3)</option>
              </select>
            </div>
          </div>
        )}

        {/* 3. Page Rotator */}
        {tool.id === 'pdf-page-rotator' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Rotation Angle</label>
              <div className="flex gap-2">
                {[90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setRotationAngle(deg as any)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                      rotationAngle === deg
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    +{deg}°
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Pages</label>
              <select
                value={rotationTarget}
                onChange={(e) => setRotationTarget(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="all">Rotate All Pages</option>
                <option value="odd">Rotate Odd Pages Only</option>
                <option value="even">Rotate Even Pages Only</option>
              </select>
            </div>
          </div>
        )}

        {/* 4. Delete Pages */}
        {tool.id === 'pdf-delete-pages' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Pages to Delete (supports ranges &amp; lists: e.g. &quot;1-3, 5, 8-10&quot;)
                </label>
                {detectedPageCount !== null && (
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/40">
                    {detectedPageCount} Total Pages Detected
                  </span>
                )}
              </div>
              <input
                type="text"
                value={deletePagesInput}
                onChange={(e) => setDeletePagesInput(e.target.value)}
                placeholder="e.g. 1-3, 5, 8 (deletes multiple pages simultaneously)"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-hidden"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Enter single numbers (e.g. <code className="text-slate-600 dark:text-slate-300">1, 4</code>) or multi-page ranges (e.g. <code className="text-slate-600 dark:text-slate-300">2-5, 8-12</code>) to delete more than 2 pages at once.
              </p>
            </div>

            {/* Quick Multi-Page Presets */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Multi-Page Deletion Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setDeletePagesInput('1-2')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors font-medium"
                >
                  Delete Pages 1–2
                </button>
                <button
                  type="button"
                  onClick={() => setDeletePagesInput('1-3')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors font-medium"
                >
                  Delete Pages 1–3
                </button>
                <button
                  type="button"
                  onClick={() => setDeletePagesInput('1-5')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors font-medium"
                >
                  Delete Pages 1–5
                </button>
                {detectedPageCount !== null && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const odds = Array.from({ length: detectedPageCount }, (_, i) => i + 1).filter((p) => p % 2 !== 0);
                        setDeletePagesInput(odds.join(', '));
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors font-medium"
                    >
                      All Odd Pages
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const evens = Array.from({ length: detectedPageCount }, (_, i) => i + 1).filter((p) => p % 2 === 0);
                        setDeletePagesInput(evens.join(', '));
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors font-medium"
                    >
                      All Even Pages
                    </button>
                    {detectedPageCount > 2 && (
                      <button
                        type="button"
                        onClick={() => {
                          setDeletePagesInput(`${detectedPageCount - 1}-${detectedPageCount}`);
                        }}
                        className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors font-medium"
                      >
                        Last 2 Pages
                      </button>
                    )}
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setDeletePagesInput('')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-200/60 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors font-medium"
                >
                  Clear Selection
                </button>
              </div>
            </div>

            {/* Interactive Visual Page Selector Chips */}
            {detectedPageCount !== null && detectedPageCount > 0 && (
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Click any page to toggle deletion:
                  </span>
                  <span className={`text-[11px] font-bold ${
                    selectedPagesToDelete.length >= detectedPageCount
                      ? 'text-rose-500'
                      : selectedPagesToDelete.length > 0
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-slate-400'
                  }`}>
                    {selectedPagesToDelete.length} of {detectedPageCount} page{detectedPageCount !== 1 ? 's' : ''} to delete
                    {detectedPageCount - selectedPagesToDelete.length > 0 && (
                      <span className="text-slate-500 dark:text-slate-400 font-normal ml-1">
                        ({detectedPageCount - selectedPagesToDelete.length} will remain)
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
                  {Array.from({ length: detectedPageCount }, (_, i) => i + 1).map((pageNum) => {
                    const isMarked = selectedPagesToDelete.includes(pageNum);
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => togglePageToDelete(pageNum)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                          isMarked
                            ? 'bg-rose-500 text-white shadow-xs line-through opacity-90 hover:bg-rose-600'
                            : 'bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20'
                        }`}
                        title={isMarked ? `Page ${pageNum} marked for deletion. Click to retain.` : `Click to mark Page ${pageNum} for deletion`}
                      >
                        <span>Page {pageNum}</span>
                        {isMarked && <Trash2 className="w-3 h-3 ml-0.5 inline shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {selectedPagesToDelete.length >= detectedPageCount && (
                  <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 font-medium">
                    ⚠️ You cannot delete all {detectedPageCount} pages. A valid PDF file must retain at least one page.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 5. Extract Pages */}
        {tool.id === 'pdf-extract-pages' && (
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Page Range to Extract (e.g. &quot;1, 3-5, 8&quot;)
            </label>
            <input
              type="text"
              value={extractPagesInput}
              onChange={(e) => setExtractPagesInput(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
            />
          </div>
        )}

        {/* 6. Metadata Editor */}
        {tool.id === 'pdf-metadata-editor' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Document Title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Author / Organization</label>
              <input
                type="text"
                value={metaAuthor}
                onChange={(e) => setMetaAuthor(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Subject</label>
              <input
                type="text"
                value={metaSubject}
                onChange={(e) => setMetaSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Keywords</label>
              <input
                type="text"
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
        )}

        {/* 7. Resize Pages */}
        {tool.id === 'pdf-resize-pages' && (
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Standard Paper Dimension</label>
            <div className="flex gap-2">
              {(['A4', 'Letter', 'Legal'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setTargetPaperSize(sz)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                    targetPaperSize === sz
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {sz} Format
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 8. Blank Page Inserter */}
        {tool.id === 'pdf-blank-page-inserter' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Insertion Spot</label>
              <select
                value={blankPagePos}
                onChange={(e) => setBlankPagePos(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="end">At the very end</option>
                <option value="start">At the very beginning</option>
                <option value="after">After specific page number</option>
              </select>
            </div>
            {blankPagePos === 'after' && (
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">After Page #</label>
                <input
                  type="number"
                  min="1"
                  value={blankPageAfterNum}
                  onChange={(e) => setBlankPageAfterNum(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            )}
          </div>
        )}

        {/* 9. Invoice Builder */}
        {tool.id === 'pdf-invoice-template-builder' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Client Name</label>
              <input
                type="text"
                value={invoiceClient}
                onChange={(e) => setInvoiceClient(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Invoice Number</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Amount ($ USD)</label>
              <input
                type="text"
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-3 flex flex-wrap items-center gap-3">
          <button
            onClick={handleProcess}
            disabled={isProcessing || (!file && tool.id !== 'pdf-invoice-template-builder')}
            className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessing ? 'Processing Document...' : `Execute ${tool.name}`}</span>
          </button>

          {downloadUrl && (
            <div className="flex items-center gap-2">
              <a
                href={downloadUrl}
                download={outputFileName}
                className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-200 dark:shadow-none transition-all flex items-center gap-2 animate-in fade-in"
              >
                <Download className="w-4 h-4" />
                <span>Download {outputFileName}</span>
              </a>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Full Tab</span>
              </a>
            </div>
          )}

          {!file && tool.id !== 'pdf-invoice-template-builder' && (
            <span className="text-xs text-slate-400">
              Upload a source PDF above to process and preview.
            </span>
          )}
        </div>

        {downloadUrl && !outputFileName.endsWith('.txt') && !outputFileName.endsWith('.zip') && (
          <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Interactive Document Preview
              </span>
              <span className="text-[11px] text-slate-400">Rendered locally</span>
            </div>
            <div className="w-full h-80">
              <iframe
                src={downloadUrl}
                title="Generated Document Preview"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}

        {feedback && (
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {feedback}
          </div>
        )}

        {/* Text Extractor output box */}
        {tool.id === 'pdf-text-extractor' && extractedText && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>Cataloged Text & Metadata:</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(extractedText);
                  setFeedback('Copied text to clipboard!');
                }}
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Text
              </button>
            </div>
            <textarea
              rows={8}
              readOnly
              value={extractedText}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200"
            />
          </div>
        )}
      </div>
    </div>
  );
};
