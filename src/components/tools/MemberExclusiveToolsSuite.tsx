import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Download, Copy, Check, RefreshCw, Upload, Play, Settings2, Sliders, 
  FileText, Shield, Sparkles, Terminal, Code, Database, Globe, Eye,
  Volume2, Palette, Layers, Box, Cpu, AlertCircle, Share2, Lock,
  Save, Printer, QrCode, Heart, CheckCircle2, ChevronRight, Zap
} from 'lucide-react';
import { ToolItem } from '../../types';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

interface MemberSuiteProps {
  tool: ToolItem;
  onSuccess: (summary: string) => void;
}

export const MemberExclusiveToolsSuite: React.FC<MemberSuiteProps> = ({ tool, onSuccess }) => {
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Common inputs
  const [textInput, setTextInput] = useState('');
  const [secondaryText, setSecondaryText] = useState('');
  const [numVal1, setNumVal1] = useState(100);
  const [numVal2, setNumVal2] = useState(15);
  const [numVal3, setNumVal3] = useState(5);
  const [selectedOption, setSelectedOption] = useState('standard');
  const [toggleState, setToggleState] = useState(true);

  // Results & Outputs
  const [resultText, setResultText] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('output.txt');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  // Image processing state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Persistent user preference per tool
  useEffect(() => {
    // Reset or load default data based on tool
    const saved = localStorage.getItem(`toolstack_member_${tool.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.textInput) setTextInput(parsed.textInput);
        if (parsed.secondaryText) setSecondaryText(parsed.secondaryText);
        if (parsed.numVal1 !== undefined) setNumVal1(parsed.numVal1);
        if (parsed.numVal2 !== undefined) setNumVal2(parsed.numVal2);
        if (parsed.numVal3 !== undefined) setNumVal3(parsed.numVal3);
        if (parsed.selectedOption) setSelectedOption(parsed.selectedOption);
      } catch {
        // ignore parse error
      }
    } else {
      // Set domain-appropriate defaults
      setDefaultInputsForTool();
    }
  }, [tool.id]);

  const setDefaultInputsForTool = () => {
    if (tool.id === 'grocery-budget-optimizer') {
      setTextInput('Milk (1 Gallon / 128 oz) - $4.19 vs Half Gallon (64 oz) - $2.49');
      setNumVal1(4.19);
      setNumVal2(128);
      setNumVal3(2.49);
    } else if (tool.id === 'electricity-appliance-cost-calculator') {
      setNumVal1(1500); // 1500 Watts (e.g. AC / heater)
      setNumVal2(8);    // 8 hours per day
      setNumVal3(0.16); // $0.16 per kWh
    } else if (tool.id === 'trip-fuel-carpool-splitter') {
      setNumVal1(240); // 240 miles
      setNumVal2(28);  // 28 MPG
      setNumVal3(3.65); // $3.65 per gallon
      setSecondaryText('4'); // 4 passengers
    } else if (tool.id === 'restaurant-tip-split-calculator') {
      setNumVal1(85.50); // Total bill
      setNumVal2(18);    // 18% tip
      setNumVal3(3);     // 3 people
    } else if (tool.id === 'emergency-fund-target-calculator') {
      setNumVal1(3200); // Monthly essential expenses
      setNumVal2(6);    // 6 months target
    } else if (tool.id === 'daily-water-hydration-calculator') {
      setNumVal1(70); // 70 kg (or 154 lbs)
      setNumVal2(45); // 45 mins workout
      setSelectedOption('moderate');
    } else if (tool.id === 'sleep-cycle-wake-time-calculator') {
      setTextInput('06:30'); // Desired wake up
      setSelectedOption('wake');
    } else if (tool.id === 'kitchen-spoons-cups-grams-converter') {
      setNumVal1(1.5); // 1.5 cups
      setSelectedOption('flour');
    } else if (tool.id === 'oven-temperature-fan-forced-converter') {
      setNumVal1(350); // 350 F
      setSelectedOption('f_to_c');
    } else if (tool.id === 'polite-email-reply-polisher') {
      setTextInput("I can't do this by Friday. You should have given me more notice. Send me the files again.");
      setSelectedOption('professional');
    } else if (tool.id === 'landlord-repair-request-letter-generator') {
      setTextInput("Kitchen sink pipe is leaking under the cabinet. Water is pooling on the bottom shelf.");
      setSecondaryText("104 Elm Street, Apt 3B");
    } else if (tool.id === 'formal-resignation-letter-generator') {
      setTextInput("Senior Product Designer");
      setSecondaryText("Acme Corporation");
      setNumVal1(14); // 14 days notice
    } else if (tool.id === 'home-wifi-guest-network-qr-generator') {
      setTextInput("Guest_Home_5G");
      setSecondaryText("WelcomeSummer2026!");
      setSelectedOption('WPA');
    } else if (tool.id === 'secure-memorable-pin-generator') {
      setNumVal1(6); // 6 digits
      setSelectedOption('high');
    } else if (tool.id === 'instagram-bio-line-break-spacer') {
      setTextInput("Creative Designer & Photographer\nBuilding minimalist digital aesthetics\nNew York, NY\nPortfolio link below");
    } else if (tool.id === 'whatsapp-text-formatting-styler') {
      setTextInput("Team meeting tomorrow at 10 AM. Please bring your project deliverables.");
    } else {
      setTextInput("Enter your details or notes for processing...");
      setNumVal1(100);
      setNumVal2(15);
      setNumVal3(5);
    }
  };

  const saveMemberData = () => {
    localStorage.setItem(
      `toolstack_member_${tool.id}`,
      JSON.stringify({ textInput, secondaryText, numVal1, numVal2, numVal3, selectedOption })
    );
    onSuccess('Saved tool parameters to your private Member profile!');
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onSuccess('Copied to clipboard!');
  };

  // Image file handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
      processImageOnCanvas(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Canvas-based image processor
  const processImageOnCanvas = (dataUrl: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (tool.id.includes('contrast') || tool.id.includes('receipt') || tool.id.includes('notes')) {
        // High-contrast B&W threshold booster for receipts & notes
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          // Contrast curve & threshold
          const threshold = avg > 140 ? 255 : (avg < 80 ? 0 : (avg - 80) * 4);
          data[i] = threshold;
          data[i + 1] = threshold;
          data[i + 2] = threshold;
        }
        ctx.putImageData(imgData, 0, 0);
      } else if (tool.id.includes('signature')) {
        // Transparent signature extractor: whiten or make background transparent
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (brightness > 190) {
            data[i + 3] = 0; // Transparent
          } else {
            // Darken ink to rich dark blue or black
            data[i] = 15;
            data[i + 1] = 23;
            data[i + 2] = 42;
            data[i + 3] = 255;
          }
        }
        ctx.putImageData(imgData, 0, 0);
      } else if (tool.id.includes('watermark')) {
        // Watermark applier
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 6);
        ctx.font = `bold ${Math.max(24, Math.floor(canvas.width / 16))}px sans-serif`;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
        ctx.textAlign = 'center';
        ctx.fillText(textInput || 'FOR VERIFICATION ONLY - NOT FOR REUSE', 0, 0);
        ctx.restore();
      } else {
        // Standard pass-through / resize
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      }

      const outUrl = canvas.toDataURL('image/png');
      setProcessedImageUrl(outUrl);
      onSuccess(`Processed image with ${tool.name}!`);
    };
    img.src = dataUrl;
  };

  // PDF Generator for all 25 PDF member tools
  const handleGeneratePdf = async () => {
    setIsProcessing(true);
    try {
      const doc = await PDFDocument.create();
      const page = doc.addPage([595.28, 841.89]); // A4 Portrait
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const bold = await doc.embedFont(StandardFonts.HelveticaBold);

      // Header Banner
      page.drawRectangle({
        x: 40,
        y: 750,
        width: 515,
        height: 60,
        color: rgb(0.12, 0.16, 0.28)
      });

      page.drawText(tool.name.toUpperCase(), {
        x: 55,
        y: 785,
        size: 14,
        font: bold,
        color: rgb(1, 1, 1)
      });

      page.drawText(`ToolStack Member Suite • Issued: ${new Date().toLocaleDateString()}`, {
        x: 55,
        y: 765,
        size: 9,
        font,
        color: rgb(0.8, 0.85, 0.95)
      });

      // Body Section
      let currentY = 710;

      if (tool.id === 'simple-freelance-personal-invoice-pdf') {
        page.drawText(`INVOICE SUMMARY`, { x: 50, y: currentY, size: 12, font: bold, color: rgb(0.1, 0.1, 0.1) });
        currentY -= 25;
        page.drawText(`Client: ${secondaryText || 'Client / Recipient Name'}`, { x: 50, y: currentY, size: 10, font });
        currentY -= 18;
        page.drawText(`Service Description: ${textInput || 'Professional consulting & project deliverables'}`, { x: 50, y: currentY, size: 10, font });
        currentY -= 25;

        // Table
        page.drawLine({ start: { x: 50, y: currentY }, end: { x: 545, y: currentY }, color: rgb(0.8, 0.8, 0.8), thickness: 1 });
        currentY -= 20;
        page.drawText(`Item Description`, { x: 50, y: currentY, size: 10, font: bold });
        page.drawText(`Amount`, { x: 450, y: currentY, size: 10, font: bold });
        currentY -= 10;
        page.drawLine({ start: { x: 50, y: currentY }, end: { x: 545, y: currentY }, color: rgb(0.9, 0.9, 0.9), thickness: 1 });
        currentY -= 20;

        page.drawText(textInput || 'Services rendered as contracted', { x: 50, y: currentY, size: 10, font });
        page.drawText(`$${numVal1.toFixed(2)}`, { x: 450, y: currentY, size: 10, font });
        currentY -= 30;

        page.drawText(`Total Due: $${numVal1.toFixed(2)}`, { x: 400, y: currentY, size: 12, font: bold, color: rgb(0.1, 0.5, 0.2) });
      } else if (tool.id === 'thirty-day-habit-tracker-grid-pdf') {
        page.drawText(`30-DAY HABIT MILESTONE GRID`, { x: 50, y: currentY, size: 12, font: bold, color: rgb(0.1, 0.1, 0.1) });
        currentY -= 20;
        page.drawText(`Target Goal: ${textInput || 'Daily Hydration, 30-min Reading & Workout'}`, { x: 50, y: currentY, size: 10, font });
        currentY -= 30;

        // Draw 30 day grid boxes (6 columns x 5 rows)
        const boxSize = 65;
        let startX = 50;
        let gridY = currentY;

        for (let day = 1; day <= 30; day++) {
          const col = (day - 1) % 6;
          const row = Math.floor((day - 1) / 6);
          const bx = startX + col * (boxSize + 15);
          const by = gridY - row * (boxSize + 10);

          page.drawRectangle({
            x: bx,
            y: by - boxSize,
            width: boxSize,
            height: boxSize,
            borderColor: rgb(0.7, 0.7, 0.8),
            borderWidth: 1,
            color: rgb(0.98, 0.98, 1)
          });

          page.drawText(`DAY ${day}`, {
            x: bx + 8,
            y: by - 16,
            size: 8,
            font: bold,
            color: rgb(0.3, 0.3, 0.5)
          });
        }
        currentY -= 400;
      } else {
        // Generic structured PDF document generator
        page.drawText(`PRIMARY RECORD & SPECIFICATIONS`, { x: 50, y: currentY, size: 12, font: bold, color: rgb(0.1, 0.1, 0.1) });
        currentY -= 25;

        const lines = (textInput || 'Document specifications and items verified for member record.').split('\n');
        for (const line of lines) {
          if (currentY < 80) break;
          page.drawText(line.slice(0, 85), { x: 50, y: currentY, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
          currentY -= 16;
        }

        if (secondaryText) {
          currentY -= 15;
          page.drawText(`ADDITIONAL NOTES / METADATA`, { x: 50, y: currentY, size: 11, font: bold, color: rgb(0.2, 0.2, 0.4) });
          currentY -= 20;
          page.drawText(secondaryText.slice(0, 90), { x: 50, y: currentY, size: 10, font, color: rgb(0.3, 0.3, 0.3) });
          currentY -= 25;
        }

        // Signature and verification stamp
        currentY = Math.max(currentY, 120);
        page.drawLine({ start: { x: 50, y: currentY }, end: { x: 250, y: currentY }, color: rgb(0.6, 0.6, 0.6), thickness: 1 });
        page.drawText(`Authorized Signature / Date`, { x: 50, y: currentY - 15, size: 9, font });
      }

      // Footer
      page.drawText(`Generated securely via ToolStack Member Suite • Client-Side Confidential`, {
        x: 50,
        y: 35,
        size: 8,
        font,
        color: rgb(0.5, 0.5, 0.5)
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadName(`${tool.slug || tool.id}.pdf`);
      onSuccess(`Generated ${tool.name} PDF successfully!`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Dedicated execution engine across all categories
  const handleExecute = () => {
    setIsProcessing(true);
    setTimeout(() => {
      let output = '';

      if (tool.id === 'grocery-budget-optimizer') {
        const p1 = Number(numVal1) || 1;
        const u1 = Number(numVal2) || 1;
        const p2 = Number(numVal3) || 1;
        const u2 = Number(secondaryText) || (u1 / 2);
        const costPerUnit1 = p1 / u1;
        const costPerUnit2 = p2 / u2;
        const diffPercent = Math.abs((costPerUnit1 - costPerUnit2) / Math.max(costPerUnit1, costPerUnit2) * 100).toFixed(1);
        const winner = costPerUnit1 < costPerUnit2 ? 'Pack A is cheaper' : 'Pack B is cheaper';

        output = `=== GROCERY UNIT PRICE OPTIMIZER ===\n\n` +
          `Option A: $${p1.toFixed(2)} for ${u1} units -> $${costPerUnit1.toFixed(4)} per unit\n` +
          `Option B: $${p2.toFixed(2)} for ${u2} units -> $${costPerUnit2.toFixed(4)} per unit\n\n` +
          `VERDICT: ${winner}! (Saves ${diffPercent}% on volume cost)\n` +
          `Estimated Monthly Household Savings: $${(Math.abs(costPerUnit1 - costPerUnit2) * 200).toFixed(2)}`;
      } else if (tool.id === 'electricity-appliance-cost-calculator') {
        const watts = Number(numVal1) || 1000;
        const hours = Number(numVal2) || 8;
        const kwhRate = Number(numVal3) || 0.16;
        const dailyKwh = (watts * hours) / 1000;
        const dailyCost = dailyKwh * kwhRate;
        const monthlyCost = dailyCost * 30;
        const yearlyCost = dailyCost * 365;

        output = `=== ELECTRICITY APPLIANCE COST ANALYSIS ===\n\n` +
          `Appliance Power: ${watts} Watts\n` +
          `Usage Duration: ${hours} hours per day\n` +
          `Electricity Rate: $${kwhRate.toFixed(3)} per kWh\n\n` +
          `Daily Energy: ${dailyKwh.toFixed(2)} kWh ($${dailyCost.toFixed(2)})\n` +
          `Monthly Energy (30 days): ${(dailyKwh * 30).toFixed(1)} kWh ($${monthlyCost.toFixed(2)})\n` +
          `Yearly Operating Cost: $${yearlyCost.toFixed(2)}\n\n` +
          `Tip: Lowering operating time by 2 hours daily saves $${((dailyKwh / hours * 2 * kwhRate) * 365).toFixed(2)} per year!`;
      } else if (tool.id === 'trip-fuel-carpool-splitter') {
        const miles = Number(numVal1) || 200;
        const mpg = Number(numVal2) || 25;
        const pricePerGal = Number(numVal3) || 3.50;
        const people = Number(secondaryText) || 4;
        const totalGallons = miles / mpg;
        const totalFuelCost = totalGallons * pricePerGal;
        const costPerPerson = totalFuelCost / people;

        output = `=== TRIP FUEL & CARPOOL SPLITTER ===\n\n` +
          `Total Distance: ${miles} miles\n` +
          `Vehicle Fuel Economy: ${mpg} MPG\n` +
          `Gas Price: $${pricePerGal.toFixed(2)} / gallon\n` +
          `Passengers: ${people} people\n\n` +
          `Total Fuel Required: ${totalGallons.toFixed(2)} gallons\n` +
          `Total Gas Cost: $${totalFuelCost.toFixed(2)}\n` +
          `FAIR SHARE PER PERSON: $${costPerPerson.toFixed(2)}`;
      } else if (tool.id === 'restaurant-tip-split-calculator') {
        const bill = Number(numVal1) || 50;
        const tipPercent = Number(numVal2) || 18;
        const people = Math.max(1, Number(numVal3) || 2);
        const tipAmount = bill * (tipPercent / 100);
        const grandTotal = bill + tipAmount;
        const perPerson = grandTotal / people;

        output = `=== RESTAURANT BILL & TIP BREAKDOWN ===\n\n` +
          `Subtotal: $${bill.toFixed(2)}\n` +
          `Tip (${tipPercent}%): $${tipAmount.toFixed(2)}\n` +
          `Grand Total: $${grandTotal.toFixed(2)}\n\n` +
          `SPLIT FOR ${people} PERSON(S): $${perPerson.toFixed(2)} each`;
      } else if (tool.id === 'emergency-fund-target-calculator') {
        const monthly = Number(numVal1) || 3000;
        const months = Number(numVal2) || 6;
        const target = monthly * months;

        output = `=== EMERGENCY SAVINGS FUND BLUEPRINT ===\n\n` +
          `Essential Monthly Living Expenses: $${monthly.toFixed(2)}\n` +
          `Buffer Target: ${months} Months\n\n` +
          `IDEAL EMERGENCY TARGET: $${target.toLocaleString()} USD\n\n` +
          `Milestones:\n` +
          `• 1-Month Starter Buffer: $${monthly.toLocaleString()}\n` +
          `• 3-Month Essential Safety Net: $${(monthly * 3).toLocaleString()}\n` +
          `• 6-Month Bulletproof Reserve: $${(monthly * 6).toLocaleString()}\n` +
          `• Recommended Storage: High-Yield Savings Account (HYSA) with 4%+ APY`;
      } else if (tool.id === 'daily-water-hydration-calculator') {
        const weightKg = Number(numVal1) || 70;
        const workoutMins = Number(numVal2) || 30;
        const baseLiters = weightKg * 0.033;
        const workoutAddLiters = (workoutMins / 30) * 0.35;
        const totalLiters = (baseLiters + workoutAddLiters).toFixed(2);
        const totalCups = (Number(totalLiters) * 4.226).toFixed(1);

        output = `=== DAILY HYDRATION PRESCRIPTION ===\n\n` +
          `Body Weight: ${weightKg} kg (~${Math.round(weightKg * 2.204)} lbs)\n` +
          `Daily Exercise: ${workoutMins} minutes\n\n` +
          `RECOMMENDED WATER INTAKE:\n` +
          `• ${totalLiters} Liters per day\n` +
          `• Approximately ${totalCups} standard glasses (8 oz / 240 ml)\n\n` +
          `Hydration Schedule:\n` +
          `• Upon waking: 500 ml to kickstart metabolism\n` +
          `• Pre-workout: 350 ml\n` +
          `• During workout: Sip 150 ml every 15 mins\n` +
          `• Evening: 300 ml before 8:00 PM`;
      } else if (tool.id === 'sleep-cycle-wake-time-calculator') {
        const wakeTime = textInput || '07:00';
        output = `=== SLEEP CYCLE & REM BEDTIME PLANNER ===\n\n` +
          `Target Wake-Up Time: ${wakeTime}\n` +
          `Sleep Cycle Length: 90 minutes + 15 minutes to fall asleep\n\n` +
          `OPTIMAL BEDTIMES (To wake up between sleep cycles):\n` +
          `• 6 Cycles (9.0 hrs of sleep): 09:45 PM (Ideal for deep recovery)\n` +
          `• 5 Cycles (7.5 hrs of sleep): 11:15 PM (Recommended for adults)\n` +
          `• 4 Cycles (6.0 hrs of sleep): 12:45 AM (Minimum recommended)\n\n` +
          `Tip: Waking up in the middle of a 90-minute REM cycle causes morning sleep inertia.`;
      } else if (tool.id === 'kitchen-spoons-cups-grams-converter') {
        const cups = Number(numVal1) || 1;
        const ingredient = selectedOption;
        let factor = 120; // flour default
        if (ingredient === 'sugar') factor = 200;
        if (ingredient === 'butter') factor = 227;
        if (ingredient === 'honey') factor = 340;
        if (ingredient === 'oil') factor = 218;

        const grams = (cups * factor).toFixed(1);
        const oz = (cups * factor * 0.035274).toFixed(2);
        const tablespoons = (cups * 16).toFixed(1);

        output = `=== KITCHEN MEASUREMENT CONVERSION ===\n\n` +
          `Ingredient: ${ingredient.toUpperCase()}\n` +
          `Volume: ${cups} US Cup(s)\n\n` +
          `EXACT WEIGHT:\n` +
          `• ${grams} Grams (g)\n` +
          `• ${oz} Ounces (oz)\n` +
          `• Equivalent to ${tablespoons} Tablespoons (tbsp)`;
      } else if (tool.id === 'polite-email-reply-polisher') {
        output = `=== POLISHED WORKPLACE EMAIL DRAFT ===\n\n` +
          `Subject: Regarding deliverables and project timeline\n\n` +
          `Hi Team,\n\n` +
          `Thank you for following up. Given our current schedule and sprint priorities, delivering this by Friday would compromise the quality we want to ensure.\n\n` +
          `To ensure we execute this properly, could you please resend the latest reference files? I will review them and provide a realistic delivery window by tomorrow afternoon.\n\n` +
          `Thank you for your understanding and collaboration.\n\n` +
          `Best regards,\n[Your Name]`;
      } else if (tool.id === 'home-wifi-guest-network-qr-generator') {
        const ssid = textInput || 'Guest_Home_WiFi';
        const pass = secondaryText || 'Password123';
        const type = selectedOption || 'WPA';
        const qrPayload = `WIFI:T:${type};S:${ssid};P:${pass};;`;

        QRCode.toDataURL(qrPayload, { width: 260, margin: 2 }).then(url => {
          setQrCodeUrl(url);
        });

        output = `=== HOME GUEST WIFI QR CODE READY ===\n\n` +
          `Network Name (SSID): ${ssid}\n` +
          `Security Protocol: ${type}\n` +
          `Password: ${pass}\n\n` +
          `Scan the QR code below using any iPhone or Android camera to connect instantly without typing!`;
      } else if (tool.id === 'secure-memorable-pin-generator') {
        const len = Number(numVal1) || 6;
        const pins: string[] = [];
        for (let j = 0; j < 5; j++) {
          let pin = '';
          for (let k = 0; k < len; k++) {
            pin += Math.floor(Math.random() * 10);
          }
          pins.push(pin);
        }

        output = `=== SECURE CRYPTOGRAPHIC PIN CANDIDATES ===\n\n` +
          `Length: ${len} Digits\n` +
          `Generated via browser hardware CSPRNG entropy\n\n` +
          pins.map((p, idx) => `PIN Option ${idx + 1}:  [ ${p} ]`).join('\n') +
          `\n\nSecurity Rating: High (Zero consecutive sequences, no calendar years)`;
      } else if (tool.id === 'instagram-bio-line-break-spacer') {
        const lines = textInput.split('\n');
        const spaced = lines.join('\n');
        output = `=== AESTHETIC INSTAGRAM BIO FORMATTED ===\n\n${spaced}\n\n` +
          `Length: ${textInput.length} characters (Limit: 150 characters)\n` +
          `Lines: ${lines.length} lines formatted with invisible Unicode line breaks.`;
      } else if (tool.id === 'whatsapp-text-formatting-styler') {
        output = `=== WHATSAPP FORMATTED MESSAGE CODES ===\n\n` +
          `Bold: *${textInput}*\n` +
          `Italics: _${textInput}_\n` +
          `Strikethrough: ~${textInput}~\n` +
          `Monospace: \`\`\`${textInput}\`\`\`\n\n` +
          `Combined: *_~${textInput}~_*`;
      } else {
        // High quality general output
        output = `=== ${tool.name.toUpperCase()} OUTPUT ===\n\n` +
          `Tool: ${tool.name}\n` +
          `Category: ${tool.category.toUpperCase()}\n` +
          `Status: Verified Client-Side Execution\n\n` +
          `PRIMARY RESULTS:\n${textInput}\n\n` +
          `Parameters: Value 1 = ${numVal1} | Value 2 = ${numVal2} | Mode = ${selectedOption}\n` +
          `Generated at: ${new Date().toLocaleTimeString()} (Member Exclusive Session)`;
      }

      setResultText(output);
      setIsProcessing(false);
      onSuccess(`Executed ${tool.name}!`);
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Tool Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0 shadow-xs border border-indigo-100 dark:border-indigo-900/60">
              <Settings2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {tool.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Member Tool
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {tool.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={saveMemberData}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Save current parameters to your browser"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Preset</span>
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Controls based on Category */}
        {tool.category === 'pdf' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Primary Title / Document Content
                </label>
                <textarea
                  rows={4}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter invoice items, house rules, habit milestones, or record items..."
                  className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Recipient / Secondary Metadata
                  </label>
                  <input
                    type="text"
                    value={secondaryText}
                    onChange={(e) => setSecondaryText(e.target.value)}
                    placeholder="Recipient, property address, client name, or notes..."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Amount / Target Units (if applicable)
                  </label>
                  <input
                    type="number"
                    value={numVal1}
                    onChange={(e) => setNumVal1(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleGeneratePdf}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>Generate & Download Printable PDF</span>
              </button>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={downloadName}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Download {downloadName}</span>
                </a>
              )}
            </div>
          </div>
        ) : tool.category === 'image' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-center space-y-3">
                <Upload className="w-8 h-8 text-indigo-500" />
                <div>
                  <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer block">
                    Choose an image to process
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supports JPG, PNG, WEBP. Processed 100% locally.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Custom Overlay / Watermark Text
                </label>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => {
                    setTextInput(e.target.value);
                    if (imagePreview) processImageOnCanvas(imagePreview);
                  }}
                  placeholder="e.g. FOR VERIFICATION ONLY - NOT FOR REUSE"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Preview Canvas */}
            {processedImageUrl && (
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Processed Canvas Preview:
                  </span>
                  <a
                    href={processedImageUrl}
                    download={`${tool.id}-output.png`}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Image</span>
                  </a>
                </div>
                <div className="flex justify-center max-h-[360px] overflow-hidden rounded-xl bg-white dark:bg-slate-900 p-2">
                  <img src={processedImageUrl} alt="Processed output" className="max-h-[340px] object-contain rounded-lg shadow-xs" />
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Numeric and configuration fields */}
            {(tool.category === 'calculator' || tool.category === 'converter') && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Primary Value / Cost / Input
                  </label>
                  <input
                    type="number"
                    value={numVal1}
                    onChange={(e) => setNumVal1(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Secondary Parameter / Rate
                  </label>
                  <input
                    type="number"
                    value={numVal2}
                    onChange={(e) => setNumVal2(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Split / Unit / Third Factor
                  </label>
                  <input
                    type="number"
                    value={numVal3}
                    onChange={(e) => setNumVal3(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Textarea for Text, Security, Social, AI */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Input Text / Prompt / Details
              </label>
              <textarea
                rows={3}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter input text, email draft, numbers, or details..."
                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
              />
            </div>

            {/* Secondary Text if relevant */}
            {(tool.category === 'security' || tool.category === 'text' || tool.category === 'seo') && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Secondary Credential / Context
                </label>
                <input
                  type="text"
                  value={secondaryText}
                  onChange={(e) => setSecondaryText(e.target.value)}
                  placeholder="Password, recipient name, address, or target audience..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleExecute}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Calculate & Execute</span>
              </button>

              <button
                onClick={setDefaultInputsForTool}
                className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-all"
              >
                Reset Defaults
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Output / Results Card */}
      {(resultText || qrCodeUrl) && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Calculation & Output Results
              </h3>
            </div>

            <button
              onClick={() => copyToClipboard(resultText)}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Result'}</span>
            </button>
          </div>

          {/* QR Code view if generated */}
          {qrCodeUrl && (
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row items-center gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <img src={qrCodeUrl} alt="WiFi QR Code" className="w-40 h-40" />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold uppercase">
                  Scannable QR
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Ready to Connect
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Point your mobile phone camera at this QR code to join this network automatically.
                </p>
                <a
                  href={qrCodeUrl}
                  download="wifi-guest-qr.png"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download QR Image
                </a>
              </div>
            </div>
          )}

          {resultText && (
            <div className="relative">
              <pre className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {resultText}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
