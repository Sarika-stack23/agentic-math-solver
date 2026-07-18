import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import * as math from 'mathjs';

export const GraphPanel: React.FC = () => {
  const [expression, setExpression] = useState('sin(x)');
  const [inputVal, setInputVal] = useState('sin(x)');
  const [error, setError] = useState('');
  const [domain] = useState({ min: -10, max: 10 });

  const data = useMemo(() => {
    try {
      const compiled = math.compile(expression);
      const points = [];
      const step = (domain.max - domain.min) / 100;

      for (let x = domain.min; x <= domain.max; x += step) {
        try {
          const y = compiled.evaluate({ x });
          if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
            // Cap extreme values to prevent recharts from crashing or zooming out too much
            const cappedY = Math.max(-50, Math.min(50, y));
            points.push({ x: Number(x.toFixed(2)), y: Number(cappedY.toFixed(2)) });
          }
        } catch (e) {
          // Skip invalid points for this x
        }
      }
      setError('');
      return points;
    } catch (e: any) {
      setError(e.message || 'Invalid mathematical expression');
      return [];
    }
  }, [expression, domain]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setExpression(inputVal);
  };

  return (
    <div className="main-content" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>📈 Interactive Graphing</h2>
      
      <div className="glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold' }}>f(x) = </label>
          <input 
            type="text" 
            className="input" 
            style={{ flex: 1 }}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="e.g. x^2 + 2x - 1, sin(x), log(x)"
          />
          <button type="submit" className="btn btn-primary">Plot</button>
        </form>
        {error && <p style={{ color: '#ef4444', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error}</p>}
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Try entering expressions using `x` as the variable. Examples: `x^3 - x`, `cos(x) * 2`, `sqrt(x)`.
        </p>
      </div>

      <div className="glass" style={{ flex: 1, padding: '1rem', minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                  dataKey="x" 
                  type="number" 
                  domain={['dataMin', 'dataMax']} 
                  stroke="var(--text-secondary)" 
                  tickFormatter={(val) => val.toFixed(1)}
              />
              <YAxis 
                  stroke="var(--text-secondary)" 
                  domain={['auto', 'auto']}
              />
              <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }}
                  labelFormatter={(val) => `x = ${val}`}
                  formatter={(val: any) => [`y = ${val}`, '']}
              />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" />
              <ReferenceLine x={0} stroke="rgba(255,255,255,0.3)" />
              <Line 
                  type="monotone" 
                  dataKey="y" 
                  stroke="hsl(var(--accent-primary))" 
                  strokeWidth={3} 
                  dot={false}
                  isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>No data to display. Please check your expression.</p>
        )}
      </div>
    </div>
  );
};
