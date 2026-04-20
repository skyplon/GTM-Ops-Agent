# OpsAgent — GTM Planning Automation

AI-powered GTM planning automation tool for Sales Operations — pulls pipeline data, analyzes deals at risk, and generates a structured Weekly GTM Plan with executive summaries, priority deal tracking, and campaign recommendations.

---

## Live Demo

**[https://ops-agent.yourusername.replit.app](https://ops-agent.yourusername.replit.app)**

> Replace the link above with your published Replit app URL.

---

## What It Does

Sales Operations teams spend days assembling data for weekly GTM planning meetings. OpsAgent simulates an AI agent that does this work in seconds:

1. Select a planning week and data sources (Pipeline Report, Campaign Performance, Account Activity Log, Forecast vs Actuals)
2. Click **Run Weekly GTM Plan** — watch the agent reason through 6 analysis steps in real time
3. Review the generated plan: executive summary, top 5 priority deals with risk ratings, campaign adjustments, and a prioritized action list

---

## Features

- **Agent Control Panel** — week selector, configurable data sources, animated run/idle/complete status
- **Reasoning Steps** — 6-step animated trace showing what the agent is analyzing
- **Executive Summary** — 3-point narrative summary of pipeline health and risks
- **Priority Deals Table** — top 5 deals ranked by risk with owner and next action
- **Campaign Adjustments** — recommended budget and creative changes per channel
- **Actions for This Week** — prioritized task list with owners and due dates
- **Export / Share** — Export Plan, Send to Team, and Schedule Next Run actions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Framer Motion |
| Backend | Express 5, TypeScript |
| Validation | Zod (request + response schemas) |
| API Contract | OpenAPI 3.1 + Orval codegen |
| Monorepo | pnpm workspaces |

---

## Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v9+

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/ops-agent.git
cd ops-agent

# Install dependencies
pnpm install

# Start the API server
pnpm --filter @workspace/api-server run dev

# In a separate terminal, start the frontend
pnpm --filter @workspace/ops-agent run dev
```

The frontend will be available at `http://localhost:5173` and the API server at `http://localhost:3000`.

### Running Both Together

If you have a process manager or use the Replit workspace, both services start automatically via the configured workflows.

---

## Project Structure

```
.
├── artifacts/
│   ├── ops-agent/          # React + Vite frontend
│   └── api-server/         # Express API server
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   └── api-zod/            # Generated Zod schemas
```

---

## License

MIT
