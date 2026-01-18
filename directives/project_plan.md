# Project Plan: StarCraft 2 Analytics Site

> **Status**: Active
> **Phase**: Initialization / Planning

## 1. Project Goal
Build a static web application hosted on GitHub Pages that provides data analytics for StarCraft 2 tournaments. The site should offer visualizations and insights into player performance, map statistics, and tournament trends.

## 2. Technical Stack
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: GitHub Pages
- **Data Source**: Liquipedia (via API/Webhooks/Docs)

## 3. Architecture & Data Strategy
- **Data Ingestion**: Using Liquipedia API (see `docs/` for reference).
- **Processing**: Pre-process data into static JSON files or fetch live depending on API limits.
- **Visualizations**: Use charting libraries (recharts, chart.js, or similar) to display stats.

## 4. Current Objectives
- [x] Initialize Project (Vite + React + TS)
- [x] Configure Tailwind CSS
- [x] Establish "Agent Persistence" Workflow
- [x] Implement Data Fetching/Mocking
- [ ] Build Basic UI Components (Current Task)
- [ ] Deploy to GitHub Pages

## 5. Agent Workflow Directives
- **Read this file first**. This is the source of truth.
- **Update this file** when completing major milestones.
- **Check `docs/`** for API documentation before asking about data sources.
