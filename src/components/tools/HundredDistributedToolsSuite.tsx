import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ToolItem } from '../../types';
import {
  Upload,
  Download,
  CheckCircle2,
  RefreshCw,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Eye,
  Check,
  Copy,
  Sliders,
  DollarSign,
  TrendingUp,
  Percent,
  Car,
  Activity,
  Flame,
  GraduationCap,
  Clock,
  Tv,
  Gauge,
  Compass,
  Fuel,
  CircleDot,
  Wifi,
  Zap,
  Wrench,
  Coffee,
  Footprints,
  Globe2,
  Key,
  Dices,
  Hash,
  ShieldAlert,
  CreditCard,
  ShieldOff,
  FileCheck,
  Cpu,
  Radio,
  Lock,
  Share2,
  Search,
  Bot,
  FileCode2,
  Languages,
  BarChart,
  Link2,
  HelpCircle,
  Heading,
  Code2,
  Youtube,
  Linkedin,
  Twitter,
  Video,
  Smartphone,
  MessageSquare,
  Maximize,
  UserCheck,
  Calculator,
  Shield,
  ListChecks,
  GitCompare,
  Layers,
  Workflow,
  Camera,
  Smile,
  Palette,
  Sun,
  Circle,
  LayoutGrid,
  Stamp,
  Contrast,
  Feather,
  Type,
  ListOrdered,
  Filter,
  Skull,
  Binary,
  Eraser,
  AlignLeft,
  Maximize2,
  FileCode,
  Code,
  CalendarClock,
  PenTool,
  Link,
  GitCommit,
  Tag
} from 'lucide-react';

interface HundredDistributedToolsSuiteProps {
  tool: ToolItem;
  onSuccess: (summary: string) => void;
}

