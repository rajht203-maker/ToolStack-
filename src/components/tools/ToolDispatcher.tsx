import React, { Suspense, lazy } from 'react';
import { ToolItem } from '../../types';
import { HUNDRED_PDF_TOOL_IDS, HUNDRED_IMAGE_TOOL_IDS } from '../../data/hundredPdfAndImageToolsData';
import { HIGH_TRAFFIC_TOOL_IDS } from '../../data/highTrafficPeopleToolsData';
import { ALL_WORLD_PDF_TOOL_IDS } from '../../data/allWorldPdfToolsData';
import { ALL_WORLD_IMAGE_TOOL_IDS } from '../../data/allWorldImageToolsData';
import { MEGA_PDF_TOOL_IDS } from '../../data/megaPdfToolsData';
import { MEGA_IMAGE_TOOL_IDS } from '../../data/megaImageToolsData';
import { HUNDRED_DISTRIBUTED_TOOL_IDS } from '../../data/hundredEquallyDistributedToolsData';
import { TWO_HUNDRED_TOOL_IDS } from '../../data/twoHundredDistributedToolsData';
import { MEMBER_EXCLUSIVE_TOOL_IDS } from '../../data/memberExclusiveToolsData';

// Lazy-load all tool suites for optimal performance and instant initial page load
const PdfTools = lazy(() => import('./PdfTools').then(m => ({ default: m.PdfTools })));
const ImageTools = lazy(() => import('./ImageTools').then(m => ({ default: m.ImageTools })));
const TextTools = lazy(() => import('./TextTools').then(m => ({ default: m.TextTools })));
const DevTools = lazy(() => import('./DevTools').then(m => ({ default: m.DevTools })));
const CalculatorTools = lazy(() => import('./CalculatorTools').then(m => ({ default: m.CalculatorTools })));
const ConverterTools = lazy(() => import('./ConverterTools').then(m => ({ default: m.ConverterTools })));
const SecurityTools = lazy(() => import('./SecurityTools').then(m => ({ default: m.SecurityTools })));
const SeoTools = lazy(() => import('./SeoTools').then(m => ({ default: m.SeoTools })));
const AiFutureTools = lazy(() => import('./AiFutureTools').then(m => ({ default: m.AiFutureTools })));
const NextGenDevTools = lazy(() => import('./NextGenDevTools').then(m => ({ default: m.NextGenDevTools })));
const ModernMediaTools = lazy(() => import('./ModernMediaTools').then(m => ({ default: m.ModernMediaTools })));
const ModernBusinessTools = lazy(() => import('./ModernBusinessTools').then(m => ({ default: m.ModernBusinessTools })));
const PremiumDevTools = lazy(() => import('./PremiumDevTools').then(m => ({ default: m.PremiumDevTools })));
const PremiumProductivityTools = lazy(() => import('./PremiumProductivityTools').then(m => ({ default: m.PremiumProductivityTools })));
const PublicUtilityTools = lazy(() => import('./PublicUtilityTools').then(m => ({ default: m.PublicUtilityTools })));
const AdvancedMemberTools = lazy(() => import('./AdvancedMemberTools').then(m => ({ default: m.AdvancedMemberTools })));
const BusinessCardMakerTool = lazy(() => import('./BusinessCardMakerTool').then(m => ({ default: m.BusinessCardMakerTool })));
const QrCodeLogoGeneratorTool = lazy(() => import('./QrCodeLogoGeneratorTool').then(m => ({ default: m.QrCodeLogoGeneratorTool })));
const NewPdfToolsSuite = lazy(() => import('./NewPdfToolsSuite').then(m => ({ default: m.NewPdfToolsSuite })));
const NewImageToolsSuite = lazy(() => import('./NewImageToolsSuite').then(m => ({ default: m.NewImageToolsSuite })));
const HundredPdfToolsSuite = lazy(() => import('./HundredPdfToolsSuite').then(m => ({ default: m.HundredPdfToolsSuite })));
const HundredImageToolsSuite = lazy(() => import('./HundredImageToolsSuite').then(m => ({ default: m.HundredImageToolsSuite })));
const HighTrafficPeopleToolsSuite = lazy(() => import('./HighTrafficPeopleToolsSuite').then(m => ({ default: m.HighTrafficPeopleToolsSuite })));
const AllWorldPdfToolsSuite = lazy(() => import('./AllWorldPdfToolsSuite').then(m => ({ default: m.AllWorldPdfToolsSuite })));
const AllWorldImageToolsSuite = lazy(() => import('./AllWorldImageToolsSuite').then(m => ({ default: m.AllWorldImageToolsSuite })));
const MegaPdfAndImageToolsSuite = lazy(() => import('./MegaPdfAndImageToolsSuite').then(m => ({ default: m.MegaPdfAndImageToolsSuite })));
const HundredDistributedToolsSuite = lazy(() => import('./HundredDistributedToolsSuite').then(m => ({ default: m.HundredDistributedToolsSuite })));
const TwoHundredDistributedToolsSuite = lazy(() => import('./TwoHundredDistributedToolsSuite').then(m => ({ default: m.TwoHundredDistributedToolsSuite })));
const MemberExclusiveToolsSuite = lazy(() => import('./MemberExclusiveToolsSuite').then(m => ({ default: m.MemberExclusiveToolsSuite })));
const CustomToolRunner = lazy(() => import('./CustomToolRunner').then(m => ({ default: m.CustomToolRunner })));

const ToolLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center p-12 min-h-[280px] space-y-4">
    <div className="w-9 h-9 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading interactive tool workspace...</p>
  </div>
);

interface ToolDispatcherProps {
  tool: ToolItem;
  onSuccess: (summary: string) => void;
}

const NEW_PDF_TOOL_IDS = [
  'pdf-watermark-stamper',
  'pdf-page-numberer',
  'pdf-page-rotator',
  'pdf-page-reorder',
  'pdf-delete-pages',
  'pdf-protect-password',
  'pdf-metadata-editor',
  'pdf-metadata-stripper',
  'pdf-resize-pages',
  'pdf-blank-page-inserter',
  'pdf-extract-pages',
  'pdf-grayscale-converter',
  'pdf-header-footer-annotator',
  'pdf-extract-images',
  'pdf-form-flattener',
  'pdf-margin-adjuster',
  'pdf-invoice-template-builder',
  'pdf-booklet-maker',
  'pdf-reverse-order',
  'pdf-text-extractor'
];

const NEW_IMAGE_TOOL_IDS = [
  'image-filter-studio',
  'image-aspect-ratio-cropper',
  'image-watermark-overlay',
  'image-color-palette-extractor',
  'image-round-corner-avatar',
  'image-pixelator-blur-redact',
  'image-svg-data-url-converter',
  'image-duotone-gradient-map',
  'image-flip-mirror-rotate',
  'image-split-grid-slicer'
];

const PUBLIC_UTILITY_TOOL_IDS = [
  'lorem-markdown-generator',
  'character-frequency-analyzer',
  'sql-formatter-pro',
  'case-converter-pro',
  'screen-resolution-detector',
  'word-scrambler-anagram',
  'ipv4-cidr-calculator',
  'roman-numeral-converter',
  'css-cursor-previewer',
  'percentage-change-calculator',
  'hex-rgb-hsl-picker',
  'emoji-picker-search',
  'base64-image-previewer',
  'html-table-to-markdown',
  'meta-viewport-tag-generator',
  'text-morse-audio-player',
  'unix-file-permissions-calc',
  'css-triangle-generator',
  'speed-distance-time-calc',
  'list-sorter-deduplicator'
];

const ADVANCED_MEMBER_TOOL_IDS = [
  'webhook-tester-simulator',
  'regex-syntax-debugger',
  'jwt-token-signer',
  'git-command-generator',
  'user-agent-device-auditor',
  'content-security-policy-builder',
  'sql-to-typescript-converter',
  'dockerfile-builder',
  'env-file-auditor',
  'http-status-code-guide',
  'markdown-to-pdf-doc',
  'roi-investment-calculator',
  'loan-amortization-schedule',
  'mock-data-generator',
  'cors-header-builder',
  'social-share-card-debugger',
  'markdown-cheatsheet-sandbox',
  'meeting-agenda-builder',
  'utm-campaign-generator',
  'api-key-entropy-generator'
];

const PREMIUM_DEV_TOOL_IDS = [
  'dns-lookup',
  'ssl-checker',
  'api-tester',
  'color-palette-generator',
  'box-shadow-generator',
  'svg-to-jsx',
  'cron-job-scheduler',
  'code-diff-side-by-side',
  'json-schema-validator',
  'password-strength-auditor'
];

