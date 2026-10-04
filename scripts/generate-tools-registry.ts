import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as LucideIcons from 'lucide-react';
import { TOOLS_DATA } from '../src/data/toolsData';
import { ToolCategory } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ToolRegistryItem {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory;
  shortDescription: string;
  keywords: string[];
  iconName: string;
  relatedTools: string[];
}

// Set of verified Lucide icon exports
const validLucideIcons = new Set(Object.keys(LucideIcons).filter(k => /^[A-Z]/.test(k)));

// Category default pools to avoid collision
const categoryIconPools: Record<string, string[]> = {
  pdf: ['FileText', 'Files', 'Scissors', 'Minimize2', 'FileSpreadsheet', 'FileOutput', 'FileCheck', 'FileSignature', 'FileArchive', 'FileStack', 'FilePlus', 'FileMinus', 'FileLock', 'FileCode2', 'FileSearch'],
  image: ['Image', 'Camera', 'Crop', 'Sliders', 'Maximize', 'Sparkles', 'Palette', 'QrCode', 'Scan', 'Aperture', 'Focus', 'Layers', 'SunMedium', 'Contrast', 'Wand2', 'Stamp', 'Wallpaper'],
  text: ['Type', 'AlignLeft', 'CaseSensitive', 'SpellCheck', 'FileDiff', 'ListFilter', 'Pilcrow', 'Hash', 'Quote', 'WrapText', 'Highlighter', 'Strikethrough', 'Subscript'],
  developer: ['Code2', 'Terminal', 'Braces', 'Binary', 'Database', 'Cpu', 'Network', 'Webhook', 'KeyRound', 'Server', 'FileJson', 'Boxes', 'GitBranch', 'Variable', 'Bug'],
  calculator: ['Calculator', 'Percent', 'TrendingUp', 'Landmark', 'Scale', 'DollarSign', 'PieChart', 'Calendar', 'Coins', 'Gauge', 'Activity', 'BadgePercent', 'BarChart3'],
  converter: ['ArrowRightLeft', 'Shuffle', 'RefreshCw', 'Repeat', 'SlidersHorizontal', 'Ruler', 'Thermometer', 'HardDrive', 'Weight', 'Zap', 'Compass', 'Clock'],
  security: ['ShieldCheck', 'Lock', 'Key', 'Fingerprint', 'FileKey', 'ShieldAlert', 'EyeOff', 'KeyRound', 'Shield', 'QrCode', 'CreditCard', 'Binary'],
  seo: ['Search', 'Globe', 'TrendingUp', 'Target', 'Compass', 'LineChart', 'Radar', 'Megaphone', 'Link2', 'Tags', 'BarChart2'],
  social: ['Share2', 'MessageCircle', 'ThumbsUp', 'Heart', 'Smile', 'Send', 'Users', 'Radio', 'AtSign', 'Bookmark', 'MessageSquare'],
  ai: ['Bot', 'Sparkles', 'Brain', 'Wand2', 'Cpu', 'Zap', 'Lightbulb', 'Atom', 'Workflow']
};

// Keyword based icon semantic lookup
const semanticIconRules: Array<{ pattern: RegExp; icon: string }> = [
  { pattern: /merge|combine|join|stitch/i, icon: 'Files' },
  { pattern: /split|slice|cut|extract/i, icon: 'Scissors' },
  { pattern: /compress|shrink|reduce|minify/i, icon: 'Minimize2' },
  { pattern: /watermark|stamp/i, icon: 'Stamp' },
  { pattern: /encrypt|protect|lock|password/i, icon: 'Lock' },
  { pattern: /decrypt|unlock/i, icon: 'KeyRound' },
  { pattern: /ocr|text\s*extractor|scan/i, icon: 'ScanText' },
  { pattern: /rotate|flip|turn/i, icon: 'RotateCw' },
  { pattern: /resize|crop|aspect/i, icon: 'Crop' },
  { pattern: /convert|transfer|transform/i, icon: 'ArrowRightLeft' },
  { pattern: /qr\s*code|barcode/i, icon: 'QrCode' },
  { pattern: /word\s*count|character\s*count/i, icon: 'Type' },
  { pattern: /diff|compare/i, icon: 'GitCompare' },
  { pattern: /json/i, icon: 'FileJson' },
  { pattern: /base64/i, icon: 'Binary' },
  { pattern: /regex/i, icon: 'Code2' },
  { pattern: /uuid|guid/i, icon: 'Fingerprint' },
  { pattern: /hash|md5|sha/i, icon: 'Key' },
  { pattern: /markdown/i, icon: 'FileText' },
  { pattern: /bmi|health|heart|calorie/i, icon: 'Activity' },
  { pattern: /emi|loan|mortgage|interest/i, icon: 'Landmark' },
  { pattern: /age|birthday/i, icon: 'Calendar' },
  { pattern: /percentage|discount|margin|markup/i, icon: 'Percent' },
  { pattern: /currency|forex/i, icon: 'Coins' },
  { pattern: /speed|typing|wpm/i, icon: 'Gauge' },
  { pattern: /sql|database|query/i, icon: 'Database' },
  { pattern: /color|hex|rgb|palette/i, icon: 'Palette' },
  { pattern: /unit|length|weight|temperature/i, icon: 'Ruler' },
  { pattern: /meta\s*tag|seo|sitemap/i, icon: 'Search' }
];

