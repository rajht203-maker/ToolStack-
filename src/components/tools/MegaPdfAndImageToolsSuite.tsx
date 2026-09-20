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
import { getToolSchema, ToolFieldSchema, validateToolFields } from '../../config/toolFieldRegistry';

interface MegaPdfAndImageToolsSuiteProps {
  tool: ToolItem;
  onSuccess: (summary: string) => void;
}

export const MegaPdfAndImageToolsSuite: React.FC<MegaPdfAndImageToolsSuiteProps> = ({
  tool,
  onSuccess
}) => {
  const isPdf = tool.category === 'pdf' || tool.id.startsWith('pdf-');

  // Single source of truth field configuration
  const schema = getToolSchema(tool.id, tool.name);

  // File states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputName, setOutputName] = useState('processed-output');
  const [asciiResult, setAsciiResult] = useState<string | null>(null);
  const [copiedAscii, setCopiedAscii] = useState(false);

  // Dynamic schema-driven field state
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    schema.fields.forEach(f => {
      initial[f.name] = f.defaultValue || '';
    });
    return initial;
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Reset fields when active tool changes
  useEffect(() => {
    const newSchema = getToolSchema(tool.id, tool.name);
    const initial: Record<string, string> = {};
    newSchema.fields.forEach(f => {
      initial[f.name] = f.defaultValue || '';
    });
    setFormValues(initial);
    setValidationErrors({});
    setOutputUrl(null);
  }, [tool.id, tool.name]);

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormValues(prev => ({ ...prev, [fieldName]: value }));
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

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

          // Thin cutting guide border
          ctx.strokeStyle = '#D1D5DB';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, photoW, photoH);
        }
      }
      return;
    }

    // Default Canvas size to match image aspect ratio
    const maxDimension = 900;
    let w = targetImg.naturalWidth || 600;
    let h = targetImg.naturalHeight || 400;

    if (w > maxDimension || h > maxDimension) {
      if (w > h) {
        h = Math.round((h * maxDimension) / w);
        w = maxDimension;
      } else {
        w = Math.round((w * maxDimension) / h);
        h = maxDimension;
      }
    }

    canvas.width = w;
    canvas.height = h;

    // Draw base image
    ctx.drawImage(targetImg, 0, 0, w, h);
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // 1. Stamp & Signature Isolator / Ink Cleaner
    if (tool.id === 'image-stamp-signature-cleaner') {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Detect white or light grayish paper background
        const brightness = (r + g + b) / 3;
        const cutoff = 255 - colorThreshold * 2;

        if (brightness > cutoff) {
          // Make background transparent or pure crisp white
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        } else {
          // Enhance ink tone
          if (inkColor === 'blue') {
            data[i] = Math.max(0, r * 0.2);
            data[i + 1] = Math.max(0, g * 0.4);
            data[i + 2] = Math.min(255, b * 1.5 + 40);
          } else if (inkColor === 'black') {
            const dark = Math.min(r, g, b) * 0.6;
            data[i] = dark;
            data[i + 1] = dark;
            data[i + 2] = dark;
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    // 2. Whiteboard & Document Highlighter
    else if (tool.id === 'image-whiteboard-cleaner-contrast') {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

        // Increase threshold to blast white backgrounds
        if (brightness > 140 - colorThreshold) {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        } else {
          // Maximize marker color ink
          data[i] = r < 100 ? 0 : r;
          data[i + 1] = g < 100 ? 0 : g;
          data[i + 2] = b < 100 ? 0 : b;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    // 3. Vintage Halftone / Dither
    else if (tool.id === 'image-halftone-dither-printer') {
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const dither = (i / 4) % 2 === 0 ? 15 : -15;
        const val = gray + dither > 128 ? 255 : 0;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
      }
      ctx.putImageData(imgData, 0, 0);
    }

    // 4. ASCII Art Renderer
    else if (tool.id === 'image-ascii-art-terminal-generator') {
      const asciiChars = '@%#*+=-:. ';
      let text = '';
      const step = 8;
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step / 2) {
          const idx = (Math.floor(y) * w + Math.floor(x)) * 4;
          const r = data[idx] || 0;
          const g = data[idx + 1] || 0;
          const b = data[idx + 2] || 0;
          const avg = (r + g + b) / 3;
          const charIndex = Math.floor((avg / 255) * (asciiChars.length - 1));
          text += asciiChars[charIndex];
        }
        text += '\n';
      }
      setAsciiResult(text);
    }

    // 5. Thermal Receipt / 1-Bit Dither FX
    else if (tool.id === 'image-thermal-receipt-printer-effect') {
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const threshold = 135;
        const v = avg > threshold ? 245 : 20;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
      }
      ctx.putImageData(imgData, 0, 0);
    }

    // 6. Generic Color Saturation / Filter Boost
    else {
      const factor = (filterIntensity - 50) / 50;
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
  // PROCESS PDF GENERATION & EXPORT (SYNCHRONIZED WITH SCHEMA)
  // ----------------------------------------------------
  const processPdfTool = async () => {
    // Validate inputs strictly against tool schema
    const { isValid, errors } = validateToolFields(schema, formValues);
    if (!isValid) {
      setValidationErrors(errors);
      return;
    }

    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

      // Tool 1: Salary Certificate / Payslip
      if (tool.id === 'pdf-salary-slip-payslip-generator') {
        const page = pdfDoc.addPage([595.28, 841.89]);
        const { width, height } = page.getSize();

        // Organization Header (from user input)
        page.drawText((formValues.organization || 'ORGANIZATION').toUpperCase(), {
          x: 50,
          y: height - 60,
          size: 16,
          font: helveticaBold,
          color: rgb(0.1, 0.2, 0.35)
        });
        page.drawText('OFFICIAL SALARY CERTIFICATE & PAYSLIP', {
          x: 50,
          y: height - 85,
          size: 12,
          font: helveticaBold,
          color: rgb(0.2, 0.4, 0.8)
        });
        page.drawText(`Date: ${formValues.date || new Date().toISOString().split('T')[0]}`, {
          x: width - 180,
          y: height - 85,
          size: 10,
          font: helvetica,
          color: rgb(0.4, 0.4, 0.4)
        });
        page.drawLine({
          start: { x: 50, y: height - 100 },
          end: { x: width - 50, y: height - 100 },
          thickness: 1.5,
          color: rgb(0.2, 0.4, 0.8)
        });

        // Verification Declaration
        page.drawText('TO WHOM IT MAY CONCERN', {
          x: 50,
          y: height - 135,
          size: 11,
          font: helveticaBold,
          color: rgb(0.15, 0.15, 0.15)
        });
        page.drawText(
          `This document certifies that the employee named below is in regular employment with ${formValues.organization}:`,
          {
            x: 50,
            y: height - 155,
            size: 10,
            font: helvetica,
            color: rgb(0.25, 0.25, 0.25)
          }
        );

        // Certified Breakdown Table (ONLY uses defined fields!)
        page.drawRectangle({
          x: 50,
          y: height - 285,
          width: width - 100,
          height: 110,
          borderColor: rgb(0.8, 0.85, 0.9),
          borderWidth: 1,
          color: rgb(0.98, 0.99, 1)
        });

        // Field 1: Employee Name
        page.drawText('Employee Name:', {
          x: 70,
          y: height - 205,
          size: 10,
          font: helveticaBold,
          color: rgb(0.2, 0.2, 0.2)
        });
        page.drawText(formValues.employeeName || '', {
          x: 220,
          y: height - 205,
          size: 11,
          font: helveticaBold,
          color: rgb(0.1, 0.2, 0.6)
        });

        // Field 2: Organization
        page.drawText('Organization:', {
          x: 70,
          y: height - 230,
          size: 10,
          font: helveticaBold,
          color: rgb(0.2, 0.2, 0.2)
        });
        page.drawText(formValues.organization || '', {
          x: 220,
          y: height - 230,
          size: 10,
          font: helvetica,
          color: rgb(0.2, 0.2, 0.2)
        });

        // Field 3: Salary Amount
        page.drawText('Salary Amount:', {
          x: 70,
          y: height - 255,
          size: 10,
          font: helveticaBold,
          color: rgb(0.2, 0.2, 0.2)
        });
        page.drawText(`Rs. ${formValues.salaryAmount || ''}`, {
          x: 220,
          y: height - 255,
          size: 12,
          font: helveticaBold,
          color: rgb(0.05, 0.5, 0.25)
        });

        // Field 4: Date
        page.drawText('Date:', {
          x: 70,
          y: height - 275,
          size: 10,
          font: helveticaBold,
          color: rgb(0.2, 0.2, 0.2)
        });
        page.drawText(formValues.date || '', {
          x: 220,
          y: height - 275,
          size: 10,
          font: helvetica,
          color: rgb(0.2, 0.2, 0.2)
        });

        // Highlight Net Payable Box
        page.drawRectangle({
          x: 50,
          y: height - 370,
          width: width - 100,
          height: 60,
          color: rgb(0.94, 0.97, 1),
          borderColor: rgb(0.3, 0.5, 0.9),
          borderWidth: 1.5
        });
        page.drawText('CONFIRMED MONTHLY SALARY PAYABLE:', {
          x: 70,
          y: height - 335,
          size: 10,
          font: helveticaBold,
          color: rgb(0.2, 0.35, 0.7)
        });
        page.drawText(`Rs. ${formValues.salaryAmount || ''}`, {
          x: 70,
          y: height - 358,
          size: 16,
          font: helveticaBold,
          color: rgb(0.05, 0.45, 0.2)
        });

        // Signoff block
        page.drawLine({
          start: { x: width - 230, y: height - 480 },
          end: { x: width - 50, y: height - 480 },
          thickness: 1,
          color: rgb(0.5, 0.5, 0.5)
        });
        page.drawText('Authorized HR Signatory', {
          x: width - 210,
          y: height - 498,
          size: 10,
          font: helveticaBold,
          color: rgb(0.3, 0.3, 0.3)
        });
        page.drawText(formValues.organization || '', {
          x: width - 210,
          y: height - 515,
          size: 9,
          font: helvetica,
          color: rgb(0.5, 0.5, 0.5)
        });
      }

      // Tool 2: Aadhaar Card Print Scaler (uses only its defined fields)
      else if (tool.id === 'pdf-aadhaar-card-print-scaler') {
        const page = pdfDoc.addPage([288, 432]); // 4x6 inch
        const cardW = 242;
        const cardH = 153;

        // Front Card
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
        page.drawText(`Name: ${formValues.cardHolderName || ''}`, {
          x: 35,
          y: 345,
          size: 10,
          font: helveticaBold
        });
        page.drawText(`DOB: ${formValues.dob || ''}`, {
          x: 35,
          y: 325,
          size: 8,
          font: helvetica
        });
        page.drawText(formValues.aadhaarNumber || '', {
          x: 35,
          y: 280,
          size: 13,
          font: helveticaBold,
          color: rgb(0.1, 0.1, 0.1)
        });

        // Back Card
        page.drawRectangle({
          x: 23,
          y: 55,
          width: cardW,
          height: cardH,
          borderColor: rgb(0.2, 0.5, 0.8),
          borderWidth: 1.5
        });
        page.drawText('AADHAAR WALLET PRINT SHEET - BACK', {
          x: 35,
          y: 185,
          size: 8,
          font: helveticaBold
        });
        page.drawText(`Address: ${formValues.address || ''}`, {
          x: 35,
          y: 160,
          size: 7,
          font: helvetica
        });
      }

      // Tool 3: Matrimonial Biodata (uses only its defined fields)
      else if (tool.id === 'pdf-biodata-marriage-maker') {
        const page = pdfDoc.addPage([595.28, 841.89]);
        const { width, height } = page.getSize();

        page.drawRectangle({
          x: 30,
          y: 30,
          width: width - 60,
          height: height - 60,
          borderColor: rgb(0.7, 0.15, 0.15),
          borderWidth: 2
        });

        page.drawText('MATRIMONIAL BIODATA', {
          x: 195,
          y: height - 70,
          size: 18,
          font: helveticaBold,
          color: rgb(0.1, 0.1, 0.3)
        });

        page.drawText('CANDIDATE DETAILS', {
          x: 60,
          y: height - 110,
          size: 12,
          font: helveticaBold,
          color: rgb(0.7, 0.15, 0.15)
        });

        page.drawText(`Full Name:  ${formValues.fullName || ''}`, {
          x: 75,
          y: height - 140,
          size: 10,
          font: helveticaBold
        });
        page.drawText(`Date of Birth:  ${formValues.dateOfBirth || ''}`, {
          x: 75,
          y: height - 165,
          size: 10,
          font: helvetica
        });
        page.drawText(`Education:  ${formValues.education || ''}`, {
          x: 75,
          y: height - 190,
          size: 10,
          font: helvetica
        });
        page.drawText(`Occupation:  ${formValues.occupation || ''}`, {
          x: 75,
          y: height - 215,
          size: 10,
          font: helvetica
        });
        page.drawText(`Native Place:  ${formValues.nativePlace || ''}`, {
          x: 75,
          y: height - 240,
          size: 10,
          font: helvetica
        });
      }

      // Universal Schema-Driven Document Generator for all tools
      else {
        const page = pdfDoc.addPage([595.28, 841.89]);
        const { width, height } = page.getSize();

        // Document Title
        page.drawText(schema.docTitle.toUpperCase(), {
          x: 50,
          y: height - 60,
          size: 16,
          font: helveticaBold,
          color: rgb(0.12, 0.18, 0.3)
        });

        page.drawText(`Date: ${formValues.date || new Date().toISOString().split('T')[0]}`, {
          x: 50,
          y: height - 80,
          size: 9,
          font: helvetica,
          color: rgb(0.4, 0.4, 0.4)
        });

        page.drawLine({
          start: { x: 50, y: height - 95 },
          end: { x: width - 50, y: height - 95 },
          thickness: 1.5,
          color: rgb(0.2, 0.4, 0.8)
        });

        page.drawText('DOCUMENT PARTICULARS & CERTIFICATION:', {
          x: 50,
          y: height - 125,
          size: 11,
          font: helveticaBold,
          color: rgb(0.2, 0.3, 0.5)
        });

        // Render ONLY the fields explicitly defined in schema.fields
        let yPos = height - 160;

        for (const field of schema.fields) {
          const val = formValues[field.name];
          // Rule 8: If a field is optional and empty, skip it!
          if (!field.required && (!val || val.trim() === '')) {
            continue;
          }

          const displayVal = val || '(Not specified)';

          if (field.type === 'textarea') {
            page.drawText(`${field.label}:`, {
              x: 50,
              y: yPos,
              size: 10,
              font: helveticaBold,
              color: rgb(0.2, 0.2, 0.2)
            });
            yPos -= 18;

            const lines = displayVal.split('\n');
            for (const line of lines) {
              if (yPos < 100) break;
              page.drawText(line.slice(0, 85), {
                x: 65,
                y: yPos,
                size: 9.5,
                font: helvetica,
                color: rgb(0.25, 0.25, 0.25)
              });
              yPos -= 16;
            }
            yPos -= 10;
          } else {
            page.drawRectangle({
              x: 50,
              y: yPos - 8,
              width: width - 100,
              height: 28,
              borderColor: rgb(0.88, 0.9, 0.94),
              borderWidth: 1,
              color: rgb(0.98, 0.99, 1)
            });

            page.drawText(`${field.label}:`, {
              x: 65,
              y: yPos,
              size: 10,
              font: helveticaBold,
              color: rgb(0.2, 0.2, 0.2)
            });

            page.drawText(displayVal.slice(0, 60), {
              x: 230,
              y: yPos,
              size: 10,
              font: helvetica,
              color: rgb(0.1, 0.2, 0.5)
            });

            yPos -= 36;
          }

          if (yPos < 140) break;
        }

        // Official verification footer
        page.drawLine({
          start: { x: 50, y: 110 },
          end: { x: width - 50, y: 110 },
          thickness: 1,
          color: rgb(0.8, 0.8, 0.8)
        });

        page.drawText('Verified Document Certification - Created via FreeTools Online', {
          x: 50,
          y: 92,
          size: 8,
          font: helveticaOblique,
          color: rgb(0.5, 0.5, 0.5)
        });

        page.drawText('Authorized Signature', {
          x: width - 180,
          y: 65,
          size: 9,
          font: helveticaBold,
          color: rgb(0.3, 0.3, 0.3)
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setOutputName(`${tool.id}-generated.pdf`);
      onSuccess(`Successfully compiled print-ready document with verified parameters.`);
    } catch (err: any) {
      alert(`Document generation error: ${err.message || 'Failed to compile PDF'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // ----------------------------------------------------
  // DOWNLOAD IMAGE CANVAS
  // ----------------------------------------------------
  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tool.id}-processed.png`;
    link.click();
    onSuccess(`Processed image downloaded successfully.`);
  };

  const copyAscii = () => {
    if (!asciiResult) return;
    navigator.clipboard.writeText(asciiResult);
    setCopiedAscii(true);
    setTimeout(() => setCopiedAscii(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Parameter Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              Tool Parameters & Inputs
            </h3>

            {/* Optional upload box for image tools or tools requiring file input */}
            {!isPdf && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Source Image
                </label>
                <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group">
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 mb-1 transition-colors" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {selectedFile ? selectedFile.name : 'Upload File (Max 25MB)'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WebP supported</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Schema-Driven Parameters for PDF Tools */}
            {isPdf && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {schema.docTitle} Fields
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
                  </span>
                </div>

                {schema.fields.map(field => (
                  <div key={field.name}>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={formValues[field.name] || ''}
                        onChange={e => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                        className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border ${
                          validationErrors[field.name]
                            ? 'border-rose-400 focus:ring-rose-400'
                            : 'border-slate-200 dark:border-slate-700'
                        } rounded-xl text-xs font-medium text-slate-900 dark:text-white resize-none`}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={formValues[field.name] || ''}
                        onChange={e => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                        className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border ${
                          validationErrors[field.name]
                            ? 'border-rose-400 focus:ring-rose-400'
                            : 'border-slate-200 dark:border-slate-700'
                        } rounded-xl text-xs font-medium text-slate-900 dark:text-white`}
                      />
                    )}

                    {validationErrors[field.name] && (
                      <p className="text-[11px] text-rose-500 font-semibold mt-1">
                        {validationErrors[field.name]}
                      </p>
                    )}
                  </div>
                ))}

                <button
                  onClick={processPdfTool}
                  disabled={isProcessing}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md hover:shadow-indigo-500/25 flex items-center justify-center gap-2 mt-3 cursor-pointer"
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
                      Paper Sheet Format
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['4x6', 'A4'].map(fmt => (
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
                          {fmt} Format (8 / 16 Photos)
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
                Live Document & Canvas Preview
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
                    className="w-full h-[520px] rounded-xl border border-slate-300 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          Live Document Preview
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {schema.docTitle}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        Synchronized
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {schema.fields.map(field => {
                        const val = formValues[field.name];
                        return (
                          <div key={field.name} className="flex items-baseline justify-between text-xs py-1 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">
                              {field.label}:
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-right max-w-[200px] truncate">
                              {val ? val : <span className="text-slate-400 italic font-normal">Pending input</span>}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={processPdfTool}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Sparkles className="w-4 h-4" /> Compile & Preview PDF
                      </button>
                      <p className="text-[10px] text-slate-400 text-center mt-2">
                        Compiles client-side using only the fields defined above.
                      </p>
                    </div>
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
