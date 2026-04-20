'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import styles from './Vault.module.css';
import { localHistory, LocalPrompt } from '@/utils/localHistory';

export default function VaultClient() {
  const [prompts, setPrompts] = useState<LocalPrompt[]>([]);
  const [activePromptId, setActivePromptId] = useState<string | null>(null);
  const [draftContent, setDraftContent] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [evalResults, setEvalResults] = useState<any[]>([]);

  useEffect(() => {
    // Load from local storage
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
  }, []);

  const handleNew = () => {
    setActivePromptId(null);
    setDraftContent('');
    setEvalResults([]);
  };

  const handleSave = () => {
    if (!draftContent.trim()) return;
    const newPrompt = localHistory.savePrompt(draftContent, activePromptId);
    setPrompts(localHistory.getPrompts());
    setActivePromptId(newPrompt.id);
  };

  const handleEvaluate = async () => {
    if (!draftContent.trim()) return;
    setIsEvaluating(true);
    setEvalResults([]);
    try {
      // Connect to the local unproxied backend port 3001
      const res = await fetch('http://localhost:3001/api/evals/run-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: draftContent,
          models: ['gemini-1.5-pro-latest'], // Hardcoded to test
          expected_output: "A well-structured output adhering to instructions."
        })
      });
      const data = await res.json();
      setEvalResults(data);
      if (activePromptId) {
        // Save evaluation to history
        const score = data[0]?.data?.score || null;
        localHistory.savePrompt(draftContent, activePromptId, score, data[0]?.data);
        setPrompts(localHistory.getPrompts());
      }
    } catch (err) {
      console.error(err);
      alert('Failed to evaluate prompt. Make sure the proxy server is running.');
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
        body: JSON.stringify({ content: draftContent })
      });
      const data = await res.json();
      if (data.improved_prompt) {
        setDraftContent(data.improved_prompt);
        // Automatically save the improved version
        const newPrompt = localHistory.savePrompt(data.improved_prompt, activePromptId);
        setPrompts(localHistory.getPrompts());
        setActivePromptId(newPrompt.id);
        alert('Prompt logic improved by AI! See changes in the editor.');
      }
    } catch (err) {
      console.error(err);
      alert('Master Prompt Engineer failed. Please try again.');
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className={styles.vaultContainer}>
      <aside className={styles.sidebar}>
        <button className={`${styles.button} ${styles.primaryBtn}`} onClick={handleNew}>+ New Draft</button>
        <h3>Local History</h3>
        {prompts.map(p => (
          <button 
            key={p.id} 
            className={styles.historyItem}
            onClick={() => handleSelectPrompt(p)}
            style={{ 
              borderColor: p.id === activePromptId ? '#a855f7' : 'transparent', 
              borderWidth: '1px', 
              borderStyle: 'solid',
              textAlign: 'left',
              width: '100%',
              display: 'block',
              background: p.id === activePromptId ? 'rgba(168, 85, 247, 0.1)' : 'transparent'
            }}
            aria-current={p.id === activePromptId ? 'true' : 'false'}
          >
            <h4>{p.name}</h4>
            <p>{new Date(p.updated_at).toLocaleDateString()}</p>
          </button>
        ))}
        {prompts.length === 0 && <p style={{opacity: 0.5, fontSize: '0.8rem'}}>No saved prompts.</p>}
      </aside>

      <div className={styles.mainArea}>
        <div className={styles.editorSection}>
          <h2 style={{marginTop: 0, marginBottom: '15px'}}>Prompt Editor</h2>
          <textarea 
            className={styles.textarea}
            value={draftContent}
            onChange={e => setDraftContent(e.target.value)}
            placeholder="Write your prompt instruction here..."
            aria-label="Prompt Draft Input"
          />
          <div className={styles.actionRow}>
            <button className={styles.button} onClick={handleSave}>Save Locally</button>
            <button 
              className={`${styles.button} ${styles.aiBtn}`} 
              onClick={handleImproveWithAI}
              disabled={isImproving || !draftContent}
              aria-label="Improve Prompt with Master Prompt Engineer AI"
            >
              {isImproving ? 'Optimizing...' : '✨ Improve with AI'}
            </button>
            <button 
              className={`${styles.button} ${styles.primaryBtn}`} 
              onClick={handleEvaluate}
              disabled={isEvaluating || !draftContent}
              aria-label="Run Multi-Model Evaluation"
            >
              {isEvaluating ? 'Evaluating...' : 'Run Evaluation (Gemini)'}
            </button>
          </div>
        </div>

        <div className={styles.resultsSection}>
          <h2 style={{marginTop: 0, marginBottom: '15px'}}>Evaluation Results</h2>
          {evalResults.length === 0 && <p style={{opacity: 0.5}}>Run an evaluation to benchmark your prompt.</p>}
          
          {evalResults.map((res: any, i: number) => (
            <div key={i} className={styles.evalCard}>
              <h3>Model: {res.model}</h3>
              {res.status === 'success' ? (
                <>
                  <div className={`${styles.score} ${res.data.score < 4 ? styles.badScore : ''}`}>
                    Judge Score: {res.data.score}/5
                  </div>
                  <div className={styles.reasoning}>Why: {res.data.judgement_reason}</div>
                  <div style={{marginTop: '15px', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '4px'}}>
                    <strong>Output:</strong>
                    <pre style={{whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0}}>{res.data.actual_output}</pre>
                  </div>
                </>
              ) : (
                <div className={styles.badScore}>Evaluation Error: {res.error}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
