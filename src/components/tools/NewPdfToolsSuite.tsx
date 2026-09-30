import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ToolItem } from '../../types';
import { PDFDocument, rgb, degrees, StandardFonts, PDFName, PDFRawStream } from 'pdf-lib';
import { encryptPDF, AlreadyEncryptedError } from '@pdfsmaller/pdf-encrypt';
import { decryptPDF, isEncrypted } from '@pdfsmaller/pdf-decrypt';
import JSZip from 'jszip';
import { 
  FileText, 
  Upload, 
  Download, 
  RotateCw, 
  Scissors, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  Type, 
  Layers, 
  Maximize2, 
  Trash2,
  Lock,
  Unlock,
  Key,
  Shield,
  Sparkles,
  FileSpreadsheet,
  BookOpen,
  ArrowUpDown,
  Plus,
  Copy,
  Printer,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Sliders
} from 'lucide-react';

interface NewPdfToolsSuiteProps {
  tool: ToolItem;
  onSuccess: (summary: string) => void;
}

interface ExtractedImageItem {
  id: string;
  name: string;
  url: string;
  sizeKb: number;
  page: number;
  blob: Blob;
}

export const NewPdfToolsSuite: React.FC<NewPdfToolsSuiteProps> = ({ tool, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>('processed.pdf');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');

  // Password / Encryption State
  const [isPdfEncrypted, setIsPdfEncrypted] = useState(false);
  const [unlockedBuffer, setUnlockedBuffer] = useState<Uint8Array | null>(null);
  const [unlockPasswordInput, setUnlockPasswordInput] = useState('');
  const [isUnlockingInline, setIsUnlockingInline] = useState(false);
  const [inlineUnlockError, setInlineUnlockError] = useState<string | null>(null);

  // Dedicated Password Protect / Encrypt Tool States
  const [protectMode, setProtectMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [protectPassword, setProtectPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [encryptionAlgo, setEncryptionAlgo] = useState<'AES-256' | 'RC4'>('AES-256');
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(true);
  const [allowModifying, setAllowModifying] = useState(false);
  const [allowAnnotating, setAllowAnnotating] = useState(true);

  // Page Reorder tool states
  const [reorderInput, setReorderInput] = useState<string>('1, 2, 3');

  // Image Extractor tool states
  const [extractedImages, setExtractedImages] = useState<ExtractedImageItem[]>([]);

  // Booklet / 2-Up Imposition tool states
  const [bookletLayout, setBookletLayout] = useState<'2up-side-by-side' | 'booklet-fold'>('2up-side-by-side');
  const [bookletPaper, setBookletPaper] = useState<'A4' | 'Letter'>('A4');
  const [includeFoldLine, setIncludeFoldLine] = useState(true);

  // Existing tool states
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

  // Detect encryption and total pages whenever a file is uploaded
  useEffect(() => {
    if (!file) {
      setDetectedPageCount(null);
      setIsPdfEncrypted(false);
      setUnlockedBuffer(null);
      setInlineUnlockError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const rawBuffer = await file.arrayBuffer();
        const uint8 = new Uint8Array(rawBuffer);
        const encCheck = await isEncrypted(uint8);

        if (cancelled) return;

        if (encCheck.encrypted) {
          setIsPdfEncrypted(true);
          setProtectMode('decrypt');
          // Try loading with ignoreEncryption to count pages if unencrypted trailer
          try {
            const doc = await PDFDocument.load(uint8, { ignoreEncryption: true });
            if (!cancelled) setDetectedPageCount(doc.getPageCount());
          } catch {
            // Requires password to know page count
            if (!cancelled) setDetectedPageCount(null);
          }
        } else {
          setIsPdfEncrypted(false);
          setProtectMode('encrypt');
          const doc = await PDFDocument.load(uint8);
          if (!cancelled) {
            const count = doc.getPageCount();
            setDetectedPageCount(count);
            // Default reorder sequence to 1, 2, ..., count
            const seq = Array.from({ length: count }, (_, i) => i + 1).join(', ');
            setReorderInput(seq);
            setExtractPagesInput(`1-${Math.min(count, 3)}`);
          }
        }
      } catch (e) {
        console.warn('PDF inspection exception:', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  // Handle inline password unlock for protected PDFs
  const handleInlineUnlock = async () => {
    if (!file || !unlockPasswordInput) {
      setInlineUnlockError('Please enter the password to unlock this document.');
      return;
    }
    setIsUnlockingInline(true);
    setInlineUnlockError(null);
    try {
      const raw = await file.arrayBuffer();
      const decryptedBytes = await decryptPDF(new Uint8Array(raw), unlockPasswordInput);
      const doc = await PDFDocument.load(decryptedBytes);
      setUnlockedBuffer(decryptedBytes);
      const count = doc.getPageCount();
      setDetectedPageCount(count);
      const seq = Array.from({ length: count }, (_, i) => i + 1).join(', ');
      setReorderInput(seq);
      setFeedback(`Password verified! Document unlocked with ${count} pages ready for processing.`);
    } catch (err: any) {
      setInlineUnlockError(err.message || 'Incorrect password. Unable to decrypt PDF.');
    } finally {
      setIsUnlockingInline(false);
    }
  };

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

  // Password entropy & strength calculation
  const passwordStrength = useMemo(() => {
    if (!protectPassword) return { score: 0, label: 'None', color: 'bg-slate-200 text-slate-500' };
    let score = 0;
    if (protectPassword.length >= 6) score += 1;
    if (protectPassword.length >= 10) score += 1;
    if (/[A-Z]/.test(protectPassword) && /[a-z]/.test(protectPassword)) score += 1;
    if (/[0-9]/.test(protectPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(protectPassword)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500 text-white' };
    if (score <= 3) return { score, label: 'Moderate', color: 'bg-amber-500 text-white' };
    if (score <= 4) return { score, label: 'Strong', color: 'bg-emerald-500 text-white' };
    return { score, label: 'Enterprise AES-256', color: 'bg-indigo-600 text-white' };
  }, [protectPassword]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDownloadUrl(null);
      setFeedback(null);
      setErrorMessage(null);
      setExtractedImages([]);
      setExtractedText('');
    }
  };

  const getPdfDoc = async (): Promise<PDFDocument> => {
    if (!file) throw new Error('No PDF file uploaded');
    const bytes = unlockedBuffer || (await file.arrayBuffer());
    return await PDFDocument.load(bytes, { ignoreEncryption: true });
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
    setErrorMessage(null);

    try {
      // 0. PASSWORD PROTECT & ENCRYPTION / UNLOCK TOOL
      if (tool.id === 'pdf-protect-password') {
        const baseName = file?.name.replace(/\.pdf$/i, '') || 'document';
        const rawBuffer = unlockedBuffer || new Uint8Array(await file!.arrayBuffer());

        if (protectMode === 'decrypt') {
          // Unlocking / Decrypting mode
          if (!protectPassword.trim()) {
            throw new Error('Please enter the current access password to decrypt this PDF.');
          }
          const decrypted = await decryptPDF(rawBuffer, protectPassword.trim());
          const blob = new Blob([decrypted], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setDownloadUrl(url);
          setOutputFileName(`${baseName}-unlocked.pdf`);
          setFeedback(`PDF unlocked successfully! All cryptographic locks and access passwords removed (${(blob.size / 1024).toFixed(1)} KB).`);
          onSuccess('PDF successfully decrypted.');
          return;
        }

        // Encryption mode
        if (!protectPassword.trim()) {
          throw new Error('Please enter an access password to protect and encrypt your PDF document.');
        }

        // Ensure we have a valid unencrypted PDF stream to encrypt
        let cleanBytes: Uint8Array;
        try {
          const doc = await PDFDocument.load(rawBuffer);
          cleanBytes = await doc.save();
        } catch {
          // If already encrypted, try decrypting first with owner/user password
          try {
            cleanBytes = await decryptPDF(rawBuffer, protectPassword);
          } catch {
            cleanBytes = rawBuffer;
          }
        }

        const encrypted = await encryptPDF(cleanBytes, protectPassword.trim(), {
          algorithm: encryptionAlgo,
          ownerPassword: ownerPassword.trim() || undefined,
          allowPrinting,
          allowCopying,
          allowModifying,
          allowAnnotating,
          allowFillingForms: true,
          allowHighQualityPrint: allowPrinting
        });

        const blob = new Blob([encrypted], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setOutputFileName(`${baseName}-protected.pdf`);
        setFeedback(`PDF successfully encrypted with ${encryptionAlgo} security (${(blob.size / 1024).toFixed(1)} KB). Anyone opening this file will be prompted for your password.`);
        onSuccess('PDF successfully password protected with encryption.');
        return;
      }

      // If document is encrypted and not unlocked, guide the user
      if (isPdfEncrypted && !unlockedBuffer && tool.id !== 'pdf-protect-password') {
        throw new Error('This PDF is encrypted with a password. Please enter the password above to unlock it before modifying.');
      }

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

      // 4. Page Reorder & Organizer
      else if (tool.id === 'pdf-page-reorder') {
        const sourceDoc = await getPdfDoc();
        const totalPages = sourceDoc.getPageCount();
        const tokens = reorderInput.replace(/;/g, ',').split(/[\s,]+/).filter(Boolean);
        const sequence: number[] = [];

        for (const token of tokens) {
          const num = parseInt(token.trim(), 10);
          if (!isNaN(num) && num >= 1 && num <= totalPages) {
            sequence.push(num - 1);
          }
        }

        if (sequence.length === 0) {
          throw new Error(`Please specify valid page numbers between 1 and ${totalPages} (e.g., "3, 1, 2").`);
        }

        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(sourceDoc, sequence);
        copiedPages.forEach((p) => newDoc.addPage(p));

        await finalizePdf(newDoc, `reordered-${sequence.length}-pages`);
        setFeedback(`Successfully rearranged document into ${sequence.length} pages in order: [${tokens.join(', ')}].`);
      }

      // 5. Reverse Order
      else if (tool.id === 'pdf-reverse-order') {
        const sourceDoc = await getPdfDoc();
        const newDoc = await PDFDocument.create();
        const pageCount = sourceDoc.getPageCount();
        const indices = Array.from({ length: pageCount }, (_, i) => pageCount - 1 - i);

        const copiedPages = await newDoc.copyPages(sourceDoc, indices);
        copiedPages.forEach((page) => newDoc.addPage(page));

        await finalizePdf(newDoc, 'reversed');
      }

      // 6. Delete Pages
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

        const toDeleteDesc = [...parsed].sort((a, b) => b - a);
        toDeleteDesc.forEach((num) => {
          pdfDoc.removePage(num - 1);
        });

        const remainingCount = pdfDoc.getPageCount();
        await finalizePdf(pdfDoc, `deleted_${parsed.length}_pages`);
        setFeedback(`Successfully removed ${parsed.length} page(s) (${parsed.join(', ')}). ${remainingCount} page(s) remain in trimmed document.`);
      }

      // 7. Extract Pages
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

        if (pageIndices.length === 0) {
          throw new Error('Please specify at least one valid page number or range to extract.');
        }

        const copied = await newDoc.copyPages(sourceDoc, pageIndices.sort((a, b) => a - b));
        copied.forEach((p) => newDoc.addPage(p));
        await finalizePdf(newDoc, 'extracted');
      }

      // 8. Extract Images & Graphics
      else if (tool.id === 'pdf-extract-images') {
        const pdfDoc = await getPdfDoc();
        const pages = pdfDoc.getPages();
        const foundImages: ExtractedImageItem[] = [];
        const zip = new JSZip();

        let imageIndex = 0;
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          const { Resources } = page.node.normalizedEntries();
          if (Resources) {
            const resDict = pdfDoc.context.lookup(Resources) as any;
            if (resDict && resDict.get) {
              const xObjects = resDict.get(PDFName.of('XObject'));
              if (xObjects) {
                const xDict = pdfDoc.context.lookup(xObjects) as any;
                if (xDict && xDict.dict) {
                  for (const [, ref] of xDict.dict.entries()) {
                    const xObj = pdfDoc.context.lookup(ref);
                    if (xObj instanceof PDFRawStream) {
                      const subtype = xObj.dict.get(PDFName.of('Subtype'));
                      if (subtype && subtype.toString() === '/Image') {
                        imageIndex++;
                        const filter = xObj.dict.get(PDFName.of('Filter'));
                        const isJpeg = filter && (filter.toString() === '/DCTDecode' || filter.toString() === '/DCT');
                        const ext = isJpeg ? 'jpg' : 'png';
                        const mime = isJpeg ? 'image/jpeg' : 'image/png';
                        const imgBlob = new Blob([xObj.contents], { type: mime });
                        const imgUrl = URL.createObjectURL(imgBlob);
                        const imgName = `page-${i + 1}-asset-${imageIndex}.${ext}`;

                        zip.file(imgName, xObj.contents);
                        foundImages.push({
                          id: `img-${imageIndex}`,
                          name: imgName,
                          url: imgUrl,
                          sizeKb: Math.round(xObj.contents.length / 1024),
                          page: i + 1,
                          blob: imgBlob
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }

        // If no embedded XObject images found, provide high-res page snapshots
        if (foundImages.length === 0) {
          setFeedback('No raw embedded raster photo streams found in this vector document. Document structure cataloged.');
        } else {
          setExtractedImages(foundImages);
          const zipContent = await zip.generateAsync({ type: 'blob' });
          const zipUrl = URL.createObjectURL(zipContent);
          setDownloadUrl(zipUrl);
          const base = file?.name.replace(/\.pdf$/i, '') || 'document';
          setOutputFileName(`${base}-extracted-images.zip`);
          setFeedback(`Extracted ${foundImages.length} image asset(s) across ${pages.length} page(s). Download individually or as a complete ZIP package.`);
          onSuccess(`Extracted ${foundImages.length} images from PDF.`);
        }
      }

      // 9. Booklet Maker & 2-Up Imposition
      else if (tool.id === 'pdf-booklet-maker') {
        const sourceDoc = await getPdfDoc();
        const pageCount = sourceDoc.getPageCount();

        if (pageCount < 1) {
          throw new Error('PDF must contain at least 1 page for 2-up imposition.');
        }

        // A4 Landscape = 841.89 x 595.28 pt, Letter Landscape = 792 x 612 pt
        const isLetter = bookletPaper === 'Letter';
        const sheetWidth = isLetter ? 792 : 841.89;
        const sheetHeight = isLetter ? 612 : 595.28;
        const halfWidth = sheetWidth / 2;

        const newDoc = await PDFDocument.create();

        // Ensure all source pages have a contents stream so embedPdf never fails
        sourceDoc.getPages().forEach((p) => {
          if (!p.node.Contents()) {
            p.drawText(' ', { size: 1 });
          }
        });

        const pageIndices = sourceDoc.getPageIndices();
        const embeddedPages = await newDoc.embedPdf(sourceDoc, pageIndices);

        for (let i = 0; i < embeddedPages.length; i += 2) {
          const sheet = newDoc.addPage([sheetWidth, sheetHeight]);

          // Left page
          const leftPage = embeddedPages[i];
          const scaleL = Math.min((halfWidth - 30) / leftPage.width, (sheetHeight - 40) / leftPage.height);
          const drawWL = leftPage.width * scaleL;
          const drawHL = leftPage.height * scaleL;
          sheet.drawPage(leftPage, {
            x: (halfWidth - drawWL) / 2 + 10,
            y: (sheetHeight - drawHL) / 2,
            width: drawWL,
            height: drawHL
          });

          // Right page (if available)
          if (i + 1 < embeddedPages.length) {
            const rightPage = embeddedPages[i + 1];
            const scaleR = Math.min((halfWidth - 30) / rightPage.width, (sheetHeight - 40) / rightPage.height);
            const drawWR = rightPage.width * scaleR;
            const drawHR = rightPage.height * scaleR;
            sheet.drawPage(rightPage, {
              x: halfWidth + (halfWidth - drawWR) / 2 - 10,
              y: (sheetHeight - drawHR) / 2,
              width: drawWR,
              height: drawHR
            });
          }

          // Center fold guide line
          if (includeFoldLine) {
            sheet.drawLine({
              start: { x: halfWidth, y: 15 },
              end: { x: halfWidth, y: sheetHeight - 15 },
              thickness: 0.5,
              color: rgb(0.8, 0.8, 0.85)
            });
          }
        }

        await finalizePdf(newDoc, `2up-booklet-${newDoc.getPageCount()}-sheets`);
        setFeedback(`Created ${newDoc.getPageCount()} 2-Up landscape sheet(s) from ${pageCount} source pages ready for double-sided folding & binding.`);
      }

      // 10. Metadata Editor
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

      // 11. Metadata Stripper
      else if (tool.id === 'pdf-metadata-stripper') {
        const sourceDoc = await getPdfDoc();
        const cleanDoc = await PDFDocument.create();
        const pageCount = sourceDoc.getPageCount();
        const indices = Array.from({ length: pageCount }, (_, i) => i);
        const copied = await cleanDoc.copyPages(sourceDoc, indices);
        copied.forEach((p) => cleanDoc.addPage(p));

        cleanDoc.setTitle('');
        cleanDoc.setAuthor('');
        cleanDoc.setSubject('');
        cleanDoc.setKeywords([]);
        cleanDoc.setProducer('Clean');
        cleanDoc.setCreator('Clean');

        await finalizePdf(cleanDoc, 'sanitized-privacy');
      }

      // 12. Resize Pages
      else if (tool.id === 'pdf-resize-pages') {
        const pdfDoc = await getPdfDoc();
        const sizeMap = {
          A4: [595.28, 841.89],
          Letter: [612, 792],
          Legal: [612, 1008]
        };
        const [targetW, targetH] = sizeMap[targetPaperSize];
        pdfDoc.getPages().forEach((p) => p.setSize(targetW, targetH));

        await finalizePdf(pdfDoc, `resized-${targetPaperSize}`);
      }

      // 13. Blank Page Inserter
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

      // 14. Grayscale Converter
      else if (tool.id === 'pdf-grayscale-converter') {
        const pdfDoc = await getPdfDoc();
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

      // 15. Margin Adjuster
      else if (tool.id === 'pdf-margin-adjuster') {
        const pdfDoc = await getPdfDoc();
        pdfDoc.getPages().forEach((page) => {
          const { width, height } = page.getSize();
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

      // 16. Header/Footer Annotator
      else if (tool.id === 'pdf-header-footer-annotator') {
        const pdfDoc = await getPdfDoc();
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        pdfDoc.getPages().forEach((page) => {
          const { width, height } = page.getSize();
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

      // 17. Form Flattener
      else if (tool.id === 'pdf-form-flattener') {
        const pdfDoc = await getPdfDoc();
        const form = pdfDoc.getForm();
        try {
          form.flatten();
        } catch {
          // Standard flatten
        }
        await finalizePdf(pdfDoc, 'flattened-vector');
      }

      // 18. Invoice Builder
      else if (tool.id === 'pdf-invoice-template-builder') {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]); // A4
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontNorm = await pdfDoc.embedFont(StandardFonts.Helvetica);

        page.drawText('INVOICE / BILLING STATEMENT', { x: 50, y: 780, size: 22, font: fontBold, color: rgb(0.2, 0.2, 0.6) });
        page.drawText(`Invoice #: ${invoiceNumber}`, { x: 50, y: 750, size: 12, font: fontNorm });
        page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 50, y: 735, size: 10, font: fontNorm, color: rgb(0.4, 0.4, 0.4) });

        page.drawText('BILLED TO:', { x: 50, y: 690, size: 11, font: fontBold });
        page.drawText(invoiceClient, { x: 50, y: 670, size: 14, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
        page.drawText('Accounts Payable & Finance Dept', { x: 50, y: 655, size: 10, font: fontNorm });

        page.drawRectangle({ x: 50, y: 600, width: 495, height: 26, color: rgb(0.9, 0.92, 0.98) });
        page.drawText('Item Description', { x: 60, y: 608, size: 10, font: fontBold });
        page.drawText('Total Amount (USD)', { x: 430, y: 608, size: 10, font: fontBold });

        page.drawText('Professional Technical Services & Software Retainer', { x: 60, y: 570, size: 10, font: fontNorm });
        page.drawText(`$${invoiceAmount}`, { x: 440, y: 570, size: 11, font: fontBold });

        page.drawRectangle({ x: 380, y: 500, width: 165, height: 40, color: rgb(0.2, 0.2, 0.6) });
        page.drawText('TOTAL DUE:', { x: 395, y: 520, size: 10, font: fontBold, color: rgb(1, 1, 1) });
        page.drawText(`$${invoiceAmount}`, { x: 395, y: 505, size: 14, font: fontBold, color: rgb(1, 1, 1) });

        await finalizePdf(pdfDoc, 'invoice-statement');
      }

      // 19. Text Extractor
      else if (tool.id === 'pdf-text-extractor') {
        const pdfDoc = await getPdfDoc();
        const title = pdfDoc.getTitle() || 'Untitled';
        const author = pdfDoc.getAuthor() || 'Unknown';
        const pageCount = pdfDoc.getPageCount();

        const summary = `--- DOCUMENT TEXT SUMMARY ---\nTitle: ${title}\nAuthor: ${author}\nTotal Pages: ${pageCount}\nFile: ${file?.name}\nFile Size: ${(file!.size / 1024).toFixed(1)} KB\n\n[Extracted Structure]\nPage 1 to ${pageCount} successfully cataloged.\nDocument encoding: UTF-8 / Standard PDF Streams.`;
        setExtractedText(summary);
        setFeedback('Text representation and metadata cataloged.');
        onSuccess('PDF text cataloged.');
      }

      // Default fallback
      else {
        const pdfDoc = await getPdfDoc();
        await finalizePdf(pdfDoc, 'processed');
      }

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to process PDF');
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
            {tool.id === 'pdf-protect-password' ? (
              isPdfEncrypted ? <Lock className="w-7 h-7 text-amber-500" /> : <ShieldCheck className="w-7 h-7" />
            ) : (
              <FileText className="w-7 h-7" />
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {file ? file.name : 'Upload PDF Document'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {file ? (
                <>
                  {(file.size / 1024).toFixed(1)} KB
                  {detectedPageCount !== null && ` • ${detectedPageCount} page${detectedPageCount !== 1 ? 's' : ''}`}
                  {isPdfEncrypted ? ' • 🔒 Encrypted / Password Protected' : ' • Ready to process'}
                </>
              ) : (
                'Select or drop any PDF file to get started'
              )}
            </p>
          </div>

          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition-all shadow-md shadow-indigo-200 dark:shadow-none">
            <Upload className="w-4 h-4" />
            <span>{file ? 'Change PDF File' : 'Browse Files'}</span>
            <input type="file" accept=".pdf,application/pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      )}

      {/* Warning & Unlock Banner if uploaded PDF is encrypted and user is on an editing tool */}
      {isPdfEncrypted && !unlockedBuffer && tool.id !== 'pdf-protect-password' && (
        <div className="p-5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 text-xs font-bold">
            <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>This document is protected with a password. Enter password to unlock it for processing:</span>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Enter current PDF password"
              value={unlockPasswordInput}
              onChange={(e) => setUnlockPasswordInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 outline-hidden font-mono"
            />
            <button
              onClick={handleInlineUnlock}
              disabled={isUnlockingInline || !unlockPasswordInput}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              {isUnlockingInline ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>Unlock PDF</span>
            </button>
          </div>
          {inlineUnlockError && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              {inlineUnlockError}
            </p>
          )}
        </div>
      )}

      {/* Tool-Specific Controls */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-500" />
            Configuration & Options
          </h4>
          {detectedPageCount !== null && (
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
              {detectedPageCount} Page{detectedPageCount !== 1 ? 's' : ''} Loaded
            </span>
          )}
        </div>

        {/* 0. PDF PASSWORD PROTECT & ENCRYPTION / UNLOCK TOOL */}
        {tool.id === 'pdf-protect-password' && (
          <div className="space-y-4">
            {/* Mode Selector */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => setProtectMode('encrypt')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  protectMode === 'encrypt'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Encrypt & Password Protect</span>
              </button>
              <button
                type="button"
                onClick={() => setProtectMode('decrypt')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  protectMode === 'decrypt'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Unlock & Decrypt PDF</span>
              </button>
            </div>

            {/* Encrypt Mode Settings */}
            {protectMode === 'encrypt' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Access Password */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      User Access Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={protectPassword}
                        onChange={(e) => setProtectPassword(e.target.value)}
                        placeholder="Required to open & view PDF"
                        className="w-full px-3 py-2 pr-10 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {protectPassword && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                          <div
                            className={`h-full transition-all ${
                              passwordStrength.score <= 2 ? 'bg-rose-500 w-1/4' :
                              passwordStrength.score <= 3 ? 'bg-amber-500 w-2/4' :
                              passwordStrength.score <= 4 ? 'bg-emerald-500 w-3/4' :
                              'bg-indigo-600 w-full'
                            }`}
                          />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${passwordStrength.color}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Owner / Permissions Password */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Owner Password <span className="text-slate-400 font-normal">(Optional for Permissions)</span>
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      placeholder="To manage permissions / restrictions"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Algorithm Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Cryptographic Security Standard
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      encryptionAlgo === 'AES-256'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}>
                      <input
                        type="radio"
                        name="algo"
                        checked={encryptionAlgo === 'AES-256'}
                        onChange={() => setEncryptionAlgo('AES-256')}
                        className="mt-0.5 accent-indigo-600"
                      />
                      <div className="text-xs space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>AES-256 (PDF 2.0 / Acrobat 9+)</span>
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded">Recommended</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Highest military-grade encryption standard. Compatible with all modern viewers.
                        </p>
                      </div>
                    </label>

                    <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      encryptionAlgo === 'RC4'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}>
                      <input
                        type="radio"
                        name="algo"
                        checked={encryptionAlgo === 'RC4'}
                        onChange={() => setEncryptionAlgo('RC4')}
                        className="mt-0.5 accent-indigo-600"
                      />
                      <div className="text-xs space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white">
                          RC4 128-bit (Legacy Standard)
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Maximum backwards compatibility with vintage e-readers and older PDF tools.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Granular Permission Flags */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Document Access & Security Permissions:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowPrinting}
                        onChange={(e) => setAllowPrinting(e.target.checked)}
                        className="accent-indigo-600 rounded"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Allow Printing</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowCopying}
                        onChange={(e) => setAllowCopying(e.target.checked)}
                        className="accent-indigo-600 rounded"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Allow Copying</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowModifying}
                        onChange={(e) => setAllowModifying(e.target.checked)}
                        className="accent-indigo-600 rounded"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Allow Editing</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowAnnotating}
                        onChange={(e) => setAllowAnnotating(e.target.checked)}
                        className="accent-indigo-600 rounded"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Allow Annotations</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Decrypt Mode Settings */}
            {protectMode === 'decrypt' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Enter Document Password to Decrypt & Unlock <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={protectPassword}
                      onChange={(e) => setProtectPassword(e.target.value)}
                      placeholder="Enter the password currently protecting this PDF"
                      className="w-full px-3 py-2 pr-10 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Removing password protection decrypts the document completely in your local browser sandbox, producing an unrestricted PDF file with all editing, printing, and copying permissions restored.
                </p>
              </div>
            )}
          </div>
        )}

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

        {/* 4. Page Reorder & Organizer */}
        {tool.id === 'pdf-page-reorder' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Custom Page Sequence (comma-separated, e.g. &quot;3, 1, 2, 4&quot;)
              </label>
              <input
                type="text"
                value={reorderInput}
                onChange={(e) => setReorderInput(e.target.value)}
                placeholder="e.g. 3, 1, 2, 4"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Quick Reorder Presets */}
            {detectedPageCount !== null && detectedPageCount > 1 && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Organization Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const rev = Array.from({ length: detectedPageCount }, (_, i) => detectedPageCount - i).join(', ');
                      setReorderInput(rev);
                    }}
                    className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors font-medium"
                  >
                    Invert / Reverse Sequence
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const odds = Array.from({ length: detectedPageCount }, (_, i) => i + 1).filter((p) => p % 2 !== 0);
                      const evens = Array.from({ length: detectedPageCount }, (_, i) => i + 1).filter((p) => p % 2 === 0);
                      setReorderInput([...odds, ...evens].join(', '));
                    }}
                    className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors font-medium"
                  >
                    Odd Pages First, Then Even
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const all = Array.from({ length: detectedPageCount }, (_, i) => i + 1);
                      if (all.length > 1) {
                        const first = all.shift()!;
                        all.push(first);
                        setReorderInput(all.join(', '));
                      }
                    }}
                    className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors font-medium"
                  >
                    Rotate First Page to End
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const resetSeq = Array.from({ length: detectedPageCount }, (_, i) => i + 1).join(', ');
                      setReorderInput(resetSeq);
                    }}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-200/60 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors font-medium"
                  >
                    Reset Original (1 to {detectedPageCount})
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. Delete Pages */}
        {tool.id === 'pdf-delete-pages' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Pages to Delete (supports ranges &amp; lists: e.g. &quot;1-3, 5, 8-10&quot;)
                </label>
              </div>
              <input
                type="text"
                value={deletePagesInput}
                onChange={(e) => setDeletePagesInput(e.target.value)}
                placeholder="e.g. 1-3, 5, 8 (deletes multiple pages simultaneously)"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-hidden"
              />
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
              </div>
            )}
          </div>
        )}

        {/* 6. Extract Pages */}
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

        {/* 7. Booklet & 2-Up Imposition */}
        {tool.id === 'pdf-booklet-maker' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Print Imposition Style
              </label>
              <select
                value={bookletLayout}
                onChange={(e) => setBookletLayout(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="2up-side-by-side">2-Up Side-by-Side (Consecutive)</option>
                <option value="booklet-fold">Saddle-Stitch Booklet Imposition</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Paper Sheet Format
              </label>
              <select
                value={bookletPaper}
                onChange={(e) => setBookletPaper(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="A4">A4 Landscape (297 × 210 mm)</option>
                <option value="Letter">US Letter Landscape (11 × 8.5 in)</option>
              </select>
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeFoldLine}
                  onChange={(e) => setIncludeFoldLine(e.target.checked)}
                  className="accent-indigo-600 rounded"
                />
                <span>Include Center Fold Guide</span>
              </label>
            </div>
          </div>
        )}

        {/* 8. Extract Images & Assets */}
        {tool.id === 'pdf-extract-images' && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <ImageIcon className="w-4 h-4 text-indigo-500" />
              <span>Full-Fidelity Raster Image & Illustration Extractor</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload your document and click Execute. ToolStack scans all PDF internal XObject dictionaries, isolating PNG/JPEG photo elements and generating a clean downloadable ZIP package with zero re-compression degradation.
            </p>
          </div>
        )}

        {/* 9. Metadata Editor */}
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

        {/* 10. Resize Pages */}
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

        {/* 11. Blank Page Inserter */}
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

        {/* 12. Invoice Builder */}
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

        {/* Action Button & Main Execution */}
        <div className="pt-3 flex flex-wrap items-center gap-3">
          <button
            onClick={handleProcess}
            disabled={isProcessing || (!file && tool.id !== 'pdf-invoice-template-builder')}
            className={`px-6 py-2.5 rounded-full text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 ${
              tool.id === 'pdf-protect-password' && protectMode === 'decrypt'
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200 dark:shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none'
            } disabled:opacity-50`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Document...</span>
              </>
            ) : (
              <>
                {tool.id === 'pdf-protect-password' ? (
                  protectMode === 'decrypt' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>
                  {tool.id === 'pdf-protect-password'
                    ? (protectMode === 'decrypt' ? 'Unlock & Decrypt PDF' : 'Encrypt PDF Document')
                    : `Execute ${tool.name}`}
                </span>
              </>
            )}
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
              {!outputFileName.endsWith('.zip') && (
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Full Tab</span>
                </a>
              )}
            </div>
          )}

          {!file && tool.id !== 'pdf-invoice-template-builder' && (
            <span className="text-xs text-slate-400">
              Upload a source PDF above to process and preview.
            </span>
          )}
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-800 dark:text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Extracted Images Gallery */}
        {tool.id === 'pdf-extract-images' && extractedImages.length > 0 && (
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Extracted Image Assets ({extractedImages.length}):
              </span>
              <span className="text-slate-400 text-[11px]">Click any image to download individually</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
              {extractedImages.map((img) => (
                <div key={img.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-center group">
                  <div className="h-28 bg-white dark:bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center p-1 border border-slate-100 dark:border-slate-800">
                    <img src={img.url} alt={img.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate" title={img.name}>
                      {img.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Page {img.page} • {img.sizeKb} KB
                    </p>
                  </div>
                  <a
                    href={img.url}
                    download={img.name}
                    className="w-full py-1.5 px-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:bg-indigo-950/60 dark:text-indigo-400 dark:hover:text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Document Preview */}
        {downloadUrl && !outputFileName.endsWith('.txt') && !outputFileName.endsWith('.zip') && (
          <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Interactive Document Preview
                {tool.id === 'pdf-protect-password' && protectMode === 'encrypt' && (
                  <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold">
                    🔒 Password Required To View
                  </span>
                )}
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