const PREMIUM_PRODUCTIVITY_TOOL_IDS = [
  'currency-converter',
  'salary-paycheck-calculator',
  'invoice-generator',
  'privacy-policy-generator',
  'terms-conditions-generator',
  'text-summarizer-cleaner',
  'readability-score',
  'pomodoro-timer',
  'speed-typing-test',
  'email-signature-generator'
];

const AI_TOOL_IDS = [
  'ai-prompt-builder',
  'ai-token-counter',
  'ai-system-prompt',
  'text-density-analyzer'
];

const NEXT_GEN_DEV_TOOL_IDS = [
  'curl-converter',
  'jwt-debugger',
  'sql-formatter',
  'cron-parser',
  'docker-compose-generator',
  'css-mesh-generator',
  'subnet-calculator',
  'user-agent-parser'
];

const MODERN_MEDIA_TOOL_IDS = [
  'svg-optimizer',
  'markdown-previewer',
  'qr-advanced-generator',
  'bcrypt-generator',
  'og-previewer'
];

const MODERN_BUSINESS_TOOL_IDS = [
  'inflation-calculator',
  'freelance-rate-calculator',
  'meeting-cost-calculator'
];

function renderToolContent(tool: ToolItem, onSuccess: (summary: string) => void) {
  // Check Admin-created custom tools
  if (tool.isCustom) {
    return <CustomToolRunner tool={tool} onSuccess={onSuccess} />;
  }

  // Check flagship Business Card Studio & QR Generator with Logo
  if (tool.id === 'business-card-maker' || tool.slug === 'business-card-maker') {
    return <BusinessCardMakerTool tool={tool} onSuccess={onSuccess} />;
  }

  if (tool.id === 'qr-code-logo-generator' || tool.slug === 'qr-code-logo-generator') {
    return <QrCodeLogoGeneratorTool tool={tool} onSuccess={onSuccess} />;
  }

  // Check 20 new PDF tools
  if (NEW_PDF_TOOL_IDS.includes(tool.id) || NEW_PDF_TOOL_IDS.includes(tool.slug)) {
    return <NewPdfToolsSuite tool={tool} onSuccess={onSuccess} />;
  }

  // Check 10 new Image tools
  if (NEW_IMAGE_TOOL_IDS.includes(tool.id) || NEW_IMAGE_TOOL_IDS.includes(tool.slug)) {
    return <NewImageToolsSuite tool={tool} onSuccess={onSuccess} />;
  }

  // Check 100 new PDF & Image tools
  if (HUNDRED_PDF_TOOL_IDS.includes(tool.id) || HUNDRED_PDF_TOOL_IDS.includes(tool.slug)) {
    return <HundredPdfToolsSuite tool={tool} onSuccess={onSuccess} />;
  }

  if (HUNDRED_IMAGE_TOOL_IDS.includes(tool.id) || HUNDRED_IMAGE_TOOL_IDS.includes(tool.slug)) {
    return <HundredImageToolsSuite tool={tool} onSuccess={onSuccess} />;
  }

  // Check newly added public utility tools and advanced member tools
  if (PUBLIC_UTILITY_TOOL_IDS.includes(tool.id) || PUBLIC_UTILITY_TOOL_IDS.includes(tool.slug)) {
    return <PublicUtilityTools tool={tool} onSuccess={onSuccess} />;
  }

  if (ADVANCED_MEMBER_TOOL_IDS.includes(tool.id) || ADVANCED_MEMBER_TOOL_IDS.includes(tool.slug)) {
    return <AdvancedMemberTools tool={tool} onSuccess={onSuccess} />;
  }

  // Check premium member tool groups first
  if (PREMIUM_DEV_TOOL_IDS.includes(tool.id) || PREMIUM_DEV_TOOL_IDS.includes(tool.slug)) {
    return <PremiumDevTools tool={tool} onSuccess={onSuccess} />;
  }

  if (PREMIUM_PRODUCTIVITY_TOOL_IDS.includes(tool.id) || PREMIUM_PRODUCTIVITY_TOOL_IDS.includes(tool.slug)) {
    return <PremiumProductivityTools tool={tool} onSuccess={onSuccess} />;
  }

  // Check 100 equally distributed productivity, crypto, media & AI tools
  if (HUNDRED_DISTRIBUTED_TOOL_IDS.includes(tool.id) || HUNDRED_DISTRIBUTED_TOOL_IDS.includes(tool.slug)) {
    return <HundredDistributedToolsSuite tool={tool} onSuccess={onSuccess} />;
  }

  // Check 200 equally distributed tools across all 10 categories
  if ((TWO_HUNDRED_TOOL_IDS as readonly string[]).includes(tool.id) || (TWO_HUNDRED_TOOL_IDS as readonly string[]).includes(tool.slug)) {
    return <TwoHundredDistributedToolsSuite tool={tool} onSuccess={onSuccess} />;
  }

  // Check 168 member-exclusive tools
  if ((MEMBER_EXCLUSIVE_TOOL_IDS as readonly string[]).includes(tool.id) || (MEMBER_EXCLUSIVE_TOOL_IDS as readonly string[]).includes(tool.slug)) {
    return <MemberExclusiveToolsSuite tool={tool} onSuccess={onSuccess} />;
  }

  // Check special tool group IDs
  if (tool.category === 'ai' || AI_TOOL_IDS.includes(tool.id) || AI_TOOL_IDS.includes(tool.slug)) {
    return <AiFutureTools tool={tool} onSuccess={onSuccess} />;
  }

  if (NEXT_GEN_DEV_TOOL_IDS.includes(tool.id) || NEXT_GEN_DEV_TOOL_IDS.includes(tool.slug)) {
    return <NextGenDevTools tool={tool} onSuccess={onSuccess} />;
  }

  if (MODERN_MEDIA_TOOL_IDS.includes(tool.id) || MODERN_MEDIA_TOOL_IDS.includes(tool.slug)) {
    return <ModernMediaTools tool={tool} onSuccess={onSuccess} />;
  }

  if (MODERN_BUSINESS_TOOL_IDS.includes(tool.id) || MODERN_BUSINESS_TOOL_IDS.includes(tool.slug)) {
    return <ModernBusinessTools tool={tool} onSuccess={onSuccess} />;
  }

  // Check 265 high-traffic everyday & member tools
  if (HIGH_TRAFFIC_TOOL_IDS.includes(tool.id) || HIGH_TRAFFIC_TOOL_IDS.includes(tool.slug)) {
    return <HighTrafficPeopleToolsSuite tool={tool} onSuccess={onSuccess} />;
  }

  // World-class PDF & Image suites
  if (ALL_WORLD_PDF_TOOL_IDS.includes(tool.id) || ALL_WORLD_PDF_TOOL_IDS.includes(tool.slug)) {
    return <AllWorldPdfToolsSuite tool={tool} onSuccess={onSuccess} />;
  }

  if (ALL_WORLD_IMAGE_TOOL_IDS.includes(tool.id) || ALL_WORLD_IMAGE_TOOL_IDS.includes(tool.slug)) {
    return <AllWorldImageToolsSuite tool={tool} onSuccess={onSuccess} />;
  }

  // 100 Mega PDF & Image tools suite
  if (
    MEGA_PDF_TOOL_IDS.includes(tool.id) ||
    MEGA_PDF_TOOL_IDS.includes(tool.slug) ||
    MEGA_IMAGE_TOOL_IDS.includes(tool.id) ||
    MEGA_IMAGE_TOOL_IDS.includes(tool.slug)
  ) {
    return <MegaPdfAndImageToolsSuite tool={tool} onSuccess={onSuccess} />;
  }

  // Category-based routing
  if (tool.category === 'pdf') {
    return <PdfTools tool={tool} onSuccess={onSuccess} />;
  }

  if (tool.category === 'image') {
    return <ImageTools tool={tool} onSuccess={onSuccess} />;
  }

  if (tool.category === 'text') {
    return <TextTools tool={tool} onSuccess={onSuccess} />;
  }

  if (tool.category === 'developer') {
    return <DevTools tool={tool} onSuccess={onSuccess} />;
  }

  if (tool.category === 'calculator') {
    return <CalculatorTools tool={tool} onSuccess={onSuccess} />;
  }

  if (tool.category === 'converter') {
    return <ConverterTools tool={tool} onSuccess={onSuccess} />;
  }

  if (tool.category === 'security') {
    return <SecurityTools tool={tool} onSuccess={onSuccess} />;
  }

  if (tool.category === 'seo' || tool.category === 'social') {
    return <SeoTools tool={tool} onSuccess={onSuccess} />;
  }

  // Fallback to text tool
  return <TextTools tool={tool} onSuccess={onSuccess} />;
}

export const ToolDispatcher: React.FC<ToolDispatcherProps> = ({ tool, onSuccess }) => {
  return (
    <Suspense fallback={<ToolLoadingFallback />}>
      {renderToolContent(tool, onSuccess)}
    </Suspense>
  );
};