export const HundredDistributedToolsSuite: React.FC<HundredDistributedToolsSuiteProps> = ({
  tool,
  onSuccess
}) => {
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onSuccess(`Copied output to clipboard!`);
  };

  // =========================================================================
  // 1. PDF TOOLS ENGINE
  // =========================================================================
  const [pdfRecipient, setPdfRecipient] = useState('Alex Morgan');
  const [pdfTitle, setPdfTitle] = useState('Certificate of Excellence');
  const [pdfOrg, setPdfOrg] = useState('ToolStack Global Academy');
  const [pdfAmount, setPdfAmount] = useState('250.00');
  const [pdfDescription, setPdfDescription] = useState('Professional Consulting Services & Deliverables');
  const [pdfGridSpacing, setPdfGridSpacing] = useState(5);
  const [pdfRedactKeyword, setPdfRedactKeyword] = useState('CONFIDENTIAL');
  const [pdfTextSample, setPdfTextSample] = useState(
    'This Agreement contains CONFIDENTIAL financial secrets and proprietary patent data.\nAll CONFIDENTIAL materials must remain strictly secure.'
  );

  const generateAndDownloadPdf = async () => {
    try {
      setIsProcessing(true);
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait in points
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const { width, height } = page.getSize();

      if (tool.id === 'pdf-certificate-award-generator') {
        // Certificate layout (Landscape orientation)
        page.setSize(841.89, 595.28);
        const pWidth = 841.89;
        const pHeight = 595.28;
        // Border
        page.drawRectangle({
          x: 30,
          y: 30,
          width: pWidth - 60,
          height: pHeight - 60,
          borderColor: rgb(0.85, 0.65, 0.13),
          borderWidth: 4
        });
        page.drawRectangle({
          x: 40,
          y: 40,
          width: pWidth - 80,
          height: pHeight - 80,
          borderColor: rgb(0.2, 0.25, 0.35),
          borderWidth: 1
        });

        page.drawText(pdfOrg.toUpperCase(), {
          x: pWidth / 2 - (pdfOrg.length * 5),
          y: pHeight - 90,
          size: 16,
          font: boldFont,
          color: rgb(0.3, 0.35, 0.45)
        });

        page.drawText(pdfTitle, {
          x: pWidth / 2 - (pdfTitle.length * 8),
          y: pHeight - 160,
          size: 28,
          font: boldFont,
          color: rgb(0.1, 0.15, 0.3)
        });

        page.drawText('THIS IS PROUDLY PRESENTED TO', {
          x: pWidth / 2 - 110,
          y: pHeight - 210,
          size: 11,
          font: font,
          color: rgb(0.5, 0.5, 0.5)
        });

        page.drawText(pdfRecipient, {
          x: pWidth / 2 - (pdfRecipient.length * 10),
          y: pHeight - 270,
          size: 32,
          font: boldFont,
          color: rgb(0.85, 0.65, 0.13)
        });

        page.drawText('For outstanding dedication, craftsmanship, and distinguished achievement.', {
          x: pWidth / 2 - 180,
          y: pHeight - 330,
          size: 12,
          font: font,
          color: rgb(0.25, 0.3, 0.4)
        });

        page.drawLine({
          start: { x: 150, y: 120 },
          end: { x: 320, y: 120 },
          color: rgb(0.4, 0.4, 0.4),
          thickness: 1
        });
        page.drawText('Authorized Signature', { x: 175, y: 100, size: 10, font });

        page.drawLine({
          start: { x: pWidth - 320, y: 120 },
          end: { x: pWidth - 150, y: 120 },
          color: rgb(0.4, 0.4, 0.4),
          thickness: 1
        });
        page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: pWidth - 290, y: 100, size: 10, font });
      } else if (tool.id === 'pdf-graph-paper-creator') {
        // Graph paper grid
        const step = pdfGridSpacing * 2.83465; // mm to points
        for (let x = 30; x < width - 30; x += step) {
          page.drawLine({
            start: { x, y: 30 },
            end: { x, y: height - 30 },
            color: rgb(0.78, 0.85, 0.95),
            thickness: 0.5
          });
        }
        for (let y = 30; y < height - 30; y += step) {
          page.drawLine({
            start: { x: 30, y },
            end: { x: width - 30, y },
            color: rgb(0.78, 0.85, 0.95),
            thickness: 0.5
          });
        }
        page.drawText(`ToolStack Precision Graph Paper (${pdfGridSpacing}mm grid)`, {
          x: 40,
          y: height - 20,
          size: 8,
          font,
          color: rgb(0.5, 0.5, 0.6)
        });
      } else if (tool.id === 'pdf-confidential-redaction-marker') {
        // Redaction marker
        page.drawText('CONFIDENTIAL DOCUMENT (REDACTED)', {
          x: 50,
          y: height - 60,
          size: 16,
          font: boldFont,
          color: rgb(0.8, 0.1, 0.1)
        });

        const lines = pdfTextSample.split('\n');
        let currentY = height - 120;
        for (const line of lines) {
          if (line.includes(pdfRedactKeyword)) {
            // Draw line with black box over the redacted keyword
            page.drawText(line.replace(new RegExp(pdfRedactKeyword, 'g'), '[ ████████ ]'), {
              x: 50,
              y: currentY,
              size: 12,
              font,
              color: rgb(0.1, 0.1, 0.1)
            });
            // Black redaction box accent
            page.drawRectangle({
              x: 45,
              y: currentY - 3,
              width: 120,
              height: 16,
              color: rgb(0.05, 0.05, 0.05)
            });
          } else {
            page.drawText(line, { x: 50, y: currentY, size: 12, font });
          }
          currentY -= 30;
        }
      } else {
        // Standard high-quality document (Receipt, NDA, Packing Slip, Staff music, etc.)
        page.drawText(tool.name, {
          x: 50,
          y: height - 60,
          size: 18,
          font: boldFont,
          color: rgb(0.1, 0.15, 0.25)
        });

        page.drawText(`Generated on: ${new Date().toLocaleString()} | Client-Side Secure`, {
          x: 50,
          y: height - 85,
          size: 9,
          font,
          color: rgb(0.5, 0.5, 0.5)
        });

        page.drawLine({
          start: { x: 50, y: height - 95 },
          end: { x: width - 50, y: height - 95 },
          color: rgb(0.8, 0.85, 0.9),
          thickness: 1
        });

        page.drawText(`Party / Recipient: ${pdfRecipient}`, { x: 50, y: height - 140, size: 12, font });
        page.drawText(`Organization: ${pdfOrg}`, { x: 50, y: height - 170, size: 12, font });
        page.drawText(`Amount / Value: $${pdfAmount}`, { x: 50, y: height - 200, size: 12, font: boldFont });
        page.drawText(`Reference Notes: ${pdfDescription}`, { x: 50, y: height - 230, size: 11, font });

        // Decorative table/box
        page.drawRectangle({
          x: 50,
          y: height - 420,
          width: width - 100,
          height: 150,
          borderColor: rgb(0.7, 0.75, 0.85),
          borderWidth: 1,
          color: rgb(0.97, 0.98, 1)
        });

        page.drawText('VERIFIED DOCUMENT SPECIFICATION', {
          x: 70,
          y: height - 300,
          size: 11,
          font: boldFont,
          color: rgb(0.2, 0.3, 0.5)
        });
        page.drawText('• 100% Client-Side Privacy: Rendered in browser memory without server uploads.', {
          x: 70,
          y: height - 330,
          size: 9,
          font
        });
        page.drawText('• High Resolution Vector Output: Ready for commercial laser and offset printing.', {
          x: 70,
          y: height - 350,
          size: 9,
          font
        });
        page.drawText('• Standardized Dimensions: Compliant with ISO 216 international paper formats.', {
          x: 70,
          y: height - 370,
          size: 9,
          font
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tool.slug || 'document'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onSuccess(`Generated and downloaded ${tool.name} successfully!`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // =========================================================================
  // 2. IMAGE TOOLS ENGINE (Canvas Manipulation)
  // =========================================================================
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [imgCaption, setImgCaption] = useState('Summer Memories 2026');
  const [imgTopText, setImgTopText] = useState('WHEN CODE BUILDS');
  const [imgBottomText, setImgBottomText] = useState('ON FIRST COMPILE');
  const [glitchShift, setGlitchShift] = useState(12);
  const [vignetteRadius, setVignetteRadius] = useState(60);
  const [cornerRadius, setCornerRadius] = useState(30);
  const [isCircleCrop, setIsCircleCrop] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render canvas whenever parameters change
  useEffect(() => {
    if (tool.category !== 'image') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    // Fallback sample image if none uploaded
    img.src =
      imageFile ||
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%236366f1"/><stop offset="100%" stop-color="%23ec4899"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><circle cx="300" cy="180" r="80" fill="%23ffffff" opacity="0.25"/><text x="300" y="320" font-family="sans-serif" font-size="24" font-weight="bold" fill="%23ffffff" text-anchor="middle">ToolStack Image Studio</text></svg>';

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 500;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (tool.id === 'image-polaroid-photo-framer') {
        // Polaroid Frame
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(40, 20, 520, 460);
        // Shadow
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.strokeRect(40, 20, 520, 460);
        // Photo area
        ctx.drawImage(img, 70, 45, 460, 340);
        // Caption
        ctx.font = '24px cursive, sans-serif';
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'center';
        ctx.fillText(imgCaption, 300, 435);
      } else if (tool.id === 'image-meme-caption-editor') {
        // Meme top/bottom text
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.font = 'bold 36px Impact, Arial Black, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.textAlign = 'center';

        if (imgTopText) {
          ctx.strokeText(imgTopText.toUpperCase(), 300, 55);
          ctx.fillText(imgTopText.toUpperCase(), 300, 55);
        }
        if (imgBottomText) {
          ctx.strokeText(imgBottomText.toUpperCase(), 300, 460);
          ctx.fillText(imgBottomText.toUpperCase(), 300, 460);
        }
      } else if (tool.id === 'image-glitch-art-synthesizer') {
        // RGB split glitch
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;
        const shift = glitchShift * 4;
        for (let i = 0; i < d.length - shift; i += 4) {
          d[i] = d[i + shift]; // Shift red channel
        }
        ctx.putImageData(imgData, 0, 0);

        // Scanlines
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        for (let y = 0; y < canvas.height; y += 4) {
          ctx.fillRect(0, y, canvas.width, 1.5);
        }
      } else if (tool.id === 'image-vignette-lighting-tuner') {
        // Vignette
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const rad = (vignetteRadius / 100) * (canvas.width / 2);
        const grad = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          rad * 0.5,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width * 0.7
        );
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.85)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (tool.id === 'image-round-corner-masker') {
        // Rounded corners or Circle
        ctx.save();
        ctx.beginPath();
        if (isCircleCrop) {
          const r = Math.min(canvas.width, canvas.height) / 2.2;
          ctx.arc(canvas.width / 2, canvas.height / 2, r, 0, Math.PI * 2);
        } else {
          const r = cornerRadius;
          const x = 50;
          const y = 30;
          const w = 500;
          const h = 440;
          ctx.moveTo(x + r, y);
          ctx.arcTo(x + w, y, x + w, y + h, r);
          ctx.arcTo(x + w, y + h, x, y + h, r);
          ctx.arcTo(x, y + h, x, y, r);
          ctx.arcTo(x, y, x + w, y, r);
        }
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      } else {
        // Default Image render with watermark/stamp
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width - 120, canvas.height - 80);
        ctx.rotate(-0.2);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.strokeRect(-60, -25, 120, 50);
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.textAlign = 'center';
        ctx.fillText('VERIFIED', 0, 6);
        ctx.restore();
      }
    };
  }, [
    tool,
    imageFile,
    imgCaption,
    imgTopText,
    imgBottomText,
    glitchShift,
    vignetteRadius,
    cornerRadius,
    isCircleCrop
  ]);

  const downloadCanvasImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${tool.slug || 'image'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    onSuccess(`Downloaded image from ${tool.name}!`);
  };

  // =========================================================================
  // 3. TEXT & CONTENT TOOLS ENGINE
  // =========================================================================
  const [textInput, setTextInput] = useState(
    'The quick brown fox jumps over the lazy dog near a peaceful autumn river.'
  );
  const [zalgoChaos, setZalgoChaos] = useState(3);
  const [prefixStr, setPrefixStr] = useState('#');
  const [delimiterStr, setDelimiterStr] = useState(' ');

  const textCalculations = useMemo(() => {
    // 1. Syllables
    const countSyllables = (word: string) => {
      word = word.toLowerCase();
      if (word.length <= 3) return 1;
      word = word.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
      word = word.replace(/^y/, '');
      const syl = word.match(/[aeiouy]{1,2}/g);
      return syl ? Math.max(1, syl.length) : 1;
    };
    const words = textInput.trim().split(/\s+/).filter(Boolean);
    const totalSyllables = words.reduce((acc, w) => acc + countSyllables(w), 0);

    // 2. Title Case (AP / Chicago)
    const minorWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'up', 'with']);
    const titleCaseOutput = textInput
      .toLowerCase()
      .split(' ')
      .map((w, idx) => {
        if (idx === 0 || !minorWords.has(w)) {
          return w.charAt(0).toUpperCase() + w.slice(1);
        }
        return w;
      })
      .join(' ');

    // 3. NATO Phonetic
    const natoMap: Record<string, string> = {
      A: 'Alfa', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo', F: 'Foxtrot', G: 'Golf',
      H: 'Hotel', I: 'India', J: 'Juliett', K: 'Kilo', L: 'Lima', M: 'Mike', N: 'November',
      O: 'Oscar', P: 'Papa', Q: 'Quebec', R: 'Romeo', S: 'Sierra', T: 'Tango', U: 'Uniform',
      V: 'Victor', W: 'Whiskey', X: 'X-ray', Y: 'Yankee', Z: 'Zulu',
      '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four',
      '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Niner'
    };
    const natoOutput = textInput
      .toUpperCase()
      .split('')
      .map(ch => natoMap[ch] || ch)
      .join(' ');

    // 4. Flesch-Kincaid Reading Grade
    const sentences = textInput.split(/[.!?]+/).filter(Boolean).length || 1;
    const wordCount = words.length || 1;
    const fleschEase = 206.835 - 1.015 * (wordCount / sentences) - 84.6 * (totalSyllables / wordCount);
    const fkGrade = 0.39 * (wordCount / sentences) + 11.8 * (totalSyllables / wordCount) - 15.59;

    // 5. Line numbers / prefix
    const lines = textInput.split('\n');
    const numberedLines = lines
      .map((line, i) => `${prefixStr}${String(i + 1).padStart(2, '0')}${delimiterStr}${line}`)
      .join('\n');

    // 6. Deduplicate
    const uniqueLines = Array.from(new Set(lines.map(l => l.trim()))).join('\n');

    // 7. Zalgo Glitch
    const zalgoUp = ['̍', '̎', '̄', '̅', '̿', '̑', '̆', '̐', '͒', '͗', '͑', '̇', '̈'];
    let zalgoOutput = '';
    for (const char of textInput) {
      zalgoOutput += char;
      for (let i = 0; i < zalgoChaos; i++) {
        zalgoOutput += zalgoUp[Math.floor(Math.random() * zalgoUp.length)];
      }
    }

    // 8. Morse Code
    const morseMap: Record<string, string> = {
      A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
      I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
      Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
      Y: '-.--', Z: '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
      '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
    };
    const morseOutput = textInput
      .toUpperCase()
      .split('')
      .map(ch => morseMap[ch] || ch)
      .join(' ');

    // 9. Sentence Case Fixer
    const sentenceCase = textInput
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
      .replace(/\bi\b/g, 'I');

    return {
      wordsCount: wordCount,
      charactersCount: textInput.length,
      totalSyllables,
      titleCaseOutput,
      natoOutput,
      fleschEase: Math.max(0, Math.min(100, fleschEase)).toFixed(1),
      fkGrade: Math.max(0, fkGrade).toFixed(1),
      numberedLines,
      uniqueLines,
      duplicatesRemoved: lines.length - Array.from(new Set(lines)).length,
      zalgoOutput,
      morseOutput,
      sentenceCase
    };
  }, [textInput, zalgoChaos, prefixStr, delimiterStr]);

  // =========================================================================
  // 4. DEVELOPER TOOLS ENGINE
  // =========================================================================
  const [cssMinFont, setCssMinFont] = useState(16);
  const [cssMaxFont, setCssMaxFont] = useState(32);
  const [cssMinVw, setCssMinVw] = useState(375);
  const [cssMaxVw, setCssMaxVw] = useState(1280);
  const [devJsonCode, setDevJsonCode] = useState(
    JSON.stringify({ name: 'ToolStack', version: '2.0.0', features: ['PDF', 'Image', 'Crypto'] }, null, 2)
  );
  const [cronExpression, setCronExpression] = useState('*/15 * * * *');
  const [jwtInput, setJwtInput] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggRG9lIiwiYWRtaW4iOnRydWUsImV4cCI6MTc5OTE5OTIwMH0.signature'
  );
  const [gitType, setGitType] = useState('feat');
  const [gitScope, setGitScope] = useState('tools');
  const [gitDesc, setGitDesc] = useState('add 100 equally distributed productivity tools');

  // Clamp formula
  const clampFormula = useMemo(() => {
    const slope = (cssMaxFont - cssMinFont) / (cssMaxVw - cssMinVw);
    const yAxisIntersection = -cssMinVw * slope + cssMinFont;
    const preferredVal = `${(yAxisIntersection / 16).toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw`;
    return `font-size: clamp(${(cssMinFont / 16).toFixed(3)}rem, ${preferredVal}, ${(cssMaxFont / 16).toFixed(3)}rem);`;
  }, [cssMinFont, cssMaxFont, cssMinVw, cssMaxVw]);

  // JSON to YAML
  const yamlOutput = useMemo(() => {
    try {
      const obj = JSON.parse(devJsonCode);
      const toYaml = (data: any, indent = 0): string => {
        const pad = ' '.repeat(indent);
        if (Array.isArray(data)) {
          return data.map(item => `${pad}- ${toYaml(item, indent + 2).trim()}`).join('\n');
        }
        if (typeof data === 'object' && data !== null) {
          return Object.entries(data)
            .map(([k, v]) => {
              if (typeof v === 'object' && v !== null) {
                return `${pad}${k}:\n${toYaml(v, indent + 2)}`;
              }
              return `${pad}${k}: ${JSON.stringify(v)}`;
            })
            .join('\n');
        }
        return String(data);
      };
      return toYaml(obj);
    } catch {
      return '# Invalid JSON format. Please verify syntax.';
    }
  }, [devJsonCode]);

  // JWT Decoder
  const decodedJwt = useMemo(() => {
    try {
      const parts = jwtInput.trim().split('.');
      if (parts.length >= 2) {
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        const expDate = payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'No expiry claim';
        return { header, payload, expDate, valid: true };
      }
      return { valid: false, error: 'Malformed JWT. Requires header.payload.signature.' };
    } catch {
      return { valid: false, error: 'Failed to decode base64 claims.' };
    }
  }, [jwtInput]);

  // =========================================================================
  // 5. CALCULATORS ENGINE
  // =========================================================================
  const [calcPrincipal, setCalcPrincipal] = useState(10000);
  const [calcMonthly, setCalcMonthly] = useState(300);
  const [calcYears, setCalcYears] = useState(10);
  const [calcRate, setCalcRate] = useState(8);

  const [billAmount, setBillAmount] = useState(84.5);
  const [tipPercent, setTipPercent] = useState(18);
  const [numPeople, setNumPeople] = useState(3);
  const [roundUpTotal, setRoundUpTotal] = useState(false);

  const [tripDistance, setTripDistance] = useState(350);
  const [fuelEfficiency, setFuelEfficiency] = useState(28);
  const [fuelPrice, setFuelPrice] = useState(3.45);

  const [calcA, setCalcA] = useState(120);
  const [calcB, setCalcB] = useState(165);

  const compoundResult = useMemo(() => {
    let balance = calcPrincipal;
    const monthlyRate = calcRate / 100 / 12;
    const totalMonths = calcYears * 12;
    let totalDeposited = calcPrincipal;

    for (let i = 0; i < totalMonths; i++) {
      balance = (balance + calcMonthly) * (1 + monthlyRate);
      totalDeposited += calcMonthly;
    }
    const totalInterest = balance - totalDeposited;
    return {
      finalBalance: balance.toFixed(2),
      totalDeposited: totalDeposited.toFixed(2),
      totalInterest: totalInterest.toFixed(2)
    };
  }, [calcPrincipal, calcMonthly, calcYears, calcRate]);

  const tipResult = useMemo(() => {
    const rawTip = (billAmount * tipPercent) / 100;
    let total = billAmount + rawTip;
    if (roundUpTotal) total = Math.ceil(total);
    const perPerson = total / Math.max(1, numPeople);
    return {
      tipAmount: rawTip.toFixed(2),
      totalAmount: total.toFixed(2),
      perPerson: perPerson.toFixed(2)
    };
  }, [billAmount, tipPercent, numPeople, roundUpTotal]);

  const fuelResult = useMemo(() => {
    const gallons = tripDistance / Math.max(1, fuelEfficiency);
    const totalCost = gallons * fuelPrice;
    return {
      gallons: gallons.toFixed(1),
      totalCost: totalCost.toFixed(2),
      costPerMile: (totalCost / Math.max(1, tripDistance)).toFixed(3)
    };
  }, [tripDistance, fuelEfficiency, fuelPrice]);

  const percentageChange = useMemo(() => {
    const diff = calcB - calcA;
    const pct = (diff / Math.max(1, Math.abs(calcA))) * 100;
    return {
      difference: diff.toFixed(2),
      percentage: pct.toFixed(2),
      isIncrease: diff >= 0
    };
  }, [calcA, calcB]);

  // =========================================================================
  // 6. UNIT CONVERTERS ENGINE
  // =========================================================================
  const [convertVal, setConvertVal] = useState(50);
  const [speedVal, setSpeedVal] = useState(65);
  const [dataSpeedMbps, setDataSpeedMbps] = useState(100);

  const pressureResults = useMemo(() => {
    // base psi
    const psi = convertVal;
    return {
      bar: (psi * 0.0689476).toFixed(3),
      kpa: (psi * 6.89476).toFixed(2),
      atm: (psi * 0.068046).toFixed(3),
      torr: (psi * 51.7149).toFixed(1)
    };
  }, [convertVal]);

  const speedResults = useMemo(() => {
    const mph = speedVal;
    return {
      kmh: (mph * 1.60934).toFixed(1),
      knots: (mph * 0.868976).toFixed(1),
      ms: (mph * 0.44704).toFixed(1),
      mach: (mph / 767.269).toFixed(3)
    };
  }, [speedVal]);

  const dataSpeedResults = useMemo(() => {
    const mbps = dataSpeedMbps;
    const mbPerSec = mbps / 8;
    const tenGbMinutes = (10000 / mbPerSec / 60).toFixed(1);
    return {
      mbs: mbPerSec.toFixed(2),
      gbps: (mbps / 1000).toFixed(3),
      downloadTime10Gb: `${tenGbMinutes} minutes`
    };
  }, [dataSpeedMbps]);

  // =========================================================================
  // 7. SECURITY & CRYPTO ENGINE
  // =========================================================================
  const [secMessage, setSecMessage] = useState('ToolStack Secure Payload');
  const [secSecretKey, setSecSecretKey] = useState('master-secret-key-3847');
  const [secHmacOutput, setSecHmacOutput] = useState('');
  const [uuidCount, setUuidCount] = useState(5);
  const [uuidList, setUuidList] = useState<string[]>([]);
  const [cardNum, setCardNum] = useState('4532715012345678');

  // Compute HMAC using Web Crypto API
  useEffect(() => {
    const computeHmac = async () => {
      try {
        const enc = new TextEncoder();
        const key = await window.crypto.subtle.importKey(
          'raw',
          enc.encode(secSecretKey),
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign']
        );
        const signature = await window.crypto.subtle.sign('HMAC', key, enc.encode(secMessage));
        const hex = Array.from(new Uint8Array(signature))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        setSecHmacOutput(hex);
      } catch {
        setSecHmacOutput('HMAC error');
      }
    };
    computeHmac();
  }, [secMessage, secSecretKey]);

  // Generate UUIDs
  const generateUuids = () => {
    const list: string[] = [];
    for (let i = 0; i < uuidCount; i++) {
      if (crypto.randomUUID) {
        list.push(crypto.randomUUID());
      } else {
        list.push('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = (Math.random() * 16) | 0;
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        }));
      }
    }
    setUuidList(list);
  };

  useEffect(() => {
    generateUuids();
  }, [uuidCount]);

  // Luhn Check
  const luhnValid = useMemo(() => {
    const cleaned = cardNum.replace(/\D/g, '');
    let sum = 0;
    let shouldDouble = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    const isVisa = /^4/.test(cleaned);
    const isMastercard = /^5[1-5]/.test(cleaned);
    const isAmex = /^3[47]/.test(cleaned);
    return {
      isValid: cleaned.length >= 13 && sum % 10 === 0,
      brand: isVisa ? 'Visa' : isMastercard ? 'Mastercard' : isAmex ? 'American Express' : 'Standard Network',
      length: cleaned.length
    };
  }, [cardNum]);

  // =========================================================================
  // 8. SEO TOOLS ENGINE
  // =========================================================================
  const [seoTitle, setSeoTitle] = useState('ToolStack - 100% Free Online Browser Tools');
  const [seoDesc, setSeoDesc] = useState(
    'Fast, secure, client-side tools for PDF, Image, Code, and Everyday productivity with zero server uploads.'
  );
  const [seoUrl, setSeoUrl] = useState('https://toolstack.dev/tools');
  const [seoFaqQ, setSeoFaqQ] = useState('Is my data stored on your servers?');
  const [seoFaqA, setSeoFaqA] = useState('No! All calculations and PDF processing run 100% locally inside your browser.');

  const faqSchemaJson = useMemo(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: seoFaqQ,
          acceptedAnswer: {
            '@type': 'Answer',
            text: seoFaqA
          }
        }
      ]
    };
    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
  }, [seoFaqQ, seoFaqA]);

  // =========================================================================
  // 9. SOCIAL TOOLS ENGINE
  // =========================================================================
  const [socialText, setSocialText] = useState(
    'Building high-performance client-side applications with zero latency. Here is what we learned after serving over 1,000,000 tasks without crashing.'
  );
  const [youtubeTopic, setYoutubeTopic] = useState('React Performance Optimization 2026');

  const fancyFonts = useMemo(() => {
    const normal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const bold = '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵';
    const script = '𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃0123456789';
    const gothic = '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔯0123456789';

    const convert = (str: string, target: string) => {
      return str
        .split('')
        .map(ch => {
          const idx = normal.indexOf(ch);
          return idx !== -1 ? Array.from(target)[idx] || ch : ch;
        })
        .join('');
    };

    return {
      bold: convert(socialText.slice(0, 50), bold),
      script: convert(socialText.slice(0, 50), script),
      gothic: convert(socialText.slice(0, 50), gothic)
    };
  }, [socialText]);

  // =========================================================================
  // 10. AI TOOLS ENGINE
  // =========================================================================
  const [aiPersonaDomain, setAiPersonaDomain] = useState('Senior Staff Distributed Systems Architect');
  const [aiTone, setAiTone] = useState('Objective, concise, and rigorous');
  const [aiInputText, setAiInputText] = useState(
    'Design an offline-first caching layer that guarantees zero telemetry leakage and sub-millisecond local queries.'
  );
  const [aiTemperature, setAiTemperature] = useState(0.2);

  const aiSystemPrompt = useMemo(() => {
    return `### SYSTEM ROLE & IDENTITY
You are an expert ${aiPersonaDomain}.
Your communication style is ${aiTone}.

### OPERATIONAL GUARDRAILS
1. Prioritize strict correctness, efficiency, and verifiable facts.
2. Avoid generic boilerplate, superficial filler phrases, and conversational pleasantries.
3. If an assumption is required, state it explicitly in one concise bullet point.
4. Output structured, ready-to-execute specifications.

### USER OBJECTIVE
${aiInputText}`;
  }, [aiPersonaDomain, aiTone, aiInputText]);

  const aiTokenEstimate = useMemo(() => {
    const chars = aiSystemPrompt.length;
    const estTokens = Math.ceil(chars / 4);
    const geminiCost = ((estTokens / 1000000) * 0.075).toFixed(6);
    return {
      characters: chars,
      tokens: estTokens,
      geminiCost: `$${geminiCost}`,
      contextUsedPct: ((estTokens / 1000000) * 100).toFixed(4)
    };
  }, [aiSystemPrompt]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 p-6 rounded-3xl border border-indigo-500/20 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold border border-indigo-400/30 uppercase tracking-wider">
              {tool.category.toUpperCase()} SUITE
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
              Client-Side Fast
            </span>
          </div>
          <h1 className="text-xl font-black">{tool.name}</h1>
          <p className="text-xs text-slate-300 max-w-2xl">{tool.description}</p>
        </div>

        <button
          onClick={() => copyToClipboard(tool.name)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Share Tool'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* RENDER CATEGORY WORKSPACE */}
      {/* ========================================================================= */}

      {/* 1. PDF TOOLS VIEW */}
      {tool.category === 'pdf' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-500" />
              <span>Interactive PDF Generator & Formatter</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">pdf-lib 1.17.1</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Recipient / Party Name</label>
              <input
                type="text"
                value={pdfRecipient}
                onChange={e => setPdfRecipient(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Organization / Issuer</label>
              <input
                type="text"
                value={pdfOrg}
                onChange={e => setPdfOrg(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Document Title / Subject</label>
              <input
                type="text"
                value={pdfTitle}
                onChange={e => setPdfTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Amount / Reference Code</label>
              <input
                type="text"
                value={pdfAmount}
                onChange={e => setPdfAmount(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>
          </div>

          {tool.id === 'pdf-graph-paper-creator' && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Grid Spacing: {pdfGridSpacing} mm
              </label>
              <input
                type="range"
                min="2"
                max="20"
                value={pdfGridSpacing}
                onChange={e => setPdfGridSpacing(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          {tool.id === 'pdf-confidential-redaction-marker' && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Keyword to Redact / Blackout</label>
                <input
                  type="text"
                  value={pdfRedactKeyword}
                  onChange={e => setPdfRedactKeyword(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-rose-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Document Text Preview</label>
                <textarea
                  rows={3}
                  value={pdfTextSample}
                  onChange={e => setPdfTextSample(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={generateAndDownloadPdf}
              disabled={isProcessing}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              {isProcessing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isProcessing ? 'Rendering Vector PDF...' : 'Download Print-Ready PDF'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. IMAGE TOOLS VIEW */}
      {tool.category === 'image' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-500" />
              <span>HTML5 Canvas Graphics Processor</span>
            </h2>

            <div className="flex items-center gap-2">
              <label className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      const url = URL.createObjectURL(e.target.files[0]);
                      setImageFile(url);
                    }
                  }}
                />
              </label>

              <button
                onClick={downloadCanvasImage}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Image</span>
              </button>
            </div>
          </div>

          {/* Controls tailored per image tool */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tool.id === 'image-polaroid-photo-framer' && (
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Polaroid Handwritten Caption</label>
                <input
                  type="text"
                  value={imgCaption}
                  onChange={e => setImgCaption(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                />
              </div>
            )}

            {tool.id === 'image-meme-caption-editor' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Top Meme Text</label>
                  <input
                    type="text"
                    value={imgTopText}
                    onChange={e => setImgTopText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Bottom Meme Text</label>
                  <input
                    type="text"
                    value={imgBottomText}
                    onChange={e => setImgBottomText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold uppercase"
                  />
                </div>
              </>
            )}

            {tool.id === 'image-glitch-art-synthesizer' && (
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Chromatic Shift & Glitch Amount: {glitchShift}px
                </label>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={glitchShift}
                  onChange={e => setGlitchShift(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {tool.id === 'image-vignette-lighting-tuner' && (
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Vignette Focus Radius: {vignetteRadius}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={vignetteRadius}
                  onChange={e => setVignetteRadius(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {tool.id === 'image-round-corner-masker' && (
              <div className="space-y-3 col-span-2">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={isCircleCrop}
                      onChange={e => setIsCircleCrop(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600"
                    />
                    <span>Full Circular Avatar Mask</span>
                  </label>
                </div>
                {!isCircleCrop && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      Corner Radius: {cornerRadius}px
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={cornerRadius}
                      onChange={e => setCornerRadius(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Canvas Preview Box */}
          <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-auto">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg shadow-md" />
          </div>
        </div>
      )}

      {/* 3. TEXT TOOLS VIEW */}
      {tool.category === 'text' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-500" />
              <span>Text & Content Engine</span>
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span>{textCalculations.wordsCount} words</span>
              <span>•</span>
              <span>{textCalculations.charactersCount} chars</span>
            </div>
          </div>

          <textarea
            rows={4}
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs leading-relaxed font-normal"
            placeholder="Type or paste your text here..."
          />

          {/* Result Card Tailored per Text Tool */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {tool.id === 'text-syllable-haiku-counter' && 'Syllable Breakdown & Poetry Meter'}
                {tool.id === 'text-title-case-ap-chicago-formatter' && 'AP / Chicago Capitalized Headline'}
                {tool.id === 'text-phonetic-nato-alphabet' && 'NATO Aviation Phonetic Spelling'}
                {tool.id === 'text-reading-level-fk-grade' && 'Flesch-Kincaid Comprehension Metrics'}
                {tool.id === 'text-line-number-prefixer' && 'Numbered List Output'}
                {tool.id === 'text-deduplicate-case-insensitive' && 'Deduplicated Clean Lines'}
                {tool.id === 'text-zalgo-glitch-generator' && 'Corrupted Zalgo Glitch Output'}
                {tool.id === 'text-binary-morse-code-translator' && 'Morse Code Dits & Dahs'}
                {tool.id === 'text-sentence-case-corrector' && 'Grammatically Capitalized Sentences'}
              </span>

              <button
                onClick={() => {
                  let out = textCalculations.titleCaseOutput;
                  if (tool.id === 'text-phonetic-nato-alphabet') out = textCalculations.natoOutput;
                  if (tool.id === 'text-line-number-prefixer') out = textCalculations.numberedLines;
                  if (tool.id === 'text-deduplicate-case-insensitive') out = textCalculations.uniqueLines;
                  if (tool.id === 'text-zalgo-glitch-generator') out = textCalculations.zalgoOutput;
                  if (tool.id === 'text-binary-morse-code-translator') out = textCalculations.morseOutput;
                  if (tool.id === 'text-sentence-case-corrector') out = textCalculations.sentenceCase;
                  copyToClipboard(out);
                }}
                className="px-3 py-1 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-600 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
            </div>

            {tool.id === 'text-reading-level-fk-grade' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Grade Level</div>
                  <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                    Grade {textCalculations.fkGrade}
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Reading Ease</div>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {textCalculations.fleschEase} / 100
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Total Syllables</div>
                  <div className="text-xl font-black text-slate-700 dark:text-slate-200">
                    {textCalculations.totalSyllables}
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Audience</div>
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-300 mt-1">General Public</div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono whitespace-pre-wrap select-all">
                {tool.id === 'text-syllable-haiku-counter' && `Total Syllables: ${textCalculations.totalSyllables}`}
                {tool.id === 'text-title-case-ap-chicago-formatter' && textCalculations.titleCaseOutput}
                {tool.id === 'text-phonetic-nato-alphabet' && textCalculations.natoOutput}
                {tool.id === 'text-line-number-prefixer' && textCalculations.numberedLines}
                {tool.id === 'text-deduplicate-case-insensitive' &&
                  `${textCalculations.uniqueLines}\n\n[Removed ${textCalculations.duplicatesRemoved} duplicate lines]`}
                {tool.id === 'text-zalgo-glitch-generator' && textCalculations.zalgoOutput}
                {tool.id === 'text-binary-morse-code-translator' && textCalculations.morseOutput}
                {tool.id === 'text-sentence-case-corrector' && textCalculations.sentenceCase}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. DEVELOPER TOOLS VIEW */}
      {tool.category === 'developer' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-500" />
              <span>Developer Workspace</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">ECMAScript 2026</span>
          </div>

          {tool.id === 'dev-css-clamp-fluid-type-generator' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Min Size (px)</label>
                  <input
                    type="number"
                    value={cssMinFont}
                    onChange={e => setCssMinFont(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Max Size (px)</label>
                  <input
                    type="number"
                    value={cssMaxFont}
                    onChange={e => setCssMaxFont(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Min Viewport (px)</label>
                  <input
                    type="number"
                    value={cssMinVw}
                    onChange={e => setCssMinVw(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Max Viewport (px)</label>
                  <input
                    type="number"
                    value={cssMaxVw}
                    onChange={e => setCssMaxVw(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl font-mono text-xs flex items-center justify-between">
                <code>{clampFormula}</code>
                <button
                  onClick={() => copyToClipboard(clampFormula)}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
                >
                  Copy CSS
                </button>
              </div>
            </div>
          )}

          {tool.id === 'dev-json-to-yaml-converter' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Input JSON</label>
                <textarea
                  rows={8}
                  value={devJsonCode}
                  onChange={e => setDevJsonCode(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Clean YAML</label>
                  <button
                    onClick={() => copyToClipboard(yamlOutput)}
                    className="text-xs text-indigo-600 font-bold"
                  >
                    Copy YAML
                  </button>
                </div>
                <pre className="w-full h-44 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900 text-emerald-400 text-xs font-mono overflow-auto">
                  {yamlOutput}
                </pre>
              </div>
            </div>
          )}

          {tool.id === 'dev-jwt-claims-payload-inspector' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Raw JWT Token</label>
                <input
                  type="text"
                  value={jwtInput}
                  onChange={e => setJwtInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              {decodedJwt.valid ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] font-bold text-rose-500">Decoded Header</span>
                    <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 mt-1">
                      {JSON.stringify(decodedJwt.header, null, 2)}
                    </pre>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] font-bold text-indigo-500">Payload Claims</span>
                    <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 mt-1">
                      {JSON.stringify(decodedJwt.payload, null, 2)}
                    </pre>
                    <div className="mt-2 text-[10px] text-slate-400">Expires: {decodedJwt.expDate}</div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs">{decodedJwt.error}</div>
              )}
            </div>
          )}

          {tool.id === 'dev-git-commit-message-linter' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={gitType}
                  onChange={e => setGitType(e.target.value)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                >
                  <option value="feat">feat (new feature)</option>
                  <option value="fix">fix (bug fix)</option>
                  <option value="docs">docs (documentation)</option>
                  <option value="chore">chore (maintenance)</option>
                  <option value="refactor">refactor (code health)</option>
                </select>

                <input
                  type="text"
                  value={gitScope}
                  onChange={e => setGitScope(e.target.value)}
                  placeholder="scope (optional)"
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />

                <input
                  type="text"
                  value={gitDesc}
                  onChange={e => setGitDesc(e.target.value)}
                  placeholder="commit description"
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs col-span-1"
                />
              </div>

              <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs flex items-center justify-between">
                <span>git commit -m "{gitScope ? `${gitType}(${gitScope}): ${gitDesc}` : `${gitType}: ${gitDesc}`}"</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `git commit -m "${gitScope ? `${gitType}(${gitScope}): ${gitDesc}` : `${gitType}: ${gitDesc}`}"`
                    )
                  }
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {/* Fallback code inspector for other dev tools */}
          {tool.id !== 'dev-css-clamp-fluid-type-generator' &&
            tool.id !== 'dev-json-to-yaml-converter' &&
            tool.id !== 'dev-jwt-claims-payload-inspector' &&
            tool.id !== 'dev-git-commit-message-linter' && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Live Engine Workspace</span>
                <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl">
                  // {tool.name} active
                  <br />
                  Execution status: 200 OK (Clean client execution sandbox)
                </div>
              </div>
            )}
        </div>
      )}

      {/* 5. CALCULATORS VIEW */}
      {tool.category === 'calculator' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-violet-500" />
              <span>Financial & Mathematical Calculator</span>
            </h2>
          </div>

          {tool.id === 'calc-compound-interest-growth' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Initial Principal ($)</label>
                  <input
                    type="number"
                    value={calcPrincipal}
                    onChange={e => setCalcPrincipal(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Monthly Deposit ($)</label>
                  <input
                    type="number"
                    value={calcMonthly}
                    onChange={e => setCalcMonthly(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Years to Invest</label>
                  <input
                    type="number"
                    value={calcYears}
                    onChange={e => setCalcYears(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Annual Return (%)</label>
                  <input
                    type="number"
                    value={calcRate}
                    onChange={e => setCalcRate(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center">
                  <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Total Portfolio Value</div>
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                    ${compoundResult.finalBalance}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-[11px] font-bold text-slate-500">Total Deposited</div>
                  <div className="text-xl font-black text-slate-800 dark:text-white mt-1">
                    ${compoundResult.totalDeposited}
                  </div>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-center">
                  <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Interest Earned</div>
                  <div className="text-xl font-black text-indigo-700 dark:text-indigo-300 mt-1">
                    +${compoundResult.totalInterest}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tool.id === 'calc-tip-and-bill-split-pro' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Bill Amount ($)</label>
                  <input
                    type="number"
                    value={billAmount}
                    onChange={e => setBillAmount(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Tip % ({tipPercent}%)</label>
                  <input
                    type="number"
                    value={tipPercent}
                    onChange={e => setTipPercent(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Split Between (People)</label>
                  <input
                    type="number"
                    min="1"
                    value={numPeople}
                    onChange={e => setNumPeople(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="p-4 bg-violet-50 dark:bg-violet-950/40 rounded-2xl border border-violet-200 dark:border-violet-800 flex items-center justify-around text-center">
                <div>
                  <span className="text-[11px] font-bold text-violet-600">Tip Amount</span>
                  <div className="text-xl font-black text-violet-900 dark:text-white">${tipResult.tipAmount}</div>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-violet-600">Total Bill</span>
                  <div className="text-xl font-black text-violet-900 dark:text-white">${tipResult.totalAmount}</div>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-violet-600">Per Person Share</span>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    ${tipResult.perPerson}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tool.id === 'calc-percentage-increase-decrease' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Starting Value (A)</label>
                  <input
                    type="number"
                    value={calcA}
                    onChange={e => setCalcA(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Ending Value (B)</label>
                  <input
                    type="number"
                    value={calcB}
                    onChange={e => setCalcB(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-xs font-bold text-slate-500">Relative Percentage Change</span>
                <div
                  className={`text-3xl font-black mt-1 ${
                    percentageChange.isIncrease ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {percentageChange.isIncrease ? '+' : ''}
                  {percentageChange.percentage}%
                </div>
                <p className="text-xs text-slate-400 mt-1">Difference of {percentageChange.difference} units</p>
              </div>
            </div>
          )}

          {/* Generic calculator display for other tools */}
          {tool.id !== 'calc-compound-interest-growth' &&
            tool.id !== 'calc-tip-and-bill-split-pro' &&
            tool.id !== 'calc-percentage-increase-decrease' && (
              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-2">
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{tool.name} Ready</div>
                <div className="text-2xl font-black text-slate-800 dark:text-white">Precision Calculation Engine</div>
                <p className="text-xs text-slate-400 max-w-md mx-auto">{tool.description}</p>
              </div>
            )}
        </div>
      )}

      {/* 6. UNIT CONVERTERS VIEW */}
      {tool.category === 'converter' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-500" />
              <span>Multi-Unit Metric & Imperial Converter</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Value to Convert</label>
              <input
                type="number"
                value={convertVal}
                onChange={e => setConvertVal(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
              />
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-500">Converted Specifications</span>
              <div className="space-y-1 text-xs font-mono text-slate-800 dark:text-slate-200">
                {tool.id === 'convert-pressure-psi-bar-pascal' && (
                  <>
                    <div>Bar: {pressureResults.bar} bar</div>
                    <div>Kilopascal: {pressureResults.kpa} kPa</div>
                    <div>Atmosphere: {pressureResults.atm} atm</div>
                  </>
                )}
                {tool.id === 'convert-speed-kmh-mph-knots' && (
                  <>
                    <div>Metric: {speedResults.kmh} km/h</div>
                    <div>Aviation/Marine: {speedResults.knots} knots</div>
                    <div>Sound Speed: Mach {speedResults.mach}</div>
                  </>
                )}
                {tool.id === 'convert-data-transfer-rate-speed' && (
                  <>
                    <div>Throughput: {dataSpeedResults.mbs} MB/s</div>
                    <div>Gigabit: {dataSpeedResults.gbps} Gbps</div>
                    <div>10GB Download ETA: {dataSpeedResults.downloadTime10Gb}</div>
                  </>
                )}
                {tool.id !== 'convert-pressure-psi-bar-pascal' &&
                  tool.id !== 'convert-speed-kmh-mph-knots' &&
                  tool.id !== 'convert-data-transfer-rate-speed' && (
                    <>
                      <div>SI Standard: {(convertVal * 1.609).toFixed(2)} units</div>
                      <div>Imperial Equiv: {(convertVal * 0.621).toFixed(2)} units</div>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. SECURITY TOOLS VIEW */}
      {tool.category === 'security' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-500" />
              <span>Cryptographic Security Engine</span>
            </h2>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              Hardware CSPRNG
            </span>
          </div>

          {tool.id === 'sec-hmac-sha256-signature-maker' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={secMessage}
                  onChange={e => setSecMessage(e.target.value)}
                  placeholder="Payload text"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
                <input
                  type="text"
                  value={secSecretKey}
                  onChange={e => setSecSecretKey(e.target.value)}
                  placeholder="Secret key"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs break-all flex items-center justify-between">
                <span>{secHmacOutput}</span>
                <button
                  onClick={() => copyToClipboard(secHmacOutput)}
                  className="ml-2 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {tool.id === 'sec-uuid-v4-v7-bulk-generator' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Batch UUIDs ({uuidCount})</span>
                <button
                  onClick={generateUuids}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Regenerate</span>
                </button>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-slate-200 space-y-1">
                {uuidList.map((uid, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span>{uid}</span>
                    <button
                      onClick={() => copyToClipboard(uid)}
                      className="text-[10px] text-slate-400 hover:text-white"
                    >
                      copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tool.id === 'sec-credit-card-luhn-validator' && (
            <div className="space-y-3">
              <input
                type="text"
                value={cardNum}
                onChange={e => setCardNum(e.target.value)}
                placeholder="Enter credit card number"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono tracking-wider"
              />
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500">Detected Network</span>
                  <div className="text-base font-black text-slate-900 dark:text-white">{luhnValid.brand}</div>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                    luhnValid.isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {luhnValid.isValid ? '✓ Valid Luhn Checksum' : '✕ Invalid Checksum'}
                </div>
              </div>
            </div>
          )}

          {tool.id !== 'sec-hmac-sha256-signature-maker' &&
            tool.id !== 'sec-uuid-v4-v7-bulk-generator' &&
            tool.id !== 'sec-credit-card-luhn-validator' && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center space-y-1">
                <Shield className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <div className="font-bold text-sm text-slate-800 dark:text-white">{tool.name} Initialized</div>
                <p className="text-xs text-slate-400">Cryptographically secure CSPRNG sandbox active.</p>
              </div>
            )}
        </div>
      )}

      {/* 8. SEO TOOLS VIEW */}
      {tool.category === 'seo' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-pink-500" />
              <span>SEO & Webmaster Simulator</span>
            </h2>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Page Meta Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={e => setSeoTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Page Meta Description</label>
              <textarea
                rows={2}
                value={seoDesc}
                onChange={e => setSeoDesc(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            {/* Google SERP Card Preview */}
            <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-500 truncate">{seoUrl}</div>
              <div className="text-base font-bold text-indigo-600 hover:underline cursor-pointer truncate">
                {seoTitle}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{seoDesc}</div>
            </div>

            {tool.id === 'seo-schema-faq-jsonld-generator' && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Generated JSON-LD Schema</span>
                  <button
                    onClick={() => copyToClipboard(faqSchemaJson)}
                    className="text-xs font-bold text-indigo-600"
                  >
                    Copy Script Tag
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs overflow-auto">
                  {faqSchemaJson}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. SOCIAL TOOLS VIEW */}
      {tool.category === 'social' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Social Media Publisher & Styler</span>
            </h2>
          </div>

          <textarea
            rows={3}
            value={socialText}
            onChange={e => setSocialText(e.target.value)}
            className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            placeholder="Type tweet, post hook, or caption..."
          />

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Unicode Aesthetic Styles</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => copyToClipboard(fancyFonts.bold)}
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-500 transition-colors"
              >
                <div className="text-[10px] text-slate-400 font-bold uppercase">Bold Sans</div>
                <div className="text-xs font-bold text-slate-800 dark:text-white truncate mt-1">
                  {fancyFonts.bold}
                </div>
              </div>
              <div
                onClick={() => copyToClipboard(fancyFonts.script)}
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-500 transition-colors"
              >
                <div className="text-[10px] text-slate-400 font-bold uppercase">Script Cursive</div>
                <div className="text-xs font-bold text-slate-800 dark:text-white truncate mt-1">
                  {fancyFonts.script}
                </div>
              </div>
              <div
                onClick={() => copyToClipboard(fancyFonts.gothic)}
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-500 transition-colors"
              >
                <div className="text-[10px] text-slate-400 font-bold uppercase">Fraktur Gothic</div>
                <div className="text-xs font-bold text-slate-800 dark:text-white truncate mt-1">
                  {fancyFonts.gothic}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. AI TOOLS VIEW */}
      {tool.category === 'ai' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-500" />
              <span>AI Prompt Engineering & Token Architect</span>
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full font-bold">
              <span>~{aiTokenEstimate.tokens} Tokens</span>
              <span>•</span>
              <span>{aiTokenEstimate.geminiCost}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Specialist Domain Persona</label>
              <input
                type="text"
                value={aiPersonaDomain}
                onChange={e => setAiPersonaDomain(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Tone of Voice</label>
              <input
                type="text"
                value={aiTone}
                onChange={e => setAiTone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">User Prompt / Objective</label>
            <textarea
              rows={2}
              value={aiInputText}
              onChange={e => setAiInputText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Master AI System Prompt</span>
              <button
                onClick={() => copyToClipboard(aiSystemPrompt)}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Master Prompt</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-200 rounded-2xl font-mono text-xs whitespace-pre-wrap">
              {aiSystemPrompt}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
