import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

/**
 * WUMPUS_ORIGIN | Tactical Logic Agent
 * Core: Propositional Logic KB + BFS Backtracking + Exception Handling
 */

const App = () => {
  const [gridSize, setGridSize] = useState(4);
  const [grid, setGrid] = useState([]);
  const [agentPos, setAgentPos] = useState({ r: 0, c: 0 });
  const [percepts, setPercepts] = useState([]);
  const [kb, setKb] = useState([]);
  const [inferenceCount, setInferenceCount] = useState(0);
  const [gameState, setGameState] = useState('active'); // active, secured, terminated, trapped
  const [logs, setLogs] = useState([]);
  const [autoMode, setAutoMode] = useState(false);
  const [systemMessage, setSystemMessage] = useState(null); 
  
  const autoModeRef = useRef(autoMode);
  autoModeRef.current = autoMode;

  const getNeighbors = (r, c, size) => {
    return [[r-1, c], [r+1, c], [r, c-1], [r, c+1]]
      .filter(([nr, nc]) => nr >= 0 && nr < size && nc >= 0 && nc < size);
  };

  const addLog = (msg) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 15)]);

  const triggerEvent = (type, word, detail = '') => {
    setSystemMessage({ type, word, detail });
    if (type === 'info') {
      setTimeout(() => setSystemMessage(null), 2500); 
    }
  };

  const initSim = useCallback((size) => {
    try {
      setGameState('active');
      setInferenceCount(0);
      setKb([]);
      setAutoMode(false);
      setSystemMessage(null);
      
      // Professional Lab Boot Sequence Logs
      setLogs([
        '>> INFERENCE_ENGINE_V4_LINKED',
        '>> KNOWLEDGE_BASE ALLOCATED',
        '>> AUTH_GRANTED: U.A. SHAHID'
      ]);
      
      let newGrid = Array(size).fill().map(() => Array(size).fill().map(() => ({
        W: false, P: false, G: false, V: false, B: false, S: false
      })));

      const place = (key) => {
        let r, c;
        let attempts = 0;
        do { 
          r = Math.floor(Math.random() * size); 
          c = Math.floor(Math.random() * size); 
          attempts++;
          if (attempts > 100) throw new Error("Grid generation timeout.");
        } while ((r === 0 && c === 0) || newGrid[r][c][key]);
        newGrid[r][c][key] = true;
      };

      place('W'); place('G');
      for (let i = 0; i < Math.floor(size * 0.4); i++) place('P');

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          getNeighbors(r, c, size).forEach(([nr, nc]) => {
            if (newGrid[nr][nc].W) newGrid[r][c].S = true;
            if (newGrid[nr][nc].P) newGrid[r][c].B = true;
          });
        }
      }

      newGrid[0][0].V = true;
      setGrid(newGrid);
      setAgentPos({ r: 0, c: 0 });
      processCell(0, 0, newGrid, []);
      
      // The "MIT/Harvard" Level Startup Trigger
      triggerEvent('info', 'INITIALIZED', 'Formal Logic Core Calibrated and Ready.');

    } catch (error) {
      triggerEvent('error', 'FAULT', error.message);
      setGameState('terminated');
    }
  }, []);

  useEffect(() => { initSim(gridSize); }, [gridSize, initSim]);

  const processCell = (r, c, currentGrid, currentKb) => {
    const cell = currentGrid[r][c];
    const p = [];
    if (cell.S) p.push('STENCH');
    if (cell.B) p.push('BREEZE');
    if (cell.G) p.push('GLITTER');
    setPercepts(p);

    let newClauses = [...currentKb, `¬P${r}${c}`, `¬W${r}${c}`];
    const neighbors = getNeighbors(r, c, gridSize);
    
    if (!cell.B) neighbors.forEach(([nr, nc]) => newClauses.push(`¬P${nr}${nc}`));
    if (!cell.S) neighbors.forEach(([nr, nc]) => newClauses.push(`¬W${nr}${nc}`));

    const updatedKb = [...new Set(newClauses)];
    setKb(updatedKb);
    return updatedKb;
  };

  const getIntelligentNextStep = (startR, startC, currentKb) => {
    const queue = [{ r: startR, c: startC, path: [] }];
    const seen = new Set([`${startR},${startC}`]);

    while (queue.length > 0) {
      const { r, c, path } = queue.shift();
      const currentPath = [...path, { r, c }];

      if (!grid[r][c].V && currentKb.includes(`¬P${r}${c}`) && currentKb.includes(`¬W${r}${c}`)) {
        return currentPath[1]; 
      }

      for (const [nr, nc] of getNeighbors(r, c, gridSize)) {
        const key = `${nr},${nc}`;
        if (!seen.has(key)) {
          const isVisited = grid[nr][nc].V;
          const isSafeUnvisited = currentKb.includes(`¬P${nr}${nc}`) && currentKb.includes(`¬W${nr}${nc}`);
          
          if (isVisited || isSafeUnvisited) {
            seen.add(key);
            queue.push({ r: nr, c: nc, path: currentPath });
          }
        }
      }
    }
    return null; 
  };

  const runAutoSolve = async () => {
    if (gameState !== 'active' || !autoModeRef.current) return;

    try {
      setInferenceCount(prev => prev + 1);
      const nextMove = getIntelligentNextStep(agentPos.r, agentPos.c, kb);

      if (nextMove) {
        setTimeout(() => moveAgent(nextMove.r, nextMove.c), 600);
      } else {
        addLog("EXCEPTION: NO MATHEMATICALLY SAFE PATHS REMAIN.");
        setGameState('trapped');
        setAutoMode(false);
        triggerEvent('warning', 'TRAPPED', 'Insufficient logic data to proceed safely.');
      }
    } catch (error) {
      addLog(`FATAL ENGINE ERROR: ${error.message}`);
      setGameState('terminated');
      setAutoMode(false);
      triggerEvent('error', 'FAULT', 'Inference Engine Crashed.');
    }
  };

  useEffect(() => {
    if (autoMode) runAutoSolve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoMode, agentPos]);

  const moveAgent = (r, c) => {
    if (gameState !== 'active') return;
    
    const newGrid = [...grid];
    newGrid[r][c].V = true;
    
    let nextState = 'active';
    if (newGrid[r][c].W) {
      nextState = 'terminated';
      triggerEvent('error', 'TERMINATED', 'Agent consumed by Wumpus.');
      addLog("CRITICAL: EATEN BY WUMPUS");
    } else if (newGrid[r][c].P) {
      nextState = 'terminated';
      triggerEvent('error', 'CRUSHED', 'Agent fell into a pit.');
      addLog("CRITICAL: FELL IN PIT");
    } else if (newGrid[r][c].G) {
      nextState = 'secured';
      triggerEvent('success', 'VICTORY', 'Target asset secured.');
      addLog("SUCCESS: GOLD SECURED");
    }

    setGrid(newGrid);
    setAgentPos({ r, c });
    setGameState(nextState);

    if (nextState === 'active') {
      processCell(r, c, newGrid, kb);
    } else {
      setAutoMode(false);
    }
  };

  return (
    <div className="research-hud">
      {systemMessage && (
        <div className={`event-overlay ${systemMessage.type}`}>
          <div className="event-content">
            <div className="event-scanner"></div>
            <h1 className="one-word-title">{systemMessage.word}</h1>
            <p className="event-detail">{systemMessage.detail}</p>
            {gameState !== 'active' && <button className="reboot-btn-large" onClick={() => initSim(gridSize)}>REBOOT SYSTEM</button>}
          </div>
        </div>
      )}

      <div className={`status-display ${gameState}`}>
        <label className="status-label">MISSION_STATUS</label>
        <div className="status-text">{gameState.toUpperCase()}</div>
      </div>

      <header className="main-header">
        <div className="iconic-title">WUMPUS<span>ORIGIN</span></div>
        <div className="system-path">NODE://FAST_NUCES_FSD/CS_SEM_4</div>
      </header>

      <main className="layout">
        <aside className="hud-panel side-left">
          <div className="data-card">
            <h3 className="card-header">AGENT_TELEMETRY</h3>
            <div className="telemetry-row">
              <div className="t-stat"><label>INFERENCE</label><div className="t-val">{inferenceCount}</div></div>
              <div className="t-stat"><label>POSITION</label><div className="t-val">[{agentPos.r},{agentPos.c}]</div></div>
            </div>
          </div>

          <div className="data-card">
            <h3 className="card-header">LIVE_SENSORS</h3>
            <div className="sensor-box">
              {percepts.length > 0 ? percepts.map(p => (
                <div key={p} className={`pill ${p.toLowerCase()}`}>{p}</div>
              )) : <span className="dim">NO_SIGNALS</span>}
            </div>
          </div>

          <div className="data-card config">
            <h3 className="card-header">CORE_CONTROLS</h3>
            <div className="control-item">
              <label>GRID_RESOLUTION: {gridSize}x{gridSize}</label>
              <input type="range" min="4" max="8" value={gridSize} onChange={e => setGridSize(Number(e.target.value))} disabled={autoMode} />
            </div>
            <button className={`neon-btn ${autoMode ? 'warning' : 'primary'}`} onClick={() => setAutoMode(!autoMode)} disabled={gameState !== 'active'}>
              {autoMode ? 'HALT_AUTO_SOLVE' : 'EXECUTE_AUTO_SOLVE'}
            </button>
            <button className="neon-btn" onClick={() => initSim(gridSize)}>REBOOT_SIM</button>
          </div>
        </aside>

        <section className="map-view">
          <div className="grid-layer" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
            {grid.map((row, r) => row.map((cell, c) => {
              const isAgent = r === agentPos.r && c === agentPos.c;
              const isSafe = kb.includes(`¬P${r}${c}`) && kb.includes(`¬W${r}${c}`);
              return (
                <div key={`${r}-${c}`} className={`cell ${cell.V ? 'visited' : 'fog'} ${isAgent ? 'active' : ''} ${isSafe && !cell.V ? 'safe-zone' : ''}`} onClick={() => !autoMode && moveAgent(r, c)}>
                  <div className="cell-id">{r}{c}</div>
                  <div className="content">
                    {isAgent ? <span className="agent-ico">🕵️‍♂️</span> : 
                     cell.V ? (
                       <span className="entity">
                         {cell.W && '👹'}
                         {cell.P && '🕳️'}
                         {cell.G && '💰'}
                       </span>
                     ) : <span className="fog-ico">·</span>}
                  </div>
                  {cell.V && (
                    <div className="indicators">
                      {cell.S && <span className="icon-n">👃</span>}
                      {cell.B && <span className="icon-b">💨</span>}
                    </div>
                  )}
                </div>
              );
            }))}
          </div>
        </section>

        <aside className="hud-panel side-right">
          <h3 className="card-header">KB_STREAM</h3>
          <div className="console-stream kb-feed">
            {kb.slice(-10).reverse().map((clause, i) => <div key={i} className="log-line">» TELL: {clause}</div>)}
          </div>
          <h3 className="card-header" style={{marginTop: '15px'}}>CONSOLE_LOG</h3>
          <div className="console-stream">
            {logs.map((log, i) => <div key={i} className="log-line">{log}</div>)}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;