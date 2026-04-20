'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import styles from './Vault.module.css';
import { localHistory, LocalPrompt } from '@/utils/localHistory';

const SUGGESTION_CHIPS = [
  'What should I do next?',
  'I like AI & startups — suggest sessions',
  'I have 1 hour free, what\'s worth attending?',
  'Help me network with relevant people',
];

interface EvalData {
  model: string;
  actual_output: string;
  score: number | null;
  judgement_reason: string | null;
}

interface EvalResult {
  model: string;
  status: 'success' | 'error';
  data?: EvalData;
  error?: string;
}

export default function VaultClient() {
  const [prompts, setPrompts] = useState<LocalPrompt[]>([]);
  const [activePromptId, setActivePromptId] = useState<string | null>(null);
  const [draftContent, setDraftContent] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [evalResults, setEvalResults] = useState<EvalResult[]>([]);
  const [useGrounding, setUseGrounding] = useState(false);
  const [toxicity, setToxicity] = useState<number | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  useEffect(() => {
    const history = localHistory.getPrompts();
    setPrompts(history);
    if (history.length > 0) {
      setActivePromptId(history[0].id);
      setDraftContent(history[0].prompt_versions[0].content);
    }
  }, []);

  const handleSelectPrompt = useCallback((p: LocalPrompt) => {
    setActivePromptId(p.id);
    setDraftContent(p.prompt_versions[0].content);
    setEvalResults([]);
    setToxicity(null);
  }, []);

  const handleNew = () => {
    setActivePromptId(null);
    setDraftContent('');
    setEvalResults([]);
    setToxicity(null);
  };

  const handleSave = () => {
    if (!draftContent.trim()) return;
    const newPrompt = localHistory.savePrompt(draftContent, activePromptId);
    setPrompts(localHistory.getPrompts());
    setActivePromptId(newPrompt.id);
  };

  const handleChipClick = (chip: string) => {
    setDraftContent(chip);
  };

  const handleEvaluate = async () => {
    if (!draftContent.trim()) return;
    setIsEvaluating(true);
    setEvalResults([]);
    try {
      const res = await fetch('http://localhost:3001/api/evals/run-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: draftContent,
          models: ['gemini-1.5-pro-latest'],
          expected_output: 'A structured event itinerary with a timeline, session recommendations, and 2 actionable networking icebreakers.',
          useGrounding,
        }),
      });
      const data: EvalResult[] = await res.json();
      setEvalResults(data);
      if (activePromptId) {
        const score = data[0]?.data?.score ?? undefined;
        localHistory.savePrompt(draftContent, activePromptId, score, data[0]?.data);
        setPrompts(localHistory.getPrompts());
      }
    } catch (err) {
      console.error(err);
      alert('Failed to reach EventPilot backend. Make sure the proxy server is running on port 3001.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleImproveWithAI = async () => {
    if (!draftContent.trim()) return;
    setIsImproving(true);
    try {
      const res = await fetch('http://localhost:3001/api/evals/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: draftContent }),
      });
      const data = await res.json();
      if (data.improved_prompt) {
        setDraftContent(data.improved_prompt);
        const newPrompt = localHistory.savePrompt(data.improved_prompt, activePromptId);
        setPrompts(localHistory.getPrompts());
        setActivePromptId(newPrompt.id);
      }
    } catch (err) {
      console.error(err);
      alert('AI Query Refiner failed. Please try again.');
    } finally {
      setIsImproving(false);
    }
  };

  const handleSafetyAudit = async () => {
    if (!draftContent.trim()) return;
    setIsAuditing(true);
    setToxicity(null);
    try {
      const res = await fetch('http://localhost:3001/api/evals/safety', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: draftContent }),
      });
      const data = await res.json();
      setToxicity(data.toxicity as number);
    } catch (err) {
      console.error(err);
      alert('Safety audit failed. Ensure the proxy server is running.');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className={styles.vaultContainer}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        {/* Brand */}
        <div className={styles.sidebarBrand}>
          <div className={styles.sidebarBrandIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className={styles.sidebarBrandText}>
            EventPilot
            <span>Event Copilot</span>
          </div>
        </div>

        {/* New Plan */}
        <button className={`${styles.button} ${styles.primaryBtn}`} onClick={handleNew} style={{ width: '100%' }}>
          + New Plan
        </button>

        {/* History */}
        <div className={styles.sidebarSection}>Past Plans</div>
        {prompts.map(p => (
          <button
            key={p.id}
            className={styles.historyItem}
            onClick={() => handleSelectPrompt(p)}
            style={{
              borderColor: p.id === activePromptId ? '#a855f7' : 'transparent',
              background: p.id === activePromptId ? 'rgba(168, 85, 247, 0.12)' : undefined,
            }}
            aria-current={p.id === activePromptId ? 'true' : 'false'}
          >
            <h4>{p.name}</h4>
            <p>{new Date(p.updated_at).toLocaleDateString()}</p>
          </button>
        ))}
        {prompts.length === 0 && (
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', padding: '0 4px' }}>
            No saved plans yet.
          </p>
        )}

        {/* Divider + Nav Links */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Link href="/features" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>→ Features</Link>
          <Link href="/" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>→ Home</Link>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className={styles.mainArea}>

        {/* Input Panel */}
        <div className={styles.inputPanel}>
          <div className={styles.inputPanelHeader}>What do you want to do at this event?</div>

          {/* Suggestion Chips */}
          <div className={styles.chips}>
            {SUGGESTION_CHIPS.map(chip => (
              <button key={chip} className={styles.chip} onClick={() => handleChipClick(chip)} type="button">
                {chip}
              </button>
            ))}
          </div>

          <textarea
            className={styles.textarea}
            value={draftContent}
            onChange={e => setDraftContent(e.target.value)}
            placeholder="e.g. I have 1 hour free and I'm interested in AI and climate tech — what's worth attending?"
            aria-label="Event Query Input"
            rows={3}
          />

          {/* Toolbar */}
          <div className={styles.toolbarRow}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={useGrounding}
                onChange={e => setUseGrounding(e.target.checked)}
                style={{ accentColor: '#a855f7' }}
              />
              🔍 Ground with Google Search
            </label>

            <button
              className={styles.button}
              onClick={handleSafetyAudit}
              disabled={isAuditing || !draftContent}
              type="button"
            >
              {isAuditing ? 'Auditing…' : '🛡️ Safety Audit'}
            </button>

            {toxicity !== null && (
              <span className={`${styles.toxicityBadge} ${toxicity > 50 ? styles.danger : styles.safe}`}>
                Toxicity: {toxicity}%
              </span>
            )}

            <div className={styles.spacer} />

            <button
              className={styles.button}
              onClick={handleSave}
              disabled={!draftContent}
              type="button"
            >
              Save
            </button>

            <button
              className={`${styles.button} ${styles.aiBtn}`}
              onClick={handleImproveWithAI}
              disabled={isImproving || !draftContent}
              aria-label="Refine query with AI"
              type="button"
            >
              {isImproving ? 'Refining…' : '✨ Refine Query'}
            </button>

            <button
              className={`${styles.button} ${styles.primaryBtn}`}
              onClick={handleEvaluate}
              disabled={isEvaluating || !draftContent}
              aria-label="Generate event plan"
              type="button"
            >
              {isEvaluating ? 'Generating…' : '🗺️ Generate Event Plan'}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className={styles.outputPanel}>
          <div className={styles.outputHeader}>
            <h2>Your Personal Itinerary</h2>
            {evalResults.length > 0 && (
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                Powered by Gemini 1.5 Pro
              </span>
            )}
          </div>

          <div className={styles.outputBody}>
            {evalResults.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <p>
                  Pick a suggestion above or describe what you want to do — then hit&nbsp;
                  <strong style={{ color: '#c084fc' }}>Generate Event Plan</strong>&nbsp;
                  to get your personalized itinerary with sessions, timing, and networking icebreakers.
                </p>
              </div>
            ) : (
              evalResults.map((res, i) => (
                <div key={i} className={styles.itineraryCard}>
                  <div className={styles.itineraryCardHeader}>
                    <h3>AI-Generated Itinerary</h3>
                    {res.status === 'success' && res.data?.score !== null && (
                      <span className={`${styles.ratingBadge} ${(res.data?.score ?? 0) >= 4 ? styles.ratingGood : styles.ratingBad}`}>
                        Completeness: {res.data?.score}/5
                      </span>
                    )}
                  </div>

                  {res.status === 'success' ? (
                    <>
                      <pre className={styles.itineraryOutput}>{res.data?.actual_output}</pre>
                      {res.data?.judgement_reason && (
                        <p className={styles.itineraryReason}>
                          AI judge: {res.data.judgement_reason}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className={styles.errorCard}>
                      ⚠ Generation failed: {res.error}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
