import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ToolItem, CategoryInfo } from '../types';
import { TOOLS_DATA as DEFAULT_TOOLS_DATA, CATEGORIES as DEFAULT_CATEGORIES } from '../data/toolsData';

interface ToolsContextType {
  tools: ToolItem[];
  categories: CategoryInfo[];
  customTools: ToolItem[];
  overriddenToolIds: string[];
  disabledTools: string[];
  loading: boolean;
  getToolBySlug: (slug: string) => ToolItem | undefined;
  getToolById: (id: string) => ToolItem | undefined;
  saveCustomTool: (tool: ToolItem) => Promise<void>;
  updateTool: (toolId: string, updates: Partial<ToolItem>) => Promise<void>;
  deleteCustomTool: (toolId: string) => Promise<void>;
  resetToolToDefault: (toolId: string) => Promise<void>;
  toggleToolStatus: (toolId: string) => Promise<void>;
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

const LOCAL_STORAGE_CUSTOM_TOOLS = 'toolstack_custom_tools';
const LOCAL_STORAGE_OVERRIDES = 'toolstack_tool_overrides';
const LOCAL_STORAGE_DISABLED = 'toolstack_disabled_tools';

export const ToolsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customTools, setCustomTools] = useState<ToolItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CUSTOM_TOOLS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toolOverrides, setToolOverrides] = useState<Record<string, Partial<ToolItem>>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_OVERRIDES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [disabledTools, setDisabledTools] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_DISABLED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(true);

  // Sync real-time Firestore custom_tools collection
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'custom_tools'), (snapshot) => {
        const firestoreCustom: ToolItem[] = [];
        const firestoreOverrides: Record<string, Partial<ToolItem>> = {};
        const firestoreDisabled: string[] = [];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          const toolId = data.toolId || docSnap.id;

          if (data.status === 'disabled') {
            firestoreDisabled.push(toolId);
          }

          if (data.isCustom) {
            firestoreCustom.push({
              ...data,
              id: toolId,
              slug: data.slug || toolId,
              howToUse: Array.isArray(data.howToUse) 
                ? data.howToUse 
                : typeof data.howToUse === 'string' 
                ? data.howToUse.split('\n').filter(Boolean)
                : ['Follow instructions provided.'],
              faqs: Array.isArray(data.faqs) ? data.faqs : [],
              tags: Array.isArray(data.tags) ? data.tags : typeof data.tags === 'string' ? data.tags.split(',').map((t: string) => t.trim()) : [],
              relatedToolIds: Array.isArray(data.relatedToolIds) ? data.relatedToolIds : []
            } as ToolItem);
          } else {
            // It is an override for an existing built-in tool
            firestoreOverrides[toolId] = {
              ...data,
              howToUse: typeof data.howToUse === 'string' ? data.howToUse.split('\n').filter(Boolean) : data.howToUse,
              tags: typeof data.tags === 'string' ? data.tags.split(',').map((t: string) => t.trim()) : data.tags
            };
          }
        });

        setCustomTools(firestoreCustom);
        setToolOverrides(firestoreOverrides);
        if (firestoreDisabled.length > 0) {
          setDisabledTools(prev => Array.from(new Set([...prev, ...firestoreDisabled])));
        }

        try {
          localStorage.setItem(LOCAL_STORAGE_CUSTOM_TOOLS, JSON.stringify(firestoreCustom));
          localStorage.setItem(LOCAL_STORAGE_OVERRIDES, JSON.stringify(firestoreOverrides));
        } catch {
          // Non-fatal
        }

        setLoading(false);
      }, (err) => {
        console.warn('Firestore custom_tools subscription notice:', err.message);
        setLoading(false);
      });

      return () => unsub();
    } catch (e) {
      console.warn('Could not initialize custom_tools listener:', e);
      setLoading(false);
    }
  }, []);

  // Save disabled tools state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_DISABLED, JSON.stringify(disabledTools));
    } catch {
      // Non-fatal
    }
  }, [disabledTools]);

  // Merge default tools with custom tools and overrides
  const tools = useMemo(() => {
    const updatedDefaultTools = DEFAULT_TOOLS_DATA.map((t) => {
      const override = toolOverrides[t.id];
      if (override) {
        return {
          ...t,
          ...override,
          tags: override.tags || t.tags,
          howToUse: override.howToUse || t.howToUse,
          faqs: override.faqs || t.faqs
        };
      }
      return t;
    });

    return [...customTools, ...updatedDefaultTools];
  }, [customTools, toolOverrides]);

  // Compute dynamic category counts
  const categories = useMemo(() => {
    return DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      count: tools.filter(t => t.category === cat.id && !disabledTools.includes(t.id)).length
    }));
  }, [tools, disabledTools]);

  const overriddenToolIds = useMemo(() => Object.keys(toolOverrides), [toolOverrides]);

  // Lookup tools by slug or id (with hyphen/alias matching)
  const getToolBySlug = useCallback((slug: string): ToolItem | undefined => {
    if (!slug) return undefined;
    const cleanSlug = slug.toLowerCase().trim();
    const direct = tools.find(t => t.slug.toLowerCase() === cleanSlug || t.id.toLowerCase() === cleanSlug);
    if (direct) return direct;

    const aliasMap: Record<string, string> = {
      'compress-pdf': 'pdf-compress',
      'merge-pdf': 'pdf-merge',
      'split-pdf': 'pdf-split',
      'resize-image': 'image-resizer',
      'compress-image': 'image-compressor',
    };
    if (aliasMap[cleanSlug]) {
      const target = aliasMap[cleanSlug];
      const match = tools.find(t => t.slug.toLowerCase() === target || t.id.toLowerCase() === target);
      if (match) return match;
    }

    if (cleanSlug.includes('-')) {
      const parts = cleanSlug.split('-');
      if (parts.length === 2) {
        const rev = `${parts[1]}-${parts[0]}`;
        const revMatch = tools.find(t => t.slug.toLowerCase() === rev || t.id.toLowerCase() === rev);
        if (revMatch) return revMatch;
      }
    }

    return undefined;
  }, [tools]);

  const getToolById = useCallback((id: string): ToolItem | undefined => {
    if (!id) return undefined;
    return tools.find(t => t.id === id);
  }, [tools]);

  // Save a brand new tool created by admin
  const saveCustomTool = useCallback(async (tool: ToolItem) => {
    const cleanId = tool.id || `custom-${tool.slug.replace(/[^a-z0-9-]/gi, '-').toLowerCase()}`;
    const cleanSlug = (tool.slug || cleanId).toLowerCase().trim();

    const toolDoc: any = {
      toolId: cleanId,
      name: tool.name.trim(),
      slug: cleanSlug,
      category: tool.category,
      description: tool.description.trim(),
      icon: tool.icon || 'Sparkles',
      tags: Array.isArray(tool.tags) ? tool.tags : [],
      badge: tool.badge || 'New',
      status: tool.customStatus || 'active',
      isCustom: true,
      howToUse: tool.howToUse || ['Input your data.', 'Execute the utility.', 'Copy or download your result.'],
      faqs: tool.faqs || [],
      customRunnerType: tool.customRunnerType || 'utility',
      customActionLabel: tool.customActionLabel || 'Process & Execute',
      customTemplate: tool.customTemplate || '',
      seoTitle: tool.seoTitle || `${tool.name} Online - Free ToolStack Utility`,
      seoDescription: tool.seoDescription || tool.description,
      updatedAt: new Date().toISOString()
    };

    // Update state locally first for instant UI response
    setCustomTools(prev => {
      const idx = prev.findIndex(t => t.id === cleanId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...toolDoc };
        return copy;
      }
      return [toolDoc, ...prev];
    });

    // Write to Firestore
    try {
      await setDoc(doc(db, 'custom_tools', cleanId), {
        ...toolDoc,
        createdAt: tool.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e: any) {
      console.error('Failed to save custom tool to Firestore:', e);
      throw e;
    }
  }, []);

  // Update/Change an existing tool (override properties)
  const updateTool = useCallback(async (toolId: string, updates: Partial<ToolItem>) => {
    const isCustom = customTools.some(t => t.id === toolId);

    if (isCustom) {
      const existing = customTools.find(t => t.id === toolId);
      if (existing) {
        await saveCustomTool({ ...existing, ...updates });
      }
      return;
    }

    // It's a built-in tool: save override
    const cleanUpdates = {
      ...updates,
      toolId,
      isCustom: false,
      updatedAt: new Date().toISOString()
    };

    setToolOverrides(prev => ({
      ...prev,
      [toolId]: cleanUpdates
    }));

    try {
      await setDoc(doc(db, 'custom_tools', toolId), cleanUpdates, { merge: true });
    } catch (e: any) {
      console.error('Failed to save tool override to Firestore:', e);
      throw e;
    }
  }, [customTools, saveCustomTool]);

  // Delete a custom tool
  const deleteCustomTool = useCallback(async (toolId: string) => {
    setCustomTools(prev => prev.filter(t => t.id !== toolId));
    try {
      await deleteDoc(doc(db, 'custom_tools', toolId));
    } catch (e: any) {
      console.error('Failed to delete custom tool from Firestore:', e);
      throw e;
    }
  }, []);

  // Reset a modified built-in tool back to its default state
  const resetToolToDefault = useCallback(async (toolId: string) => {
    setToolOverrides(prev => {
      const next = { ...prev };
      delete next[toolId];
      return next;
    });

    try {
      await deleteDoc(doc(db, 'custom_tools', toolId));
    } catch (e: any) {
      console.error('Failed to reset tool override in Firestore:', e);
      throw e;
    }
  }, []);

  // Toggle tool operational vs disabled status
  const toggleToolStatus = useCallback(async (toolId: string) => {
    const isCurrentlyDisabled = disabledTools.includes(toolId);
    let nextDisabled: string[];

    if (isCurrentlyDisabled) {
      nextDisabled = disabledTools.filter(id => id !== toolId);
    } else {
      nextDisabled = [...disabledTools, toolId];
    }

    setDisabledTools(nextDisabled);

    try {
      await setDoc(doc(db, 'custom_tools', toolId), {
        toolId,
        status: isCurrentlyDisabled ? 'active' : 'disabled',
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch {
      // Non-fatal, local state preserved
    }
  }, [disabledTools]);

  return (
    <ToolsContext.Provider value={{
      tools,
      categories,
      customTools,
      overriddenToolIds,
      disabledTools,
      loading,
      getToolBySlug,
      getToolById,
      saveCustomTool,
      updateTool,
      deleteCustomTool,
      resetToolToDefault,
      toggleToolStatus
    }}>
      {children}
    </ToolsContext.Provider>
  );
};

export const useTools = () => {
  const context = useContext(ToolsContext);
  if (!context) {
    throw new Error('useTools must be used within a ToolsProvider');
  }
  return context;
};
