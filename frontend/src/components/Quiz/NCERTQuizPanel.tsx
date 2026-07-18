import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

interface QuizState {
  quizTree: any;
  selectedClass: string;
  selectedChapter: string;
  selectedExercise: string;
  selectedQuestionIndex: number;
  currentQuestionRaw: string;
  feedback: string;
  showStuckMenu: boolean;
}

export const NCERTQuizPanel: React.FC = () => {
  const { user } = useAuth();
  const [state, setState] = useState<QuizState>({
    quizTree: {},
    selectedClass: '',
    selectedChapter: '',
    selectedExercise: '',
    selectedQuestionIndex: 0,
    currentQuestionRaw: '',
    feedback: '',
    showStuckMenu: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch quiz tree on mount
    fetch('http://localhost:8080/api/v1/quiz/structure')
      .then(r => r.json())
      .then(data => {
        setState(prev => {
          // Find first available path
          const classes = Object.keys(data).sort();
          const firstClass = classes[0] || '';
          
          const chaps = firstClass ? Object.keys(data[firstClass]).sort((a,b) => parseInt(a.replace('ch','')) - parseInt(b.replace('ch',''))) : [];
          const firstChap = chaps[0] || '';
          
          const exs = firstChap ? Object.keys(data[firstClass][firstChap]).sort() : [];
          const firstEx = exs[0] || '';
          
          const qs = firstEx ? data[firstClass][firstChap][firstEx] : [];
          return {
            ...prev,
            quizTree: data,
            selectedClass: firstClass,
            selectedChapter: firstChap,
            selectedExercise: firstEx,
            selectedQuestionIndex: 0,
            currentQuestionRaw: qs.length > 0 ? qs[0] : ''
          };
        });
      })
      .catch(console.error);
  }, []);

  const handleAction = async (action: string) => {
    if (!user) return;
    setIsLoading(true);
    
    // If asking for 'answer', we already have it parsed from the raw markdown
    if (action === 'answer') {
        const parts = state.currentQuestionRaw.split(/Answer:/i);
        if (parts.length > 1) {
            setState(prev => ({ ...prev, feedback: "**Answer:** " + parts[1].trim(), showStuckMenu: false }));
            setIsLoading(false);
            return;
        } else {
            // Some questions might not have an "Answer:" block, so we fall back to AI
            action = 'Solve this problem and show the final answer';
        }
    }

    try {
      const token = await user.getIdToken();
      
      const questionText = state.currentQuestionRaw.split(/Answer:/i)[0].trim();
      
      // We send the query to the standard /chat endpoint (which is a streaming endpoint)
      const response = await fetch(`http://localhost:8080/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
            query: `Action: ${action}\nQuestion: ${questionText}`, 
            session_id: 'quiz-' + Date.now() 
        })
      });
      
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // SSE parser
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";
      
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const dataStr = line.slice(6);
                if (dataStr.trim() === "[DONE]") continue;
                try {
                    const data = JSON.parse(dataStr);
                    if (data.type === 'message' || data.type === 'token') {
                        // The stream yields tokens
                        fullResponse += (data.content || "");
                        setState(prev => ({ ...prev, feedback: fullResponse, showStuckMenu: false }));
                    }
                } catch(e) {}
            }
        }
      }
      
    } catch (e) {
      console.error(e);
      setState(prev => ({ ...prev, feedback: "Failed to fetch response from AI." }));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format the keys (e.g. class_10 -> Class 10)
  const formatKey = (k: string) => {
      if (k.startsWith('class_')) return `Class ${k.split('_')[1]}`;
      if (k.startsWith('ch')) return `Chapter ${k.replace('ch', '')}`;
      if (k.startsWith('ex')) return `Exercise ${k.replace('ex', '')}`;
      return k;
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const c = e.target.value;
      const chaps = Object.keys(state.quizTree[c] || {}).sort((a,b) => parseInt(a.replace('ch','')) - parseInt(b.replace('ch','')));
      const firstChap = chaps[0] || '';
      const exs = firstChap ? Object.keys(state.quizTree[c][firstChap] || {}).sort() : [];
      const firstEx = exs[0] || '';
      const qs = firstEx ? state.quizTree[c][firstChap][firstEx] : [];
      setState(prev => ({ ...prev, selectedClass: c, selectedChapter: firstChap, selectedExercise: firstEx, selectedQuestionIndex: 0, currentQuestionRaw: qs.length > 0 ? qs[0] : '', feedback: '' }));
  };

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const ch = e.target.value;
      const exs = Object.keys(state.quizTree[state.selectedClass]?.[ch] || {}).sort();
      const firstEx = exs[0] || '';
      const qs = firstEx ? state.quizTree[state.selectedClass][ch][firstEx] : [];
      setState(prev => ({ ...prev, selectedChapter: ch, selectedExercise: firstEx, selectedQuestionIndex: 0, currentQuestionRaw: qs.length > 0 ? qs[0] : '', feedback: '' }));
  };

  const handleExerciseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const ex = e.target.value;
      const qs = state.quizTree[state.selectedClass]?.[state.selectedChapter]?.[ex] || [];
      setState(prev => ({ ...prev, selectedExercise: ex, selectedQuestionIndex: 0, currentQuestionRaw: qs.length > 0 ? qs[0] : '', feedback: '' }));
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const qIdx = parseInt(e.target.value);
      const qs = state.quizTree[state.selectedClass]?.[state.selectedChapter]?.[state.selectedExercise] || [];
      setState(prev => ({ ...prev, selectedQuestionIndex: qIdx, currentQuestionRaw: qs[qIdx] || '', feedback: '' }));
  };

  // Only show the question part (not the answer block)
  const displayQuestion = state.currentQuestionRaw.split(/Answer:/i)[0].trim();

  return (
    <div className="main-content" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%', overflowY: 'auto', height: '100vh', boxSizing: 'border-box' }}>
      <h2>📚 NCERT Practice</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Select a class, chapter, and exercise to practice NCERT questions.</p>
      
      {/* Selectors */}
      <div className="glass" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <select value={state.selectedClass} onChange={handleClassChange} className="btn btn-outline" style={{ flex: '1 1 150px', justifyContent: 'space-between' }}>
              {Object.keys(state.quizTree).sort().map(c => <option key={c} value={c}>{formatKey(c)}</option>)}
          </select>
          
          <select value={state.selectedChapter} onChange={handleChapterChange} className="btn btn-outline" style={{ flex: '1 1 150px', justifyContent: 'space-between' }}>
              {Object.keys(state.quizTree[state.selectedClass] || {}).sort((a,b) => parseInt(a.replace('ch','')) - parseInt(b.replace('ch',''))).map(ch => <option key={ch} value={ch}>{formatKey(ch)}</option>)}
          </select>
          
          <select value={state.selectedExercise} onChange={handleExerciseChange} className="btn btn-outline" style={{ flex: '1 1 150px', justifyContent: 'space-between' }}>
              {Object.keys(state.quizTree[state.selectedClass]?.[state.selectedChapter] || {}).sort().map(ex => <option key={ex} value={ex}>{formatKey(ex)}</option>)}
          </select>
          
          <select value={state.selectedQuestionIndex} onChange={handleQuestionChange} className="btn btn-outline" style={{ flex: '1 1 150px', justifyContent: 'space-between' }}>
              {(state.quizTree[state.selectedClass]?.[state.selectedChapter]?.[state.selectedExercise] || []).map((q: string, idx: number) => {
                  const qNumMatch = q.match(/Q\d+/);
                  const label = qNumMatch ? qNumMatch[0] : `Question ${idx + 1}`;
                  return <option key={idx} value={idx}>{label}</option>;
              })}
          </select>
      </div>
      
      <div className="glass" style={{ padding: '1.5rem', marginBottom: '1.5rem', minHeight: '150px' }}>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.5', margin: 0 }}>
          {displayQuestion ? <Latex>{displayQuestion}</Latex> : <i>Loading questions or none available...</i>}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button className="btn btn-outline" onClick={() => handleAction('give me a hint')} disabled={isLoading || !displayQuestion}>Give me a hint</button>
        <button className="btn btn-outline" onClick={() => handleAction('show first step')} disabled={isLoading || !displayQuestion}>Show first step</button>
        <button className="btn btn-outline" onClick={() => handleAction('answer')} disabled={isLoading || !displayQuestion}>Show answer</button>
        <button className="btn btn-primary" onClick={() => setState(prev => ({ ...prev, showStuckMenu: !prev.showStuckMenu }))} disabled={!displayQuestion}>Ask AI (Stuck?)</button>
      </div>

      {state.showStuckMenu && (
        <div className="glass animate-fade-in" style={{ padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
          <h4 style={{ marginBottom: '1rem' }}>I'm stuck because...</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button className="btn btn-outline" onClick={() => handleAction('explain the underlying concept')} style={{ justifyContent: 'flex-start' }}>I don't understand the underlying concept.</button>
            <button className="btn btn-outline" onClick={() => handleAction('show me a similar solved example')} style={{ justifyContent: 'flex-start' }}>Can you show me a similar solved example?</button>
            <button className="btn btn-outline" onClick={() => handleAction('simplify the wording of the question')} style={{ justifyContent: 'flex-start' }}>Can you simplify the wording of the question?</button>
            <button className="btn btn-outline" onClick={() => handleAction('break down the formula needed for this')} style={{ justifyContent: 'flex-start' }}>Break down the formula needed for this.</button>
          </div>
        </div>
      )}

      {state.feedback && (
        <div className="glass animate-fade-in" style={{ padding: '1.5rem', backgroundColor: 'hsla(var(--accent-primary), 0.1)', border: '1px solid hsla(var(--accent-primary), 0.2)', marginBottom: '3rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>AI Response</h4>
          <div style={{ lineHeight: '1.6' }}>
            <Latex>{state.feedback}</Latex>
          </div>
        </div>
      )}
    </div>
  );
};
