import React, { useState, useMemo } from 'react';
import { ToolItem } from '../../types';
import { 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Sparkles, 
  Sliders, 
  FileText, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Layers,
  Code2,
  Terminal,
  Type
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CustomToolRunnerProps {
  tool: ToolItem;
  onSuccess: (summary: string) => void;
}

export const CustomToolRunner: React.FC<CustomToolRunnerProps> = ({ tool, onSuccess }) => {
  const [inputText, setInputText] = useState('Sample text for processing with ' + tool.name);
  const [secondaryInput, setSecondaryInput] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<string>('auto');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const runnerType = tool.customRunnerType || 'utility';

  // Compute live character / word counts
  const stats = useMemo(() => {
    const chars = inputText.length;
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    const lines = inputText ? inputText.split(/\n/).length : 0;
    return { chars, words, lines };
  }, [inputText]);

  // Execute processing based on tool runner type and operation
  const handleExecute = async () => {
    setIsProcessing(true);
    setStatusMessage(null);

    try {
      await new Promise(r => setTimeout(r, 150)); // smooth tactile feel
      let result = '';

      if (runnerType === 'prompt') {
        // Template / Prompt Generator
        const template = tool.customTemplate || 'You are an expert. Please analyze the following details carefully:\n\nInput Context:\n{{input}}\n\nSpecific Focus / Requirement:\n{{secondary}}\n\nProvide structured, actionable output with clear headers and key takeaways.';
        result = template
          .replace(/\{\{input\}\}/gi, inputText)
          .replace(/\{\{secondary\}\}/gi, secondaryInput || 'Standard Professional Guidance')
          .replace(/\{\{toolName\}\}/gi, tool.name);
      } else if (runnerType === 'calculator') {
        // Calculation or math evaluation
        const num1 = parseFloat(inputText) || 0;
        const num2 = parseFloat(secondaryInput) || 0;
        const sum = num1 + num2;
        const diff = num1 - num2;
        const product = num1 * num2;
        const ratio = num2 !== 0 ? (num1 / num2).toFixed(4) : 'N/A';
        const percentage = num2 !== 0 ? ((num1 / num2) * 100).toFixed(2) + '%' : 'N/A';

        result = `--- ${tool.name.toUpperCase()} CALCULATION REPORT ---\n` +
          `Primary Input Value: ${num1}\n` +
          `Secondary Input Value: ${num2}\n` +
          `Sum / Total: ${sum}\n` +
          `Difference: ${diff}\n` +
          `Product: ${product}\n` +
          `Ratio (A / B): ${ratio}\n` +
          `Percentage Share: ${percentage}\n\n` +
          `Computed at: ${new Date().toLocaleString()}`;
      } else {
        // Standard Utility Transformation
        if (selectedOperation === 'uppercase') {
          result = inputText.toUpperCase();
        } else if (selectedOperation === 'lowercase') {
          result = inputText.toLowerCase();
        } else if (selectedOperation === 'titlecase') {
          result = inputText.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        } else if (selectedOperation === 'reverse') {
          result = inputText.split('').reverse().join('');
        } else if (selectedOperation === 'base64_encode') {
          result = btoa(unescape(encodeURIComponent(inputText)));
        } else if (selectedOperation === 'base64_decode') {
          try {
            result = decodeURIComponent(escape(atob(inputText)));
          } catch {
            throw new Error('Invalid Base64 string.');
          }
        } else if (selectedOperation === 'json_pretty') {
          try {
            const parsed = JSON.parse(inputText);
            result = JSON.stringify(parsed, null, 2);
          } catch (e: any) {
            throw new Error('Invalid JSON format: ' + e.message);
          }
        } else if (selectedOperation === 'url_encode') {
          result = encodeURIComponent(inputText);
        } else {
          // Default context-aware transformation based on category
          if (tool.category === 'developer' || tool.category === 'security') {
            result = `/* Cleaned & Processed by ${tool.name} */\n${inputText.trim()}`;
          } else {
            result = inputText.trim();
          }
        }
      }

      setOutputText(result);
      setStatusMessage('Operation completed successfully.');
      onSuccess(`Processed ${tool.name}`);

      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.8 }
        });
      } catch {
        // Non-fatal
      }
    } catch (err: any) {
      setStatusMessage('Error: ' + (err.message || 'Failed to process.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tool.slug || 'tool-result'}-output.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tool Header & Badge */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {tool.name}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {tool.badge || 'Custom Tool'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {tool.description}
              </p>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-400">
            <span>Client-Side Processing • 100% Private</span>
          </div>
        </div>

        {/* Inputs Section */}
        <div className="space-y-4 pt-2">
          {/* Main Input Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {runnerType === 'prompt' ? 'Main Prompt Topic / Content' : 'Input Data & Content'}
              </label>
              <div className="text-[11px] text-slate-400 space-x-2">
                <span>{stats.words} words</span>
                <span>•</span>
                <span>{stats.chars} chars</span>
                <span>•</span>
                <span>{stats.lines} lines</span>
              </div>
            </div>
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your source text or parameters here..."
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* Secondary Input if prompt or calculator */}
          {(runnerType === 'prompt' || runnerType === 'calculator') && (
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                {runnerType === 'prompt' ? 'Target Audience / Tone / Instructions (Optional)' : 'Secondary Input Value (B)'}
              </label>
              <input
                type={runnerType === 'calculator' ? 'number' : 'text'}
                value={secondaryInput}
                onChange={(e) => setSecondaryInput(e.target.value)}
                placeholder={runnerType === 'prompt' ? 'e.g. For senior engineers, concise bullet points' : 'e.g. 50'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          )}

          {/* Mode Selector for Standard Utility */}
          {runnerType === 'utility' && (
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Transformation Routine
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'auto', label: 'Default Clean' },
                  { id: 'uppercase', label: 'UPPERCASE' },
                  { id: 'lowercase', label: 'lowercase' },
                  { id: 'titlecase', label: 'Title Case' },
                  { id: 'reverse', label: 'Reverse Text' },
                  { id: 'json_pretty', label: 'Prettify JSON' },
                  { id: 'base64_encode', label: 'Base64 Encode' },
                  { id: 'base64_decode', label: 'Base64 Decode' },
                  { id: 'url_encode', label: 'URL Encode' }
                ].map(op => (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => setSelectedOperation(op.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      selectedOperation === op.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleExecute}
              disabled={isProcessing || !inputText.trim()}
              className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{tool.customActionLabel || `Execute ${tool.name}`}</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setInputText('');
                setSecondaryInput('');
                setOutputText('');
                setStatusMessage(null);
              }}
              className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all"
            >
              Clear
            </button>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMessage.startsWith('Error')
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
            }`}>
              {statusMessage.startsWith('Error') ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Results Output Section */}
          {outputText && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Processed Result
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                rows={7}
                value={outputText}
                className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-slate-100 outline-hidden leading-relaxed shadow-inner"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
