import { ToolItem, PopularToolRanking } from '../types';

export const TOOL_CLICKS_STORAGE_KEY = 'toolstack_tool_clicks';
export const TOOL_CLICK_EVENT = 'toolstack_click_event';

// Initial baseline seed so the 'Most Popular' section has realistic high-utility rankings on first launch
const DEFAULT_SEED_CLICKS: Record<string, number> = {
  'image-compressor': 52,
  'pdf-merge': 48,
  'qr-code-generator': 44,
  'json-formatter': 39,
  'password-generator': 36,
  'markdown-editor': 33,
  'sql-formatter': 29,
  'unit-converter': 27,
  'base64-converter': 25,
  'image-converter': 24,
  'loan-calculator': 22,
  'regex-tester': 21,
  'lorem-ipsum-generator': 19,
  'hash-generator': 18,
  'color-picker': 17,
  'diff-checker': 16,
};

/**
 * Safely retrieves all tool click counts from localStorage.
 * Initializes with realistic seed data if not yet present.
 */
export function getToolClickCounts(): Record<string, number> {
  if (typeof window === 'undefined') return { ...DEFAULT_SEED_CLICKS };
  try {
    const raw = localStorage.getItem(TOOL_CLICKS_STORAGE_KEY);
    if (!raw) {
      // Seed initial clicks
      localStorage.setItem(TOOL_CLICKS_STORAGE_KEY, JSON.stringify(DEFAULT_SEED_CLICKS));
      return { ...DEFAULT_SEED_CLICKS };
    }
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
    return { ...DEFAULT_SEED_CLICKS };
  } catch (err) {
    console.warn('Failed to parse tool click counts from localStorage:', err);
    return { ...DEFAULT_SEED_CLICKS };
  }
}

/**
 * Gets click frequency for a specific tool ID.
 */
export function getToolClickCount(toolId: string): number {
  const counts = getToolClickCounts();
  return counts[toolId] || 0;
}

/**
 * Records a click on a tool in local storage, incrementing its frequency by 1.
 * Dispatches a window event so all UI components update live.
 */
export function recordToolClick(toolId: string): number {
  if (typeof window === 'undefined' || !toolId) return 0;
  try {
    const counts = getToolClickCounts();
    const newCount = (counts[toolId] || 0) + 1;
    counts[toolId] = newCount;
    localStorage.setItem(TOOL_CLICKS_STORAGE_KEY, JSON.stringify(counts));

    // Notify listeners across components
    window.dispatchEvent(
      new CustomEvent(TOOL_CLICK_EVENT, {
        detail: { toolId, count: newCount, timestamp: Date.now() },
      })
    );

    return newCount;
  } catch (err) {
    console.warn('Failed to record tool click in localStorage:', err);
    return 0;
  }
}

/**
 * Returns tools sorted strictly by click frequency tracked in localStorage.
 */
export function getMostPopularTools(
  allTools: ToolItem[],
  limit = 8
): PopularToolRanking[] {
  const counts = getToolClickCounts();

  // Create a map of tool ID to ToolItem for fast lookup
  const toolMap = new Map<string, ToolItem>();
  for (const tool of allTools) {
    toolMap.set(tool.id, tool);
  }

  // Combine tracked tools with all available tools
  const rankedList: { tool: ToolItem; clicks: number }[] = [];

  for (const tool of allTools) {
    const clicks = counts[tool.id] || 0;
    rankedList.push({ tool, clicks });
  }

  // Sort descending by click count; tiebreaker by name
  rankedList.sort((a, b) => {
    if (b.clicks !== a.clicks) {
      return b.clicks - a.clicks;
    }
    return a.tool.name.localeCompare(b.tool.name);
  });

  return rankedList.slice(0, limit).map((item, index) => ({
    tool: item.tool,
    clicks: item.clicks,
    rank: index + 1,
  }));
}

/**
 * Resets tracked click frequencies back to initial baseline seed.
 */
export function resetToolClickCounts(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOOL_CLICKS_STORAGE_KEY, JSON.stringify(DEFAULT_SEED_CLICKS));
    window.dispatchEvent(
      new CustomEvent(TOOL_CLICK_EVENT, {
        detail: { reset: true, timestamp: Date.now() },
      })
    );
  } catch (err) {
    console.warn('Failed to reset tool click counts:', err);
  }
}
