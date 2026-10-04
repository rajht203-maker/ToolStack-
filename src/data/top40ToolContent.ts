import { TopToolContent, PDF_IMAGE_CONTENT } from './toolContentPdfImage';
import { TEXT_DEV_CALC_CONTENT } from './toolContentTextDevCalc';

export type { TopToolContent };

/**
 * Unified directory of original, handcrafted, in-depth content
 * for all 40 indexable tools on ToolStack.
 */
export const TOP_40_TOOL_CONTENT: Record<string, TopToolContent> = {
  ...PDF_IMAGE_CONTENT,
  ...TEXT_DEV_CALC_CONTENT
};

/**
 * Retrieve comprehensive custom editorial content for an indexable tool
 */
export function getTopToolContent(slugOrId: string): TopToolContent | undefined {
  if (!slugOrId) return undefined;
  const key = slugOrId.toLowerCase().trim();
  return TOP_40_TOOL_CONTENT[key];
}
