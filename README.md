# 🕵️‍♂️ WUMPUS ORIGIN | Tactical Logic Agent

![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)
![AI Logic](https://img.shields.io/badge/AI-Propositional_Logic-00F7FF?style=for-the-badge)

**Wumpus Origin** is a production-grade, autonomous Knowledge-Based Agent (KBA) built to navigate a dynamic, hazardous grid environment. Instead of relying on simple heuristics, this agent uses pure formal Propositional Logic, Conjunctive Normal Form (CNF) conversion, and an automated Resolution Refutation engine to mathematically prove the safety of its path.

### 🔗 Live Links
- **Live Deployment:** [Insert your Vercel link here, e.g., https://wumpus-origin.vercel.app]
- **Video Demonstration:** [Insert your LinkedIn Post link here]

---

## 🧠 Core AI Architecture

### 1. The Inference Engine (Resolution Refutation)
The agent maintains a dynamic **Propositional Logic Knowledge Base (KB)**. When the agent receives percepts (e.g., a *Breeze* or *Stench*), it converts these environmental cues into CNF clauses and `TELL`s the KB. 
Before executing a forward move, the agent `ASK`s the KB if an adjacent cell is safe. It does this by attempting to find a contradiction—mathematically proving the existence of both `¬P_{x,y}` (Not Pit) and `¬W_{x,y}` (Not Wumpus) for the target cell.

### 2. Intelligent BFS Backtracking
To prevent infinite loops and random walks, the agent features a Breadth-First Search (BFS) pathfinding algorithm. If the Resolution Engine determines that all immediate forward paths carry a hazard probability > 0% (a logical dead-end), the BFS algorithm engages. It scans the agent's memory for the nearest unvisited cell that is *proven safe*, and safely backtracks through previously visited nodes to reach it.

### 3. Graceful Exception Handling
If the grid generates an impossible scenario where the target asset is completely walled off by unproven or hazardous tiles, the engine catches the logical paradox. Rather than crashing or entering an infinite loop, the system safely halts, enters an amber alert state, and declares the agent **TRAPPED**.

---

## 💻 Technical Features

- **Dynamic Environment:** Support for runtime grid resizing (4x4 to 8x8) and randomized hazard placement (Wumpus, Pits, Gold) with a 40% hazard spawn probability.
- **Zero-Scroll Tactical HUD:** A highly responsive, fixed-height interface utilizing CSS Grid/Flexbox. Designed with a 'Glass-Terminal' aesthetic (Deep Obsidian `#050506` and Electric Cyan `#00f7ff`).
- **One-Word Event Modals:** High-visibility, motion-blurred overlay modals that provide immediate feedback on critical simulation events (`ONLINE`, `VICTORY`, `TERMINATED`, `TRAPPED`).
- **Real-Time Telemetry:** Live dashboards displaying current coordinates, active sensory inputs, total Inference Steps, and a streaming log of the KB clauses.

---

## 🚀 Run Locally

To run this simulation on your local machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/wumpus-origin.git](https://github.com/your-username/wumpus-origin.git)
   cd wumpus-origin
