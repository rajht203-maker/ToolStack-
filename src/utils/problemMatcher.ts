import { ToolItem } from '../types';
import { TOOLS_DATA } from '../data/toolsData';

export interface ProblemMatchResult {
  tool: ToolItem;
  score: number;
  reason: string;
  isHiEnglish?: boolean;
}

// Preset common user problems and suggestions (English + Hi-English bilingual)
export const POPULAR_PROBLEMS = [
  {
    problem: "Photo ka size kam karna hai ya background hatana hai",
    category: "Image & Media",
    suggestedToolSlug: "image-stamp-signature-cleaner",
    isHiEnglish: true
  },
  {
    problem: "Do ya teen PDF files ko ek sath jodna hai (Merge PDF)",
    category: "PDF & Documents",
    suggestedToolSlug: "pdf-merge",
    isHiEnglish: true
  },
  {
    problem: "PDF file size chota karna hai email bhejne ke liye (Compress PDF)",
    category: "PDF & Documents",
    suggestedToolSlug: "pdf-compress",
    isHiEnglish: true
  },
  {
    problem: "Passport size photo 4x6 sheet pe print karni hai (8-in-1 Grid)",
    category: "Image & Media",
    suggestedToolSlug: "image-passport-size-photo-grid",
    isHiEnglish: true
  },
  {
    problem: "Aadhaar / PAN card print ke liye standard wallet size me set karna",
    category: "PDF & Documents",
    suggestedToolSlug: "pdf-aadhaar-card-print-scaler",
    isHiEnglish: true
  },
  {
    problem: "Shaadi ke liye Matrimonial Biodata PDF format me banana",
    category: "PDF & Documents",
    suggestedToolSlug: "pdf-biodata-marriage-maker",
    isHiEnglish: true
  },
  {
    problem: "Makaan ya dukan ka 11-month Rent Agreement (Kirayanama) banana",
    category: "PDF & Documents",
    suggestedToolSlug: "pdf-rent-agreement-pro-maker",
    isHiEnglish: true
  },
  {
    problem: "Monthly Employee Salary Slip / Payslip voucher generate karna",
    category: "PDF & Documents",
    suggestedToolSlug: "pdf-salary-slip-payslip-generator",
    isHiEnglish: true
  },
  {
    problem: "Mobile photo me handwritten signature ka background hatana (Transparent PNG)",
    category: "Image & Media",
    suggestedToolSlug: "image-stamp-signature-cleaner",
    isHiEnglish: true
  },
  {
    problem: "Ulte scan hue PDF pages ko seedha rotate karna",
    category: "PDF & Documents",
    suggestedToolSlug: "pdf-page-rotator",
    isHiEnglish: true
  },
  {
    problem: "Need a professional business card with company logo and scannable QR code",
    category: "Image & Media",
    suggestedToolSlug: "business-card-maker"
  },
  {
    problem: "Generate custom QR code with company logo in the center for print or web",
    category: "Image & Media",
    suggestedToolSlug: "qr-code-logo-generator"
  },
  {
    problem: "Format passport or visa photos for US, UK, or Schengen standards on 4x6 print sheet",
    category: "Image & Media",
    suggestedToolSlug: "image-passport-visa-photo-maker"
  },
  {
    problem: "Stamp Bates numbering on legal discovery or medical records PDF documents",
    category: "PDF & Documents",
    suggestedToolSlug: "pdf-bates-numbering-tool"
  },
  {
    problem: "Impose multi-page PDF into 2-up or 4-up booklet grid sheets",
    category: "PDF & Documents",
    suggestedToolSlug: "pdf-nup-multi-page-grid"
  },
  {
    problem: "Generate printable lined, 5mm graph, or bullet journal dot-grid paper PDF",
    category: "PDF & Documents",
    suggestedToolSlug: "pdf-printable-lined-graph-paper"
  },
  {
    problem: "Design professional award or completion certificate PDF",
    category: "PDF & Documents",
    suggestedToolSlug: "pdf-certificate-award-maker"
  },
  {
    problem: "Create vintage Polaroid frame with handwritten photo caption",
    category: "Image & Media",
    suggestedToolSlug: "image-polaroid-vintage-frame"
  },
  {
    problem: "Stamp official RECEIVED, APPROVED, or PAID date on PDF pages",
    category: "PDF & Documents",
    suggestedToolSlug: "pdf-timestamp-datestamp-marker"
  },
  {
    problem: "Embed scannable QR verification code directly into PDF corner",
    category: "PDF & Documents",
    suggestedToolSlug: "pdf-add-qr-code-verification"
  },
  {
    problem: "Stamp confidential or copyright watermark on my PDF pages",
    category: "PDF & Documents",
    suggestedToolSlug: "pdf-watermark-stamper"
  },
  {
    problem: "My scanned PDF pages are upside down or sideways and need rotation",
    category: "PDF & Documents",
    suggestedToolSlug: "pdf-page-rotator"
  },
  {
    problem: "My PDF is too big and I can't send it via email",
    category: "PDF & Documents",
    suggestedToolSlug: "pdf-compress"
  },
  {
    problem: "I need to test and verify a Stripe or GitHub webhook HMAC signature",
    category: "Developer",
    suggestedToolSlug: "webhook-tester-simulator"
  },
  {
    problem: "Need to generate realistic fake users and mock JSON data for an API test",
    category: "Developer",
    suggestedToolSlug: "mock-data-generator"
  },
  {
    problem: "Convert my PNG/JPEG images to modern high-speed WebP format",
    category: "Image & Media",
    suggestedToolSlug: "webp-converter"
  },
  {
    problem: "Calculate monthly mortgage payments and full amortization interest schedule",
    category: "Calculators",
    suggestedToolSlug: "loan-amortization-schedule"
  },
  {
    problem: "My SQL query is unformatted, messy, and hard to read",
    category: "Developer",
    suggestedToolSlug: "sql-formatter-pro"
  },
  {
    problem: "Convert SQL CREATE TABLE schema directly into TypeScript interfaces",
    category: "Developer",
    suggestedToolSlug: "sql-to-typescript-converter"
  },
  {
    problem: "Generate high-entropy 256-bit secure API keys and secret tokens",
    category: "Security",
    suggestedToolSlug: "api-key-entropy-generator"
  },
  {
    problem: "Fix CORS errors with proper Access-Control-Allow-Origin response headers",
    category: "Developer",
    suggestedToolSlug: "cors-header-builder"
  },
  {
    problem: "Audit my .env file for leaked secrets, duplicates, and invalid formatting",
    category: "Developer",
    suggestedToolSlug: "env-file-auditor"
  },
  {
    problem: "Convert HTML table markup to GitHub Flavored Markdown table format",
    category: "Developer",
    suggestedToolSlug: "html-table-to-markdown"
  },
  {
    problem: "Calculate IPv4 CIDR subnet masks, usable host ranges, and broadcast IPs",
    category: "Developer",
    suggestedToolSlug: "ipv4-cidr-calculator"
  }
];

