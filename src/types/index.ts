import type { ToolFieldDefinition } from '../config/toolFieldRegistry';

export type ToolCategory = 
  | 'pdf'
  | 'image'
  | 'text'
  | 'developer'
  | 'calculator'
  | 'converter'
  | 'security'
  | 'seo'
  | 'social'
  | 'ai';

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolItem {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory;
  description: string;
  icon: string;
  tags: string[];
  popular?: boolean;
  trending?: boolean;
  recentlyAdded?: boolean;
  isNew?: boolean;
  requiresAuth?: boolean;
  badge?: string;
  largeFileSupport?: boolean;
  howToUse: string[];
  fields?: ToolFieldDefinition[];
  faqs: ToolFAQ[];
  relatedToolIds: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
  count?: number;
  gradient: string;
  subcategories?: string[];
}

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  status?: 'active' | 'suspended';
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserFavorite {
  id: string;
  userId: string;
  toolId: string;
  toolName: string;
  createdAt: string;
}

export interface ToolHistoryItem {
  id: string;
  userId: string;
  toolId: string;
  toolName: string;
  summary: string;
  createdAt: string;
}

export interface SavedPreset {
  id: string;
  userId: string;
  toolId: string;
  name: string;
  presetData: string;
  createdAt: string;
}

export interface SiteSettings {
  announcement: string;
  maintenanceMode: boolean;
  featuredTools: string[];
  disabledTools?: string[];
  toolBadges?: Record<string, string>;
  allowRegistrations?: boolean;
  maxUploadSizeMb?: number;
  updatedAt?: string;
  updatedBy?: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  details: string;
  createdAt: string;
}

export type FeedbackType = 'rating' | 'bug_report' | 'improvement';

export interface ToolFeedback {
  id: string;
  feedbackId?: string;
  toolId: string;
  toolName: string;
  rating: number; // 1 to 5
  type: FeedbackType;
  comment: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export type ThemeColorPreset = 
  | 'indigo' 
  | 'emerald' 
  | 'violet' 
  | 'ocean' 
  | 'rose' 
  | 'amber' 
  | 'teal' 
  | 'slate' 
  | 'custom';

export type ToolCardDensity = 'comfortable' | 'compact';
export type ToolCornerStyle = 'rounded' | 'sharp' | 'pill';
export type ToolFontFamily = 'sans' | 'mono';

export interface CustomThemeSettings {
  preset: ThemeColorPreset;
  customPrimaryHex?: string;
  density: ToolCardDensity;
  cornerStyle: ToolCornerStyle;
  fontFamily: ToolFontFamily;
  accentGlow: boolean;
}

export interface PopularToolRanking {
  tool: ToolItem;
  clicks: number;
  rank: number;
}

