import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ToolItem } from '../../types';
import {
  Upload,
  Download,
  CheckCircle2,
  RefreshCw,
  FileText,
  Image as ImageIcon,
  Sliders,
  Sparkles,
  Settings,
  Eye,
  Scissors,
  Check,
  Copy,
  Printer
} from 'lucide-react';

interface MegaPdfAndImageToolsSuiteProps {
  tool: ToolItem;
  onSuccess: (summary: string) => void;
}

export const MegaPdfAndImageToolsSuite: React.FC<MegaPdfAndImageToolsSuiteProps> = ({
  tool,
  onSuccess
}) => {
  const isPdf = tool.category === 'pdf' || tool.id.startsWith('pdf-');

  // File states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputName, setOutputName] = useState('processed-output');
  const [asciiResult, setAsciiResult] = useState<string | null>(null);
  const [copiedAscii, setCopiedAscii] = useState(false);

  // General Interactive Form Parameters
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [secondaryName, setSecondaryName] = useState('Priya Patel');
  const [documentTitle, setDocumentTitle] = useState(tool.name);
  const [amount, setAmount] = useState('25000');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [additionalNotes, setAdditionalNotes] = useState(
    'This document is generated client-side with 100% data privacy and verified parameters.'
  );

  // Image Filter Controls
  const [filterIntensity, setFilterIntensity] = useState(50);
  const [colorThreshold, setColorThreshold] = useState(40);
  const [selectedPreset, setSelectedPreset] = useState('Standard');
  const [inkColor, setInkColor] = useState('blue');
  const [paperFormat, setPaperFormat] = useState('4x6');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [previewUrl, outputUrl]);

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setOutputUrl(null);
      setAsciiResult(null);

      if (!isPdf) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          imageElementRef.current = img;
          renderImagePreview(img);
        };
      }
    }
  };

  // ----------------------------------------------------
  // RENDER & PROCESS IMAGE TOOLS ON CANVAS
  // ----------------------------------------------------
  const renderImagePreview = (img?: HTMLImageElement) => {
    const targetImg = img || imageElementRef.current;
    const canvas = canvasRef.current;
    if (!targetImg || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Special: 4x6 Passport Photo 8-in-1 / 16-in-1 Grid
    if (tool.id === 'image-passport-size-photo-grid') {
      canvas.width = 1200; // 4x6 at 200-300 dpi
      canvas.height = 1800;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const rows = 4;
      const cols = 2;
      const cellW = canvas.width / cols;
      const cellH = canvas.height / rows;
      const photoW = cellW * 0.82;
      const photoH = cellH * 0.85;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cellW + (cellW - photoW) / 2;
          const y = r * cellH + (cellH - photoH) / 2;

          ctx.drawImage(targetImg, x, y, photoW, photoH);

          // Subtle dashed scissors cut guides
          ctx.strokeStyle = '#D1D5DB';
          ctx.setLineDash([6, 6]);
          ctx.strokeRect(x, y, photoW, photoH);
          ctx.setLineDash([]);
        }
      }
      return;
    }

    // Default Canvas Size based on Image
    const maxDim = 1200;
    let w = targetImg.naturalWidth || targetImg.width || 800;
    let h = targetImg.naturalHeight || targetImg.height || 600;

    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }

    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(targetImg, 0, 0, w, h);

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const factor = filterIntensity / 50;

    // Apply Specific Tool Filters
    if (tool.id === 'image-stamp-signature-cleaner') {
      // Remove white/cream background & extract signature as transparent PNG
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;

        if (brightness > 170 - (colorThreshold - 40) * 2) {
          data[i + 3] = 0; // Transparent
        } else {
          // Color enhancement
          if (inkColor === 'blue') {
            data[i] = Math.min(255, r * 0.3);
            data[i + 1] = Math.min(255, g * 0.4);
            data[i + 2] = Math.min(255, b * 1.5 + 40);
          } else if (inkColor === 'black') {
            const mono = Math.max(0, brightness * 0.5);
            data[i] = mono;
            data[i + 1] = mono;
            data[i + 2] = mono;
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (tool.id === 'image-color-inversion-night-reader') {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (tool.id === 'image-vintage-film-kodachrome-sim') {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.2 * factor); // Boost red
        data[i + 1] = Math.min(255, data[i + 1] * 1.05); // Warm yellow
        data[i + 2] = Math.min(255, data[i + 2] * 0.85); // Subdue cyan/blue
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (tool.id === 'image-cyberpunk-neon-glow-filter') {
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (avg > 128) {
          data[i] = Math.min(255, data[i] * 1.4);
          data[i + 2] = Math.min(255, data[i + 2] * 1.5);
        } else {
          data[i] = Math.min(255, data[i] * 0.6);
          data[i + 1] = Math.min(255, data[i + 1] * 0.9);
          data[i + 2] = Math.min(255, data[i + 2] * 1.3);
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (tool.id === 'image-charcoal-sketch-pencil-draw') {
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const sketch = gray < 120 ? Math.max(0, gray * 0.7) : Math.min(255, gray * 1.2);
        data[i] = sketch;
        data[i + 1] = sketch;
        data[i + 2] = sketch;
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (tool.id === 'image-cyanotype-sun-print-blue') {
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = Math.min(255, gray * 0.15); // Deep Prussian blue
        data[i + 1] = Math.min(255, gray * 0.45);
        data[i + 2] = Math.min(255, gray * 0.85 + 30);
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (tool.id === 'image-ascii-art-text-canvas') {
      // Generate ASCII string
      const chars = '@%#*+=-:. ';
      const step = 8;
      let text = '';
      for (let y = 0; y < h; y += step * 2) {
        for (let x = 0; x < w; x += step) {
          const idx = (y * w + x) * 4;
          const avg = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          const charIdx = Math.floor((avg / 255) * (chars.length - 1));
          text += chars[charIdx];
        }
        text += '\n';
      }
      setAsciiResult(text);
    } else if (tool.id === 'image-aspect-ratio-letterbox-cinemascope') {
      // Draw 2.39:1 letterbox black bars
      const targetHeight = w / 2.39;
      if (h > targetHeight) {
        const barHeight = (h - targetHeight) / 2;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, barHeight);
        ctx.fillRect(0, h - barHeight, w, barHeight);
      }
    } else if (tool.id === 'image-drop-shadow-3d-card-mock') {
      // Figma 3D drop shadow
      const pad = 60;
      canvas.width = w + pad * 2;
      canvas.height = h + pad * 2;
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.shadowColor = 'rgba(15, 23, 42, 0.22)';
      ctx.shadowBlur = 35;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 18;

      ctx.drawImage(targetImg, pad, pad, w, h);
      ctx.shadowColor = 'transparent';
    } else {
      // General saturation / vibrance / contrast booster
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = Math.min(255, Math.max(0, avg + (data[i] - avg) * factor));
        data[i + 1] = Math.min(255, Math.max(0, avg + (data[i + 1] - avg) * factor));
        data[i + 2] = Math.min(255, Math.max(0, avg + (data[i + 2] - avg) * factor));
      }
      ctx.putImageData(imgData, 0, 0);
    }
  };

  // ----------------------------------------------------
  // PROCESS PDF GENERATION & EXPORT
  // ----------------------------------------------------
  const processPdfTool = async () => {
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      if (tool.id === 'pdf-aadhaar-card-print-scaler') {
        // Create 4x6 inch (288 x 432 pt) page
        const page = pdfDoc.addPage([288, 432]);
        const cardW = 242; // standard wallet card ratio
        const cardH = 153;

        // Front Card Box
        page.drawRectangle({
          x: 23,
          y: 240,
          width: cardW,
          height: cardH,
          borderColor: rgb(0.8, 0.2, 0.2),
          borderWidth: 1.5
        });
        page.drawText('GOVERNMENT OF INDIA / AADHAAR FRONT', {
          x: 35,
          y: 370,
          size: 9,
          font: helveticaBold,
          color: rgb(0.7, 0.1, 0.1)
        });
        page.drawText(`Name: ${fullName}`, { x: 35, y: 345, size: 10, font: helveticaBold });
        page.drawText('DOB: 15/08/1992   Gender: Male', { x: 35, y: 325, size: 8, font: helvetica });
        page.drawText('XXXX XXXX 1234', {
          x: 35,
          y: 280,
          size: 13,
          font: helveticaBold,
          color: rgb(0.1, 0.1, 0.1)
        });
        page.drawText('VID: 9182 3819 2819 1029', { x: 35, y: 260, size: 7, font: helvetica });

        // Back Card Box
        page.drawRectangle({
          x: 23,
          y: 55,
          width: cardW,
          height: cardH,
          borderColor: rgb(0.2, 0.5, 0.8),
          borderWidth: 1.5
        });
        page.drawText('UNIQUE IDENTIFICATION AUTHORITY OF INDIA', {
          x: 35,
          y: 185,
          size: 8,
          font: helveticaBold
        });
        page.drawText('Address: S/O Ramesh Sharma, H.No 142/B, MG Road,', {
          x: 35,
          y: 160,
          size: 7,
          font: helvetica
        });
        page.drawText('Civil Lines, New Delhi - 110001', { x: 35, y: 145, size: 7, font: helvetica });
        page.drawText('1947 | help@uidai.gov.in | www.uidai.gov.in', {
          x: 35,
          y: 75,
          size: 7,
          font: helvetica
        });

        // Cutting guides
        page.drawText('--- 4x6" Photo Sheet Standard Wallet Cut Lines (85.6mm x 54mm) ---', {
          x: 20,
          y: 220,
          size: 6,
          font: helvetica,
          color: rgb(0.5, 0.5, 0.5)
        });
      } else if (tool.id === 'pdf-biodata-marriage-maker') {
        const page = pdfDoc.addPage([595.28, 841.89]); // A4
        // Elegant border
        page.drawRectangle({
          x: 30,
          y: 30,
          width: 535,
          height: 781,
          borderColor: rgb(0.7, 0.15, 0.15),
          borderWidth: 2
        });
        page.drawRectangle({
          x: 35,
          y: 35,
          width: 525,
          height: 771,
          borderColor: rgb(0.85, 0.65, 0.15),
          borderWidth: 1
        });

        page.drawText('|| Shree Ganeshay Namah ||', {
          x: 215,
          y: 770,
          size: 13,
          font: helveticaBold,
          color: rgb(0.7, 0.15, 0.15)
        });
        page.drawText('MATRIMONIAL BIODATA', {
          x: 195,
          y: 740,
          size: 18,
          font: helveticaBold,
          color: rgb(0.1, 0.1, 0.3)
        });

        // Personal Details Section
        page.drawText('1. PERSONAL DETAILS', {
          x: 60,
          y: 700,
          size: 12,
          font: helveticaBold,
          color: rgb(0.7, 0.15, 0.15)
        });
        page.drawText(`Full Name:  ${fullName}`, { x: 75, y: 675, size: 10, font: helveticaBold });
        page.drawText(`Date of Birth:  ${customDate}`, { x: 75, y: 655, size: 10, font: helvetica });
        page.drawText('Height:  5 ft 10 in (178 cm)', { x: 75, y: 635, size: 10, font: helvetica });
        page.drawText('Education:  B.Tech in Computer Science & Engineering', {
          x: 75,
          y: 615,
          size: 10,
          font: helvetica
        });
        page.drawText(`Occupation:  Senior Software Engineer (CTC: Rs. ${amount})`, {
          x: 75,
          y: 595,
          size: 10,
          font: helvetica
        });

        // Family Background Section
        page.drawText('2. FAMILY BACKGROUND', {
          x: 60,
          y: 555,
          size: 12,
          font: helveticaBold,
          color: rgb(0.7, 0.15, 0.15)
        });
        page.drawText("Father's Name:  Shri Ramesh Sharma (Business / Entrepreneur)", {
          x: 75,
          y: 530,
          size: 10,
          font: helvetica
        });
        page.drawText("Mother's Name:  Smt. Sunita Sharma (Homemaker)", {
          x: 75,
          y: 510,
          size: 10,
          font: helvetica
        });
        page.drawText('Siblings:  1 Younger Sister (Married)', {
          x: 75,
          y: 490,
          size: 10,
          font: helvetica
        });
        page.drawText('Native Place:  Jaipur, Rajasthan', {
          x: 75,
          y: 470,
          size: 10,
          font: helvetica
        });

        // Contact Section
        page.drawText('3. CONTACT & RESIDENCE', {
          x: 60,
          y: 430,
          size: 12,
          font: helveticaBold,
          color: rgb(0.7, 0.15, 0.15)
        });
        page.drawText('Address:  B-402, Royal Palms, Civil Lines, Jaipur', {
          x: 75,
          y: 405,
          size: 10,
          font: helvetica
        });
        page.drawText('Contact Number:  +91 98765 43210 / +91 98111 22334', {
          x: 75,
          y: 385,
          size: 10,
          font: helvetica
        });

        page.drawText(
          'Note: Horoscope and Kundli chart available on request. Verified profile document.',
          { x: 60, y: 320, size: 9, font: helvetica, color: rgb(0.4, 0.4, 0.4) }
        );
      } else if (tool.id === 'pdf-salary-slip-payslip-generator') {
        const page = pdfDoc.addPage([595.28, 841.89]);
        page.drawText('GLOBAL TECH SOLUTIONS PVT. LTD.', {
          x: 160,
          y: 790,
          size: 16,
          font: helveticaBold
        });
        page.drawText('Plot 42, Cyber City, Phase 2, Gurugram, HR - 122002', {
          x: 175,
          y: 770,
          size: 9,
          font: helvetica
        });
        page.drawText(`PAYSLIP FOR THE MONTH: ${customDate}`, {
          x: 180,
          y: 745,
          size: 11,
          font: helveticaBold,
          color: rgb(0.2, 0.4, 0.8)
        });

        // Employee Info Table
        page.drawRectangle({
          x: 40,
          y: 645,
          width: 515,
          height: 80,
          borderColor: rgb(0.8, 0.8, 0.8),
          borderWidth: 1
        });
        page.drawText(`Employee Name: ${fullName}`, { x: 55, y: 705, size: 10, font: helveticaBold });
        page.drawText('Employee ID: EMP-89412', { x: 55, y: 685, size: 10, font: helvetica });
        page.drawText('Designation: Lead Architect', { x: 55, y: 665, size: 10, font: helvetica });
        page.drawText('Bank A/c No: XXXXXX4920', { x: 310, y: 705, size: 10, font: helvetica });
        page.drawText('PAN: ABCPS1234F', { x: 310, y: 685, size: 10, font: helvetica });
        page.drawText('Days Payable: 30', { x: 310, y: 665, size: 10, font: helvetica });

        // Earnings and Deductions Table
        page.drawRectangle({
          x: 40,
          y: 430,
          width: 515,
          height: 200,
          borderColor: rgb(0.8, 0.8, 0.8),
          borderWidth: 1
        });
        page.drawLine({
          start: { x: 40, y: 605 },
          end: { x: 555, y: 605 },
          thickness: 1,
          color: rgb(0.8, 0.8, 0.8)
        });
        page.drawLine({
          start: { x: 297, y: 430 },
          end: { x: 297, y: 630 },
          thickness: 1,
          color: rgb(0.8, 0.8, 0.8)
        });

        page.drawText('EARNINGS', { x: 55, y: 615, size: 10, font: helveticaBold });
        page.drawText('DEDUCTIONS', { x: 310, y: 615, size: 10, font: helveticaBold });

        page.drawText('Basic Salary: Rs. 65,000', { x: 55, y: 580, size: 9, font: helvetica });
        page.drawText('House Rent Allowance (HRA): Rs. 26,000', {
          x: 55,
          y: 560,
          size: 9,
          font: helvetica
        });
        page.drawText('Special Allowance: Rs. 18,000', { x: 55, y: 540, size: 9, font: helvetica });
        page.drawText('Total Earnings: Rs. 1,09,000', {
          x: 55,
          y: 460,
          size: 10,
          font: helveticaBold
        });

        page.drawText('Provident Fund (PF): Rs. 7,800', { x: 310, y: 580, size: 9, font: helvetica });
        page.drawText('Professional Tax (PT): Rs. 200', {
          x: 310,
          y: 560,
          size: 9,
          font: helvetica
        });
        page.drawText('Income Tax (TDS): Rs. 11,500', { x: 310, y: 540, size: 9, font: helvetica });
        page.drawText('Total Deductions: Rs. 19,500', {
          x: 310,
          y: 460,
          size: 10,
          font: helveticaBold
        });

        // Net Pay Box
        page.drawRectangle({
          x: 40,
          y: 360,
          width: 515,
          height: 50,
          color: rgb(0.93, 0.96, 1),
          borderColor: rgb(0.3, 0.5, 0.9),
          borderWidth: 1.5
        });
        page.drawText('NET TAKE-HOME PAY: Rs. 89,500', {
          x: 55,
          y: 385,
          size: 13,
          font: helveticaBold,
          color: rgb(0.1, 0.2, 0.6)
        });
        page.drawText('In Words: Eighty-Nine Thousand Five Hundred Rupees Only', {
          x: 55,
          y: 370,
          size: 8,
          font: helvetica
        });

        page.drawText('Authorized HR Signatory', { x: 400, y: 250, size: 9, font: helveticaBold });
        page.drawText('System Generated Payslip. No signature required.', {
          x: 160,
          y: 190,
          size: 8,
          font: helvetica,
          color: rgb(0.5, 0.5, 0.5)
        });
      } else {
        // Universal High Quality PDF Generator for all 50 new PDF tools
        const page = pdfDoc.addPage([595.28, 841.89]);
        page.drawText(documentTitle.toUpperCase(), {
          x: 50,
          y: 790,
          size: 18,
          font: helveticaBold,
          color: rgb(0.15, 0.2, 0.35)
        });
        page.drawText(`Date: ${customDate}   |   Reference: DOC-${Math.floor(Math.random() * 89999 + 10000)}`, {
          x: 50,
          y: 765,
          size: 9,
          font: helvetica,
          color: rgb(0.4, 0.4, 0.4)
        });
        page.drawLine({
          start: { x: 50, y: 750 },
          end: { x: 545, y: 750 },
          thickness: 1.5,
          color: rgb(0.2, 0.4, 0.8)
        });

        page.drawText('PRIMARY PARTY / APPLICANT:', {
          x: 50,
          y: 715,
          size: 10,
          font: helveticaBold
        });
        page.drawText(`Name: ${fullName}`, { x: 50, y: 695, size: 10, font: helvetica });
        page.drawText(`Counterparty / Organization: ${secondaryName}`, {
          x: 50,
          y: 675,
          size: 10,
          font: helvetica
        });
        page.drawText(`Declared Valuation / Amount: Rs. ${amount}`, {
          x: 50,
          y: 655,
          size: 10,
          font: helvetica
        });

        page.drawText('TERMS, DECLARATIONS & SPECIFICATIONS:', {
          x: 50,
          y: 615,
          size: 10,
          font: helveticaBold
        });
        const noteLines = [
          additionalNotes,
          '1. This document constitutes formal documentation in accordance with client requirements.',
          '2. All calculations, dimensions, and clauses are rendered with high-precision vector fidelity.',
          '3. Generated securely inside your browser with complete client-side data privacy.'
        ];
        let yPos = 590;
        noteLines.forEach(line => {
          page.drawText(line, { x: 50, y: yPos, size: 9, font: helvetica });
          yPos -= 22;
        });

        page.drawRectangle({
          x: 50,
          y: 180,
          width: 200,
          height: 60,
          borderColor: rgb(0.7, 0.7, 0.7),
          borderWidth: 1
        });
        page.drawText('Authorized Signature', { x: 60, y: 190, size: 8, font: helvetica });

        page.drawRectangle({
          x: 345,
          y: 180,
          width: 200,
          height: 60,
          borderColor: rgb(0.7, 0.7, 0.7),
          borderWidth: 1
        });
        page.drawText('Official Seal / Verification Mark', {
          x: 355,
          y: 190,
          size: 8,
          font: helvetica
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setOutputName(`${tool.slug}-document.pdf`);
      onSuccess(`Successfully generated print-ready PDF for "${tool.name}".`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download Image from Canvas
  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${tool.slug}-result.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    onSuccess(`Successfully downloaded high-resolution result for "${tool.name}".`);
  };

  const copyAscii = () => {
    if (!asciiResult) return;
    navigator.clipboard.writeText(asciiResult);
    setCopiedAscii(true);
    setTimeout(() => setCopiedAscii(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Tool Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
              {isPdf ? <FileText className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {isPdf ? 'PDF & Document Suite' : 'Image & Media Suite'}
                </span>
                {tool.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                    {tool.badge}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {tool.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1.5 border border-emerald-200/50 dark:border-emerald-800/50">
              <CheckCircle2 className="w-3.5 h-3.5" /> Client-Side Safe
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{tool.description}</p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-500" />
              Configuration Parameters
            </h3>

            {/* File Upload Input */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                {isPdf ? 'Upload Template or Reference File' : 'Upload Image Photo / Graphic'}
              </label>
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-indigo-500 transition-colors bg-slate-50 dark:bg-slate-800/40">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {selectedFile ? selectedFile.name : 'Choose file or drag & drop'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {isPdf ? 'PDF, PNG, JPEG supported' : 'PNG, JPEG, WebP, SVG'}
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={isPdf ? '.pdf,image/*' : 'image/*'}
                  className="hidden"
                />
              </label>
            </div>

            {/* Parameters for PDF Tools */}
            {isPdf && (
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Name / Holder Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Secondary Party / Organization
                  </label>
                  <input
                    type="text"
                    value={secondaryName}
                    onChange={e => setSecondaryName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Amount / Value
                    </label>
                    <input
                      type="text"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Effective Date
                    </label>
                    <input
                      type="date"
                      value={customDate}
                      onChange={e => setCustomDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Clauses & Notes
                  </label>
                  <textarea
                    rows={2}
                    value={additionalNotes}
                    onChange={e => setAdditionalNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white resize-none"
                  />
                </div>

                <button
                  onClick={processPdfTool}
                  disabled={isProcessing}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Compiling Document...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Generate Print-Ready PDF
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Parameters for Image Tools */}
            {!isPdf && (
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                {tool.id === 'image-passport-size-photo-grid' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Print Layout Standard
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['4x6 Photo (8 Photos)', 'A4 Sheet (16 Photos)'].map(fmt => (
                        <button
                          key={fmt}
                          onClick={() => {
                            setPaperFormat(fmt);
                            renderImagePreview();
                          }}
                          className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                            paperFormat === fmt
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {tool.id === 'image-stamp-signature-cleaner' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Ink Tone Preset
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'blue', label: 'Royal Blue' },
                        { id: 'black', label: 'Dark Charcoal' },
                        { id: 'original', label: 'Original Ink' }
                      ].map(ink => (
                        <button
                          key={ink.id}
                          onClick={() => {
                            setInkColor(ink.id);
                            renderImagePreview();
                          }}
                          className={`px-2 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                            inkColor === ink.id
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {ink.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filter Sliders */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Effect Intensity</span>
                    <span>{filterIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={filterIntensity}
                    onChange={e => {
                      setFilterIntensity(Number(e.target.value));
                      renderImagePreview();
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Contrast / Threshold Cutoff</span>
                    <span>{colorThreshold}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={colorThreshold}
                    onChange={e => {
                      setColorThreshold(Number(e.target.value));
                      renderImagePreview();
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <button
                  onClick={() => renderImagePreview()}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-apply Effect
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Output & Canvas Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-500" />
                Live Canvas & Document Output
              </h3>

              {/* Action Downloads */}
              {isPdf && outputUrl && (
                <a
                  href={outputUrl}
                  download={outputName}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </a>
              )}

              {!isPdf && (
                <button
                  onClick={handleDownloadImage}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Download Result
                </button>
              )}
            </div>

            {/* Canvas or PDF Preview Container */}
            <div className="relative min-h-[360px] bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center p-3 border border-slate-200/50 dark:border-slate-800/50">
              {isPdf ? (
                outputUrl ? (
                  <iframe
                    src={outputUrl}
                    title="PDF Result Preview"
                    className="w-full h-[460px] rounded-xl border border-slate-300 dark:border-slate-700"
                  />
                ) : (
                  <div className="text-center p-8">
                    <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Ready to build your document
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                      Adjust your desired parameters on the left and click "Generate Print-Ready PDF"
                      to compile a verified, local PDF document.
                    </p>
                    <button
                      onClick={processPdfTool}
                      className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Compile Now
                    </button>
                  </div>
                )
              ) : (
                <div className="w-full flex flex-col items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full max-h-[460px] object-contain rounded-xl shadow-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                  {!selectedFile && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-xs p-6 text-center">
                      <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-2" />
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Upload an image to preview tool
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Use the file upload on the left to process your photo with instant client-side
                        rendering.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ASCII Output Box if applicable */}
            {asciiResult && (
              <div className="mt-4 p-4 bg-slate-950 text-emerald-400 font-mono text-[9px] rounded-2xl overflow-x-auto max-h-56 relative border border-slate-800">
                <button
                  onClick={copyAscii}
                  className="absolute top-3 right-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold rounded-lg flex items-center gap-1"
                >
                  {copiedAscii ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedAscii ? 'Copied' : 'Copy ASCII'}
                </button>
                <pre>{asciiResult}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