// Hi-English & Hinglish Vocabulary and Synonym Normalizer Dictionary
const HI_ENGLISH_DICTIONARY: Record<string, string[]> = {
  // Verbs and actions
  "chota": ["compress", "reduce", "resize", "shrink"],
  "kam": ["compress", "reduce", "decrease"],
  "ghatana": ["compress", "reduce"],
  "kam mb": ["compress", "reduce size"],
  "jodna": ["merge", "combine", "join"],
  "milana": ["merge", "combine"],
  "ek sath": ["merge", "combine"],
  "ek karna": ["merge", "combine"],
  "alag": ["split", "extract", "separate"],
  "nikalna": ["split", "extract", "remove"],
  "todna": ["split"],
  "hatana": ["remove", "delete", "strip", "clean"],
  "hatao": ["remove", "delete"],
  "saaf": ["clean", "purify", "clear"],
  "banana": ["maker", "create", "generate", "builder"],
  "banaye": ["maker", "create", "generate"],
  "banao": ["maker", "create", "generate"],
  "karna hai": ["maker", "solve"],
  "kaise kare": ["how to", "convert", "solve"],
  "kaise karein": ["how to", "solve"],
  "chahiye": ["need", "maker"],
  "badalna": ["convert", "change", "transform"],
  "ghumana": ["rotate", "turn", "orientation"],
  "seedha": ["rotate", "deskew", "straighten"],
  "ulta": ["rotate", "flip", "reverse", "invert"],
  "dhundhla": ["blur", "redact", "hide"],
  "chupana": ["blur", "redact", "hide", "censor"],
  "lock": ["protect", "password", "encrypt"],
  "unlock": ["remove password", "unlock", "decrypt"],
  "sign": ["signature", "stamp"],
  "dastakhat": ["signature", "cleaner"],
  "hastakshar": ["signature"],

  // Nouns and Entities
  "photo": ["image", "picture"],
  "tasveer": ["image", "photo"],
  "chhavi": ["image"],
  "pdf": ["pdf", "document"],
  "kaghaz": ["pdf", "document", "paper"],
  "aadhaar": ["aadhaar", "id card", "scaler"],
  "aadhar": ["aadhaar", "id card", "scaler"],
  "pan card": ["pan card", "id card"],
  "shadi": ["marriage", "matrimonial", "biodata"],
  "shaadi": ["marriage", "matrimonial", "biodata"],
  "vivah": ["marriage", "biodata"],
  "biodata": ["biodata", "resume"],
  "kirayanama": ["rent agreement", "lease"],
  "kiraya": ["rent agreement"],
  "tankhwah": ["salary slip", "payslip"],
  "vetan": ["salary slip", "payslip"],
  "salary slip": ["salary slip", "payslip"],
  "payslip": ["salary slip", "payslip"],
  "bill": ["cash memo", "receipt", "invoice"],
  "rasid": ["receipt", "cash memo", "invoice"],
  "challan": ["delivery challan", "dispatch"],
  "visiting card": ["business card"],
  "business card": ["business card"],
  "background": ["background remover", "transparent"],
  "pichhe ka": ["background"],
  "rang": ["color", "palette"],
  "color nikalna": ["color palette extractor"],
  "watermark": ["watermark", "stamper"],
  "mohar": ["stamp", "watermark", "seal"],
  "thappa": ["stamp", "seal"],
  "naukri": ["resume", "cv", "job"],
  "rozgar": ["resume", "job"],
  "byaj": ["loan", "emi", "amortization"],
  "sudh": ["interest", "loan"],
  "karz": ["loan", "emi"],
  "chehra": ["face", "portrait", "skin"],
  "daant": ["teeth whitening", "brightener"],
  "aankh": ["eye iris", "color pop"],
  "notes": ["cornell notes", "study sheet"],
  "khana": ["meal planner", "grocery"],
  "aadat": ["habit tracker"],
  "bimari": ["blood pressure", "health diary"]
};

