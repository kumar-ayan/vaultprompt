import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { localHistory, LocalPrompt } from '../../utils/localHistory';
import {
  analyzePromptAction,
  improvePromptAction,
  runMultiModelEvalAction,
  AnalysisResult,
} from './actions';

export interface EvalResult {
  model: string;
  status: 'success' | 'error';
  data?: {
    actual_output: string;
    score: number | null;
    judgement_reason: string | null;
  };
  error?: string;
}

const DEFAULT_PROMPT = "Act as a senior technical SEO content strategist. Your objective is to create a high-impact, 1000-word blog post optimized for specific long-tail keywords.\n\nKey Instructions:\n1. Tone: Professional yet accessible, using the inverted pyramid style.\n2. Structure: Include a hook-driven introduction, at least four H2 subheadings, and a clear CTA.\n3. Entities: Naturally integrate related semantic terms without keyword stuffing.\n4. Formatting: Use bullet points for readability.";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unexpected error';
}

export function usePromptManager() {
  const router = useRouter();
  const [promptText, setPromptText] = useState(DEFAULT_PROMPT);
  const [metrics, setMetrics] = useState<AnalysisResult | null>(null);
  const [evalResults, setEvalResults] = useState<EvalResult[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor'|'search'|'analytics'|'eval'>('editor');
  const [searchQuery, setSearchQuery] = useState("");
  const [savedPrompts, setSavedPrompts] = useState<LocalPrompt[]>([]);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [selectedPromptName, setSelectedPromptName] = useState('Unsaved Prompt');
  const [selectedVersionNumber, setSelectedVersionNumber] = useState<number | null>(null);

  useEffect(() => {
    refreshSavedPrompts();
  }, [activeTab]);

  const refreshSavedPrompts = () => {
    setSavedPrompts(localHistory.getPrompts());
  };

  const handleCreatePrompt = () => {
    setSelectedPromptId(null);
    setSelectedPromptName('Unsaved Prompt');
    setSelectedVersionNumber(null);
    setPromptText(DEFAULT_PROMPT);
    setMetrics(null);
    setEvalResults(null);
    setActiveTab('editor');
  };

  const handleSelectPrompt = (prompt: LocalPrompt) => {
    const latestVersion = prompt.prompt_versions[0] ?? null;

    setSelectedPromptId(prompt.id);
    setSelectedPromptName(prompt.name);
    setSelectedVersionNumber(latestVersion?.version_num ?? null);
    setPromptText(latestVersion?.content ?? '');
    setMetrics(latestVersion?.analysis_metrics ?? null);
    setEvalResults(null);
    setActiveTab('editor');
  };

  const handleSave = async () => {
    if (!promptText.trim()) return;
    setIsSaving(true);
    try {
      const savedPrompt = localHistory.savePrompt(
        promptText,
        selectedPromptId,
        metrics?.overall,
        metrics
      );

      setSelectedPromptId(savedPrompt.id);
      setSelectedPromptName(savedPrompt.name);
      setSelectedVersionNumber(savedPrompt.prompt_versions[0].version_num);
      refreshSavedPrompts();
      alert("Prompt saved to local history!");
    } catch (error: unknown) {
      alert("Failed to save: " + getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyze = async () => {
    if (!promptText.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await analyzePromptAction(promptText);
      setMetrics(res);
    } catch (error: unknown) {
      alert("Failed to analyze: " + getErrorMessage(error));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImprove = async () => {
    if (!promptText.trim()) return;
    setIsImproving(true);
    try {
      const res = await improvePromptAction(promptText);
      setPromptText(res.improvedPrompt);
    } catch (error: unknown) {
      alert("Failed to improve: " + getErrorMessage(error));
    } finally {
      setIsImproving(false);
    }
  };

  const handleMultiModelEval = async () => {
    if (!promptText.trim()) return;
    setIsEvaluating(true);
    setActiveTab('eval');
    try {
      const models = [
        'openai/gpt-4o',
        'anthropic/claude-3.5-sonnet',
        'google/gemini-pro-1.5'
      ];
      const res = await runMultiModelEvalAction(promptText, models);
      setEvalResults(res);
    } catch (error: unknown) {
      alert("Evaluation failed: " + getErrorMessage(error));
    } finally {
      setIsEvaluating(false);
    }
  };

  return {
    promptText, setPromptText,
    metrics, setMetrics,
    evalResults,
    isAnalyzing, isImproving, isSaving, isEvaluating,
    activeTab, setActiveTab,
    searchQuery, setSearchQuery,
    savedPrompts,
    selectedPromptId,
    selectedPromptName,
    selectedVersionNumber,
    handleCreatePrompt,
    handleSelectPrompt,
    handleSave, handleAnalyze, handleImprove,
    handleMultiModelEval
  };
}