export function generateToolsRegistry(): ToolRegistryItem[] {
  const usedIconsInCategory = new Map<string, Set<string>>();
  
  return TOOLS_DATA.map((tool, index) => {
    let chosenIcon = tool.icon;

    // Validate if current tool.icon is valid in Lucide
    if (!chosenIcon || !validLucideIcons.has(chosenIcon) || chosenIcon === 'Wrench') {
      // Find matching semantic rule
      const textToMatch = `${tool.name} ${tool.slug} ${tool.description}`.toLowerCase();
      const match = semanticIconRules.find(r => r.pattern.test(textToMatch));
      if (match && validLucideIcons.has(match.icon)) {
        chosenIcon = match.icon;
      } else {
        // Fallback to pool
        const pool = categoryIconPools[tool.category] || categoryIconPools.developer;
        const catSet = usedIconsInCategory.get(tool.category) || new Set<string>();
        // pick variant
        const available = pool.find(ic => !catSet.has(ic)) || pool[index % pool.length];
        chosenIcon = available;
      }
    }

    // Keep track of used icons
    if (!usedIconsInCategory.has(tool.category)) {
      usedIconsInCategory.set(tool.category, new Set());
    }
    usedIconsInCategory.get(tool.category)!.add(chosenIcon);

    // Build concise short description (under 155 chars)
    const shortDescription = tool.description.length > 150 
      ? tool.description.slice(0, 147) + '...'
      : tool.description;

    // Collect keywords from tags, name words, and category
    const nameKeywords = tool.name.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const keywords = Array.from(new Set([
      ...tool.tags,
      ...nameKeywords,
      tool.category,
      'toolstack',
      'free online tool',
      'browser tool'
    ])).slice(0, 12);

    // Related tools (use existing relatedToolIds or pick from same category)
    let relatedTools = tool.relatedToolIds || [];
    if (relatedTools.length < 4) {
      const sameCat = TOOLS_DATA
        .filter(t => t.category === tool.category && t.id !== tool.id)
        .map(t => t.slug)
        .slice(0, 6);
      relatedTools = Array.from(new Set([...relatedTools, ...sameCat])).slice(0, 6);
    }

    return {
      id: tool.id,
      slug: tool.slug,
      name: tool.name,
      category: tool.category,
      shortDescription,
      keywords,
      iconName: chosenIcon,
      relatedTools
    };
  });
}

// Generate the files
const registry = generateToolsRegistry();

const outputTsPath = path.resolve(__dirname, '../src/data/tools-registry.ts');
const outputJsonPath = path.resolve(__dirname, '../src/data/tools-registry.json');

const tsContent = `// Central Tool Registry for ToolStack
// Generated automatically from TOOLS_DATA source of truth
// Total registered tools: ${registry.length}

import { ToolCategory } from '../types';

export interface ToolRegistryItem {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory;
  shortDescription: string;
  keywords: string[];
  iconName: string;
  relatedTools: string[];
}

export const TOOLS_REGISTRY: ToolRegistryItem[] = ${JSON.stringify(registry, null, 2)};

export const TOOLS_REGISTRY_MAP: Record<string, ToolRegistryItem> = TOOLS_REGISTRY.reduce((acc, item) => {
  acc[item.id] = item;
  acc[item.slug] = item;
  return acc;
}, {} as Record<string, ToolRegistryItem>);
`;

fs.writeFileSync(outputTsPath, tsContent, 'utf-8');
fs.writeFileSync(outputJsonPath, JSON.stringify(registry, null, 2), 'utf-8');

console.log(`✓ tools-registry generated successfully with ${registry.length} entries.`);
console.log(`- TypeScript registry: ${outputTsPath}`);
console.log(`- JSON registry: ${outputJsonPath}`);