// Hindi Devanagari script normalization mapping
const DEVANAGARI_MAP: Record<string, string> = {
  "फोटो": "photo image",
  "पीडीएफ": "pdf document",
  "कंप्रेस": "compress",
  "साइज कम": "compress reduce",
  "जोड़ना": "merge combine",
  "अलग करना": "split extract",
  "हटाना": "remove delete",
  "बैकग्राउंड": "background",
  "आधार कार्ड": "aadhaar card",
  "पैन कार्ड": "pan card",
  "पासपोर्ट": "passport photo",
  "बायोडाटा": "biodata marriage",
  "शादी": "marriage biodata",
  "किरायानामा": "rent agreement",
  "किराया": "rent agreement",
  "सैलरी": "salary slip payslip",
  "बिल": "bill invoice receipt",
  "रसीद": "receipt cash memo",
  "दस्तखत": "signature cleaner",
  "हस्ताक्षर": "signature cleaner",
  "घुमाना": "rotate",
  "सीधा": "rotate deskew",
  "धुंधला": "blur redact",
  "पासवर्ड": "password protect",
  "वॉटरमार्क": "watermark stamp",
  "कन्वर्ट": "convert"
};

// Comprehensive Symptom / Problem keyword mapping (English & Hi-English)
const PROBLEM_INTENT_MAP: Record<string, { toolSlugs: string[]; reason: string }> = {
  // --- Hi-English & Hinglish Intents ---
  "photo ka background hatana": {
    toolSlugs: ["image-stamp-signature-cleaner", "image-chroma-key-green-screen-strip", "image-filter-studio"],
    reason: "फोटो या दस्तखत का बैकग्राउंड हटाकर साफ़ पारदर्शी (transparent) PNG बनाता है।"
  },
  "background hatana": {
    toolSlugs: ["image-stamp-signature-cleaner", "image-chroma-key-green-screen-strip"],
    reason: "फोटो से बैकग्राउंड को हटाकर ट्रांसपेरेंट PNG बनाता है।"
  },
  "photo background remove": {
    toolSlugs: ["image-stamp-signature-cleaner", "image-chroma-key-green-screen-strip"],
    reason: "Removes photo background and turns it into clean transparent PNG."
  },
  "pdf compress kaise kare": {
    toolSlugs: ["pdf-compress", "pdf-split"],
    reason: "PDF फ़ाइल का साइज़ तुरंत कम (compress) करता है ताकि ईमेल पर आसानी से भेजी जा सके।"
  },
  "pdf size chota karna": {
    toolSlugs: ["pdf-compress"],
    reason: "PDF की साइज़ बिना क्वालिटी खोए छोटी करता है।"
  },
  "pdf size kam karna": {
    toolSlugs: ["pdf-compress"],
    reason: "PDF का फ़ाइल साइज़ तुरंत कम (compress) करता है।"
  },
  "pdf kam mb ka karna": {
    toolSlugs: ["pdf-compress"],
    reason: "बड़ी PDF फ़ाइलों को छोटी MB या KB साइज़ में कंप्रेस करता है।"
  },
  "pdf jodna": {
    toolSlugs: ["pdf-merge"],
    reason: "दो या अधिक PDF फ़ाइलों को जोड़कर एक फ़ाइल बनाता है (Merge PDF)।"
  },
  "do pdf ko ek banana": {
    toolSlugs: ["pdf-merge"],
    reason: "अलग-अलग PDF डाक्यूमेंट्स को आपस में मिलाकर एक PDF बनाता है।"
  },
  "pdf alag karna": {
    toolSlugs: ["pdf-split"],
    reason: "मल्टी-पेज PDF में से पसंदीदा पन्नों को अलग या एक्सट्रेक्ट करता है (Split PDF)।"
  },
  "pdf ke page nikalna": {
    toolSlugs: ["pdf-split", "pdf-extract-pages"],
    reason: "PDF में से ज़रूरी पन्नों को बाहर निकालता है।"
  },
  "photo to pdf banana": {
    toolSlugs: ["jpg-to-pdf", "image-resizer"],
    reason: "मोबाइल फोटो या तस्वीरों को प्रिंट-क्वालिटी PDF डॉक्यूमेंट में बदलता है।"
  },
  "photo ko pdf banana": {
    toolSlugs: ["jpg-to-pdf"],
    reason: "एक या कई तस्वीरों को जोड़कर सिंगल PDF फ़ाइल बनाता है।"
  },
  "pdf ko word me badalna": {
    toolSlugs: ["pdf-to-txt-pro", "pdf-text-extractor"],
    reason: "PDF के टेक्स्ट और सामग्री को एडिटेबल फॉर्मेट में बदलता है।"
  },
  "aadhaar card print": {
    toolSlugs: ["pdf-aadhaar-card-print-scaler", "pdf-pan-card-cut-guide-formatter"],
    reason: "आधार कार्ड को सही वॉलेट / PVC कार्ड साइज़ (86x54mm) में 4x6 फोटो पेपर पर सेट करता है।"
  },
  "aadhar card print": {
    toolSlugs: ["pdf-aadhaar-card-print-scaler"],
    reason: "आधार कार्ड को 4x6 फोटो पेपर पर कटिंग गाइड के साथ प्रिंट के लिए सेट करता है।"
  },
  "pan card print": {
    toolSlugs: ["pdf-pan-card-cut-guide-formatter", "pdf-aadhaar-card-print-scaler"],
    reason: "e-PAN कार्ड के आगे और पीछे के हिस्से को अलाइन करके वॉलेट प्रिंट शीट बनाता है।"
  },
  "passport size photo banana": {
    toolSlugs: ["image-passport-size-photo-grid", "image-passport-visa-photo-maker"],
    reason: "4x6 फोटो शीट पर 8 या 16 पासपोर्ट साइज फोटो एक क्लिक में तैयार करता है।"
  },
  "passport photo sheet": {
    toolSlugs: ["image-passport-size-photo-grid", "image-passport-visa-photo-maker"],
    reason: "Formats passport photos into aligned 8-up or 16-up 4x6 print sheet."
  },
  "shadi ke liye biodata": {
    toolSlugs: ["pdf-biodata-marriage-maker"],
    reason: "शादी / विवाह के लिए सुंदर पारंपरिक बॉर्डर और फोटो वाला मैरिज बायोडाटा PDF बनाता है।"
  },
  "biodata banana": {
    toolSlugs: ["pdf-biodata-marriage-maker", "pdf-job-resume-ats-purifier"],
    reason: "विवाह या नौकरी के लिए शानदार बायोडाटा PDF तैयार करता है।"
  },
  "marriage biodata": {
    toolSlugs: ["pdf-biodata-marriage-maker"],
    reason: "Generates elegant marriage biodatas with traditional borders and family details in PDF."
  },
  "kirayanama banana": {
    toolSlugs: ["pdf-rent-agreement-pro-maker"],
    reason: "मकान या दूकान का 11 महीने का कानूनी रेंट एग्रीमेंट (किरायानामा) PDF फॉर्मेट में बनाता है।"
  },
  "rent agreement": {
    toolSlugs: ["pdf-rent-agreement-pro-maker"],
    reason: "Creates legally formatted 11-month tenancy agreements and rental deeds in PDF."
  },
  "salary slip banana": {
    toolSlugs: ["pdf-salary-slip-payslip-generator"],
    reason: "कर्मचारी की मासिक सैलरी स्लिप (Payslip) बेसिक, HRA और PF जोड़कर तैयार करता है।"
  },
  "salary slip generator": {
    toolSlugs: ["pdf-salary-slip-payslip-generator"],
    reason: "Generates itemized monthly payslips with tax deductions and net salary in PDF."
  },
  "bill banana": {
    toolSlugs: ["pdf-cash-memo-retail-receipt", "pdf-quotation-estimate-maker"],
    reason: "दुकान या व्यापार के लिए काउंटर कैश मेमो, बिल और रसीद PDF बनाता है।"
  },
  "invoice banana": {
    toolSlugs: ["pdf-cash-memo-retail-receipt", "pdf-invoice-template-builder"],
    reason: "प्रोफ़ेशनल सेल्स इनवॉइस और बिलिंग रसीद PDF बनाता है।"
  },
  "signature saaf karna": {
    toolSlugs: ["image-stamp-signature-cleaner"],
    reason: "कागज़ पर किए गए दस्तखत (हस्ताक्षर) का बैकग्राउंड हटाकर साफ़ पारदर्शी PNG बनाता है।"
  },
  "sign transparent banana": {
    toolSlugs: ["image-stamp-signature-cleaner"],
    reason: "हस्ताक्षर को साफ़ पारदर्शी PNG में बदलकर कॉन्ट्रैक्ट और PDF पर लगाने योग्य बनाता है।"
  },
  "pdf me password lagana": {
    toolSlugs: ["pdf-protect-password", "pdf-protect"],
    reason: "PDF डॉक्यूमेंट को पासवर्ड लगाकर सुरक्षित (lock) करता है।"
  },
  "pdf lock karna": {
    toolSlugs: ["pdf-protect-password"],
    reason: "PDF फ़ाइल में पासवर्ड सुरक्षा जोड़ता है।"
  },
  "pdf ka password hatana": {
    toolSlugs: ["pdf-unlock"],
    reason: "पासवर्ड से सुरक्षित PDF का पासवर्ड हटाकर सामान्य PDF बनाता है।"
  },
  "photo rotate karna": {
    toolSlugs: ["image-flip-mirror-rotate", "image-aspect-ratio-cropper"],
    reason: "उलटी या तिरछी फोटो को 90°, 180° घुमाकर सीधा करता है।"
  },
  "photo ghumana": {
    toolSlugs: ["image-flip-mirror-rotate"],
    reason: "तस्वीरों को अपनी पसंद के एंगल पर घुमाता और मिरर करता है।"
  },
  "pdf rotate karna": {
    toolSlugs: ["pdf-page-rotator"],
    reason: "उलटे या आड़े स्कैन किए गए PDF पन्नों को सीधा करता है।"
  },
  "photo dhundhla karna": {
    toolSlugs: ["image-blur-sensitive-redact-box", "image-pixelator-blur-redact"],
    reason: "फोटो में संवेदनशील जानकारी (आधार, चेहरा, नंबर) को ब्लर या काला करके छुपाता है।"
  },
  "visiting card banana": {
    toolSlugs: ["business-card-maker", "qr-code-logo-generator"],
    reason: "कंपनी के लोगो और QR कोड वाला विज़िटिंग कार्ड (Business Card) डिज़ाइन करता है।"
  },
  "qr code banana": {
    toolSlugs: ["qr-code-logo-generator", "qr-generator"],
    reason: "लोगो, वेबसाइट या UPI पेमेंट वाला कस्टम QR कोड बनाता है।"
  },
  "watermark lagana": {
    toolSlugs: ["pdf-watermark-stamper", "image-watermark-overlay"],
    reason: "PDF या फोटो पर अपना नाम, कंपनी या कॉपीराइट का वॉटरमार्क लगाता है।"
  },
  "resume banana": {
    toolSlugs: ["pdf-job-resume-ats-purifier", "pdf-cover-letter-designer"],
    reason: "नौकरी के लिए ATS-फ्रेंडली रेज़्यूमे और कवर लेटर PDF बनाता है।"
  },
  "teeth white karna": {
    toolSlugs: ["image-teeth-whitening-brightener"],
    reason: "फोटो में मुस्कुराते चेहरों के पीले दांतों को साफ़ और चमकदार बनाता है।"
  },
  "loan emi calculate karna": {
    toolSlugs: ["loan-amortization-schedule", "emi-calc"],
    reason: "होम लोन या कार लोन की मासिक EMI और कुल ब्याज की गणना करता है।"
  },

  // --- English Intents ---
  "business card": {
    toolSlugs: ["business-card-maker", "qr-code-logo-generator"],
    reason: "Designs double-sided 3.5\" x 2\" print-ready business cards with custom logo and vCard QR code."
  },
  "qr code with logo": {
    toolSlugs: ["qr-code-logo-generator", "business-card-maker"],
    reason: "Embeds company logos in QR code centers with High (H) error-correction to guarantee 100% scan rate."
  },
  "qr with logo": {
    toolSlugs: ["qr-code-logo-generator"],
    reason: "Generates custom branded QR codes with your center logo, custom colors, and error recovery."
  },
  "watermark pdf": {
    toolSlugs: ["pdf-watermark-stamper"],
    reason: "Stamps confidential text, copyright notices, and custom angled watermarks across PDF pages."
  },
  "rotate pdf": {
    toolSlugs: ["pdf-page-rotator"],
    reason: "Rotates upside down or sideways PDF pages by 90°, 180°, or 270°."
  },
  "number pdf": {
    toolSlugs: ["pdf-page-numberer"],
    reason: "Inserts professional 'Page X of Y' numbers into headers or footers of PDF documents."
  },
  "palette from image": {
    toolSlugs: ["image-color-palette-extractor"],
    reason: "Extracts dominant colors and HEX swatches from photos and graphics."
  },
  "pdf too big": {
    toolSlugs: ["pdf-compress", "pdf-split"],
    reason: "Compresses PDF files client-side to fit email attachment limits without data loss."
  },
  "compress pdf": {
    toolSlugs: ["pdf-compress"],
    reason: "Reduces PDF file size instantly in your browser."
  },
  "merge pdf": {
    toolSlugs: ["pdf-merge"],
    reason: "Combines multiple PDF documents into a single organized file."
  },
  "split pdf": {
    toolSlugs: ["pdf-split"],
    reason: "Splits multipage PDFs or extracts specific page ranges."
  },
  "pdf to image": {
    toolSlugs: ["pdf-to-image"],
    reason: "Converts PDF pages into high-resolution PNG or JPEG images."
  },
  "compress image": {
    toolSlugs: ["image-compress", "webp-converter"],
    reason: "Optimizes image dimensions and compresses file sizes without visible loss."
  },
  "convert to webp": {
    toolSlugs: ["webp-converter"],
    reason: "Converts PNG/JPG images to modern next-gen WebP format for faster web performance."
  },
  "resize image": {
    toolSlugs: ["image-resizer"],
    reason: "Rescales and crops image dimensions with aspect ratio locking."
  },
  "format sql": {
    toolSlugs: ["sql-formatter-pro", "sql-formatter"],
    reason: "Beautifies, standardizes keywords, and indents complex SQL queries cleanly."
  },
  "stripe webhook": {
    toolSlugs: ["webhook-tester-simulator"],
    reason: "Simulates and verifies cryptographic HMAC SHA-256 signatures for Stripe webhooks."
  },
  "github webhook": {
    toolSlugs: ["webhook-tester-simulator"],
    reason: "Verifies GitHub webhook payloads with secret HMAC cryptographic signing."
  },
  "mock data": {
    toolSlugs: ["mock-data-generator"],
    reason: "Generates realistic fake user profiles, transactions, and JSON schemas for API testing."
  },
  "loan amortization": {
    toolSlugs: ["loan-amortization-schedule", "mortgage-calc", "emi-calc"],
    reason: "Calculates exact monthly breakdown of principal, cumulative interest, and payoff schedule."
  },
  "cors error": {
    toolSlugs: ["cors-header-builder"],
    reason: "Generates correct Access-Control-Allow-Origin, Headers, and Methods server policies."
  },
  "sql to typescript": {
    toolSlugs: ["sql-to-typescript-converter"],
    reason: "Automatically translates SQL CREATE TABLE schemas into type-safe TypeScript interfaces."
  },
  "env secrets": {
    toolSlugs: ["env-file-auditor"],
    reason: "Audits .env files to detect accidentally exposed credentials and syntax bugs."
  },
  "api key": {
    toolSlugs: ["api-key-entropy-generator"],
    reason: "Generates cryptographically strong 128-bit, 256-bit, or 512-bit tokens with custom prefixes."
  },
  "regex test": {
    toolSlugs: ["regex-syntax-debugger", "regex-tester"],
    reason: "Tests regular expressions with live match capture groups and error highlighting."
  },
  "jwt token": {
    toolSlugs: ["jwt-token-signer", "jwt-debugger"],
    reason: "Signs, inspects, and debugs JSON Web Tokens with header and payload claims."
  },
  "ipv4 cidr": {
    toolSlugs: ["ipv4-cidr-calculator"],
    reason: "Calculates network IP, broadcast IP, usable host limits, and subnet masks."
  },
  "html table to markdown": {
    toolSlugs: ["html-table-to-markdown"],
    reason: "Parses HTML <table> tags and converts them into GitHub Flavored Markdown tables."
  },
  "case convert": {
    toolSlugs: ["case-converter-pro"],
    reason: "Swaps strings instantly between camelCase, snake_case, kebab-case, and PascalCase."
  },
  "morse code": {
    toolSlugs: ["text-morse-audio-player"],
    reason: "Translates text into Morse code and synthesizes real-time Web Audio beeps."
  },
  "unix permissions": {
    toolSlugs: ["unix-file-permissions-calc"],
    reason: "Visualizes Read, Write, and Execute permissions for owner, group, and others."
  },
  "css triangle": {
    toolSlugs: ["css-triangle-generator"],
    reason: "Generates zero-dependency pure CSS border triangles for tooltips and pointers."
  },
  "utm builder": {
    toolSlugs: ["utm-campaign-generator", "utm-builder"],
    reason: "Attaches proper utm_source, utm_medium, and campaign parameters to marketing URLs."
  },
  "social card": {
    toolSlugs: ["social-share-card-debugger", "meta-tag-generator"],
    reason: "Previews how Open Graph and Twitter Card tags will render when shared on social networks."
  },
  "remove duplicates": {
    toolSlugs: ["list-sorter-deduplicator"],
    reason: "Cleans multiline lists by stripping duplicate entries and alphabetizing items."
  },
  "percentage change": {
    toolSlugs: ["percentage-change-calculator", "percentage-calc"],
    reason: "Calculates percent increase, decrease, and variance between two numbers."
  }
};

