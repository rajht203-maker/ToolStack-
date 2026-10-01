import React, { useState, useEffect } from 'react';
import { ToolItem, ToolCategory } from '../../types';
import { CATEGORIES } from '../../data/toolsData';
import { useTools } from '../../context/ToolsContext';
import { 
  X, 
  Save, 
  Sparkles, 
  Plus, 
  Trash2, 
  Sliders, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Layers,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ToolEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolToEdit: ToolItem | null; // null means "Add New Tool"
}

export const ToolEditModal: React.FC<ToolEditModalProps> = ({
  isOpen,
  onClose,
  toolToEdit
}) => {
  const { saveCustomTool, updateTool, resetToolToDefault, overriddenToolIds } = useTools();

  const isEditing = Boolean(toolToEdit);
  const isCustomTool = Boolean(toolToEdit?.isCustom);
  const isOverridden = isEditing && overriddenToolIds.includes(toolToEdit!.id);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<ToolCategory>('developer');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState<string>('New');
  const [icon, setIcon] = useState('Sparkles');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<'active' | 'disabled' | 'maintenance'>('active');

  // How To Use Steps (Array of strings)
  const [howToUseSteps, setHowToUseSteps] = useState<string[]>([
    'Upload or enter your input data.',
    'Configure the required parameters and options.',
    'Process to get your instant results.'
  ]);

  // FAQs (Array of { question, answer })
  const [faqsList, setFaqsList] = useState<{ question: string; answer: string }[]>([
    {
      question: 'Is my data secure with this tool?',
      answer: 'Yes! All operations are processed privately and securely directly within your browser.'
    }
  ]);

  // Custom Runner Engine Settings
  const [customRunnerType, setCustomRunnerType] = useState<'utility' | 'prompt' | 'generator' | 'converter' | 'calculator'>('utility');
  const [customActionLabel, setCustomActionLabel] = useState('Execute Tool');
  const [customTemplate, setCustomTemplate] = useState('');

  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize form when opened or tool changes
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(null);

      if (toolToEdit) {
        setName(toolToEdit.name);
        setSlug(toolToEdit.slug);
        setCategory(toolToEdit.category);
        setDescription(toolToEdit.description);
        setBadge(toolToEdit.badge || '');
        setIcon(toolToEdit.icon || 'Sparkles');
        setTagsInput((toolToEdit.tags || []).join(', '));
        setStatus(toolToEdit.customStatus || 'active');
        setHowToUseSteps(toolToEdit.howToUse && toolToEdit.howToUse.length > 0 
          ? [...toolToEdit.howToUse] 
          : ['Follow instructions provided.', 'Click Execute.', 'Copy or download output.']
        );
        setFaqsList(toolToEdit.faqs && toolToEdit.faqs.length > 0 
          ? [...toolToEdit.faqs] 
          : [{ question: 'How do I use this tool?', answer: 'Follow the steps outlined in the How to Use guide above.' }]
        );
        setCustomRunnerType(toolToEdit.customRunnerType || 'utility');
        setCustomActionLabel(toolToEdit.customActionLabel || `Execute ${toolToEdit.name}`);
        setCustomTemplate(toolToEdit.customTemplate || '');
        setSeoTitle(toolToEdit.seoTitle || `${toolToEdit.name} Online - ToolStack`);
        setSeoDescription(toolToEdit.seoDescription || toolToEdit.description);
      } else {
        // New tool defaults
        setName('');
        setSlug('');
        setCategory('developer');
        setDescription('');
        setBadge('New');
        setIcon('Sparkles');
        setTagsInput('developer, tools, online, free');
        setStatus('active');
        setHowToUseSteps([
          'Paste or upload your target content.',
          'Choose your preferred configuration options.',
          'Click execute and download or copy the result.'
        ]);
        setFaqsList([
          {
            question: 'Is this tool free to use?',
            answer: 'Yes! ToolStack utilities are 100% free with client-side execution.'
          }
        ]);
        setCustomRunnerType('utility');
        setCustomActionLabel('Execute Tool');
        setCustomTemplate('');
        setSeoTitle('');
        setSeoDescription('');
      }
    }
  }, [isOpen, toolToEdit]);

  // Auto-generate slug when name changes for new tools
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
      setSeoTitle(`${val} Online - Free ToolStack Utility`);
    }
  };

  if (!isOpen) return null;

  // Add / Remove How to Use steps
  const handleAddStep = () => {
    setHowToUseSteps([...howToUseSteps, '']);
  };
  const handleUpdateStep = (idx: number, text: string) => {
    const updated = [...howToUseSteps];
    updated[idx] = text;
    setHowToUseSteps(updated);
  };
  const handleRemoveStep = (idx: number) => {
    if (howToUseSteps.length <= 1) return;
    setHowToUseSteps(howToUseSteps.filter((_, i) => i !== idx));
  };

  // Add / Remove FAQs
  const handleAddFaq = () => {
    setFaqsList([...faqsList, { question: '', answer: '' }]);
  };
  const handleUpdateFaq = (idx: number, field: 'question' | 'answer', text: string) => {
    const updated = [...faqsList];
    updated[idx][field] = text;
    setFaqsList(updated);
  };
  const handleRemoveFaq = (idx: number) => {
    setFaqsList(faqsList.filter((_, i) => i !== idx));
  };

  // Submit Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Tool name is required.');
      return;
    }
    if (!slug.trim()) {
      setError('Tool slug is required.');
      return;
    }
    if (!description.trim()) {
      setError('Tool description is required.');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const cleanHowToUse = howToUseSteps.map(s => s.trim()).filter(Boolean);
    const cleanFaqs = faqsList.filter(f => f.question.trim() && f.answer.trim());

    try {
      if (isEditing && toolToEdit) {
        // Update existing tool (override or custom tool)
        await updateTool(toolToEdit.id, {
          name: name.trim(),
          slug: slug.trim().toLowerCase(),
          category,
          description: description.trim(),
          badge: badge.trim() || undefined,
          icon: icon.trim() || 'Sparkles',
          tags: parsedTags,
          customStatus: status,
          howToUse: cleanHowToUse.length > 0 ? cleanHowToUse : ['Follow instructions.'],
          faqs: cleanFaqs,
          customRunnerType,
          customActionLabel: customActionLabel.trim() || `Execute ${name.trim()}`,
          customTemplate: customTemplate.trim(),
          seoTitle: seoTitle.trim() || `${name} Online`,
          seoDescription: seoDescription.trim() || description.trim()
        });

        setSuccess(`Successfully updated "${name}". Changes are live across ToolStack.`);
      } else {
        // Create brand new custom tool
        const newToolId = `custom-${slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;
        const newTool: ToolItem = {
          id: newToolId,
          slug: slug.trim().toLowerCase(),
          name: name.trim(),
          category,
          description: description.trim(),
          icon: icon.trim() || 'Sparkles',
          tags: parsedTags.length > 0 ? parsedTags : [category, 'tool'],
          badge: badge.trim() || 'New',
          customStatus: status,
          isCustom: true,
          howToUse: cleanHowToUse.length > 0 ? cleanHowToUse : ['Input data.', 'Process.', 'Download output.'],
          faqs: cleanFaqs,
          relatedToolIds: [],
          customRunnerType,
          customActionLabel: customActionLabel.trim() || `Execute ${name.trim()}`,
          customTemplate: customTemplate.trim(),
          seoTitle: seoTitle.trim() || `${name.trim()} Online - Free ToolStack Utility`,
          seoDescription: seoDescription.trim() || description.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await saveCustomTool(newTool);
        setSuccess(`Successfully created and published tool "${name}".`);
      }

      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 }
        });
      } catch {
        // Non-fatal
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Error saving tool:', err);
      setError(err.message || 'Failed to save tool changes.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset override back to original defaults
  const handleResetToDefault = async () => {
    if (!toolToEdit) return;
    if (!window.confirm(`Reset "${toolToEdit.name}" back to its built-in system defaults? Any custom modifications will be cleared.`)) {
      return;
    }

    setIsSaving(true);
    try {
      await resetToolToDefault(toolToEdit.id);
      setSuccess(`Reset "${toolToEdit.name}" to factory default.`);
      setTimeout(() => onClose(), 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset tool.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isEditing ? `Edit Tool: ${toolToEdit?.name}` : 'Add New Tool to Registry'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isEditing 
                  ? 'Update metadata, instructions, FAQ, and operational status in real-time.' 
                  : 'Register a new interactive utility available immediately across ToolStack.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5">
          {/* Notification Messages */}
          {success && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-800 dark:text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section: Basic Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              Basic Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Tool Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. WiFi QR Generator"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. wifi-qr-generator"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ToolCategory)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold capitalize outline-hidden"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Badge (Optional)
                </label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold outline-hidden"
                >
                  <option value="">None</option>
                  <option value="New">New</option>
                  <option value="Hot">Hot</option>
                  <option value="Popular">Popular</option>
                  <option value="Pro">Pro</option>
                  <option value="Beta">Beta</option>
                  <option value="Updated">Updated</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Operational Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold outline-hidden"
                >
                  <option value="active">Operational (Active)</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="disabled">Disabled (Hidden)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of what this tool does and key user benefits..."
                className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Search Tags <span className="font-normal text-slate-400">(Comma-separated)</span>
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. pdf, password, encrypt, lock, decrypt"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-hidden"
              />
            </div>
          </div>

          {/* Section: Custom Execution Engine (Only for custom tools) */}
          {(!isEditing || isCustomTool) && (
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                Execution Engine & Behavior
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Runner Engine Type
                  </label>
                  <select
                    value={customRunnerType}
                    onChange={(e) => setCustomRunnerType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold outline-hidden"
                  >
                    <option value="utility">Interactive Data Utility (Text/Data/JSON/Code)</option>
                    <option value="prompt">Prompt &amp; AI Template Generator</option>
                    <option value="calculator">Mathematical / Metric Evaluation Calculator</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Action Button Label
                  </label>
                  <input
                    type="text"
                    value={customActionLabel}
                    onChange={(e) => setCustomActionLabel(e.target.value)}
                    placeholder="e.g. Generate Clean Output"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-hidden"
                  />
                </div>
              </div>

              {customRunnerType === 'prompt' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Prompt Template <span className="font-normal text-slate-400">(Use {"{{input}}"} and {"{{secondary}}"} as placeholders)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={customTemplate}
                    onChange={(e) => setCustomTemplate(e.target.value)}
                    placeholder="You are an expert. Please evaluate:&#10;{{input}}&#10;&#10;Audience & Goal:&#10;{{secondary}}"
                    className="w-full p-2.5 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-hidden leading-relaxed"
                  />
                </div>
              )}
            </div>
          )}

          {/* Section: How to Use Steps */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                How to Use Steps ({howToUseSteps.length})
              </h4>
              <button
                type="button"
                onClick={handleAddStep}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Step
              </button>
            </div>

            <div className="space-y-2">
              {howToUseSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleUpdateStep(idx, e.target.value)}
                    placeholder={`Step ${idx + 1} instruction...`}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-hidden"
                  />
                  {howToUseSteps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Remove step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section: FAQs */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                Frequently Asked Questions ({faqsList.length})
              </h4>
              <button
                type="button"
                onClick={handleAddFaq}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add FAQ
              </button>
            </div>

            <div className="space-y-3">
              {faqsList.map((faq, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                      placeholder="Question..."
                      className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                    placeholder="Helpful answer..."
                    className="w-full p-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-hidden"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section: SEO */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Search Engine Optimization (SEO)
            </h4>
            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Custom Page Meta Title
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="e.g. WiFi QR Generator - Free ToolStack Tool"
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-hidden"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Custom Page Meta Description
                </label>
                <input
                  type="text"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="e.g. Generate custom QR codes for WiFi and links..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              {isOverridden && (
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Factory Default</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-indigo-200 dark:shadow-none flex items-center gap-2 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Save Changes' : 'Create & Publish Tool'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
