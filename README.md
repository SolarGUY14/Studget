# Studget

Studget is an AI-powered personal-finance platform, initially focused on helping college students understand their spending, budget flexibly, and make informed decisions about what they can safely spend.

This repository currently contains the Milestone M0 foundation: a minimal FastAPI service, project documentation, and placeholders for future mobile and infrastructure work.

## Repository layout

```text
apps/mobile/       Future React Native / Expo application
services/api/      FastAPI backend service
infrastructure/    Future deployment infrastructure
docs/              Product, architecture, and security documentation
```

## API development

The API requires Python 3.12 or newer.

```bash
cd services/api
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -e '.[dev]'
uvicorn app.main:app --reload
```

The health endpoint is available at `GET /health`.

Run tests from `services/api`:

```bash
python -m pytest
```

## Current scope

M0 intentionally excludes the mobile implementation, databases, financial integrations, authentication, AI features, budgeting logic, and deployment infrastructure.