/**
 * Checks if input contains Hinglish or Hindi words, and expands with English synonyms.
 */
export function normalizeHiEnglishQuery(rawQuery: string): { normalized: string; isHiEnglish: boolean } {
  let text = rawQuery.toLowerCase().trim();
  let detectedHiEnglish = false;

  // 1. Check Devanagari script replacement
  for (const [devWord, engTrans] of Object.entries(DEVANAGARI_MAP)) {
    if (text.includes(devWord)) {
      text = text.replace(new RegExp(devWord, 'g'), ` ${engTrans} `);
      detectedHiEnglish = true;
    }
  }

  // 2. Check Hinglish dictionary replacement & expansion
  for (const [hiWord, engSynonyms] of Object.entries(HI_ENGLISH_DICTIONARY)) {
    const regex = new RegExp(`\\b${hiWord}\\b`, 'gi');
    if (regex.test(text)) {
      detectedHiEnglish = true;
      text += ' ' + engSynonyms.join(' ');
    }
  }

  return {
    normalized: text.replace(/\s+/g, ' ').trim(),
    isHiEnglish: detectedHiEnglish
  };
}

/**
 * Searches and scores tools that directly solve the user's defined problem.
 * Matches on problem intent keywords, tool descriptions, tags, howToUse,
 * and seamlessly supports Hi-English (Hinglish) queries.
 */
export function findToolsForProblem(rawProblem: string): ProblemMatchResult[] {
  const query = rawProblem.trim().toLowerCase();
  if (!query) return [];

  const { normalized, isHiEnglish } = normalizeHiEnglishQuery(query);
  const resultsMap = new Map<string, { tool: ToolItem; score: number; reason: string; isHiEnglish: boolean }>();

  // 1. Check Intent dictionary (matches against raw query AND normalized query)
  for (const [intentKey, data] of Object.entries(PROBLEM_INTENT_MAP)) {
    if (
      query.includes(intentKey) ||
      intentKey.includes(query) ||
      normalized.includes(intentKey) ||
      intentKey.includes(normalized)
    ) {
      data.toolSlugs.forEach(slug => {
        const foundTool = TOOLS_DATA.find(t => t.slug === slug || t.id === slug);
        if (foundTool) {
          const current = resultsMap.get(foundTool.id);
          const newScore = (current?.score || 0) + 70;
          resultsMap.set(foundTool.id, {
            tool: foundTool,
            score: newScore,
            reason: data.reason,
            isHiEnglish: isHiEnglish || intentKey.includes('karna') || intentKey.includes('banana')
          });
        }
      });
    }
  }

  // 2. Tokenized search across all 740+ tools using both raw and normalized query
  const searchTokens = Array.from(
    new Set([
      ...query.replace(/[^\w\s]/g, ' ').split(/\s+/),
      ...normalized.replace(/[^\w\s]/g, ' ').split(/\s+/)
    ])
  ).filter(w => w.length > 2);

  TOOLS_DATA.forEach(tool => {
    let score = 0;
    const reasons: string[] = [];

    // Exact name match
    if (tool.name.toLowerCase().includes(query) || tool.name.toLowerCase().includes(normalized)) {
      score += 45;
      reasons.push(`Direct match with tool name "${tool.name}"`);
    }

    // Description match
    if (tool.description.toLowerCase().includes(query) || tool.description.toLowerCase().includes(normalized)) {
      score += 35;
      reasons.push(tool.description);
    }

    // Tag matches
    tool.tags.forEach(tag => {
      const lowerTag = tag.toLowerCase();
      if (
        query.includes(lowerTag) ||
        lowerTag.includes(query) ||
        normalized.includes(lowerTag) ||
        lowerTag.includes(normalized)
      ) {
        score += 25;
      }
    });

    // Token-based matching
    searchTokens.forEach(token => {
      const lowerToken = token.toLowerCase();
      if (tool.name.toLowerCase().includes(lowerToken)) score += 14;
      if (tool.description.toLowerCase().includes(lowerToken)) score += 10;
      if (tool.tags.some(t => t.toLowerCase().includes(lowerToken))) score += 12;
      if (tool.howToUse?.some(step => step.toLowerCase().includes(lowerToken))) score += 6;
      if (tool.category.toLowerCase().includes(lowerToken)) score += 5;
    });

    if (score > 0) {
      const existing = resultsMap.get(tool.id);
      if (existing) {
        existing.score += score;
      } else {
        const defaultReason =
          reasons[0] ||
          (isHiEnglish ? `आपकी समस्या "${rawProblem}" के लिए सबसे उपयुक्त टूल` : tool.description);

        resultsMap.set(tool.id, {
          tool,
          score,
          reason: defaultReason,
          isHiEnglish
        });
      }
    }
  });

  // Sort descending by score
  return Array.from(resultsMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 14);
}
