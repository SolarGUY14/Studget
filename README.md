# Studget

Studget is an AI-powered personal-finance platform, initially focused on helping college students understand their spending, budget flexibly, and make informed decisions about what they can safely spend.

This repository contains the M1 foundation: a universal Expo dashboard for iOS, Android, and web connected to a minimal FastAPI service. Financial cards are empty placeholders; the service connection is live.

## Repository layout

```text
apps/mobile/       Universal React Native / Expo application (including web)
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

M1 includes a responsive dashboard, typed health client, loading/error/retry states, and automated tests. Databases, authentication, financial integrations, AI, budgeting calculations, and deployment remain future milestones.

## Run the web or mobile application

Use Node 24 LTS (`nvm use` if you use nvm), then:

```bash
cd apps/mobile
npm ci
npm run web
```

Keep the API running in a second terminal using the API commands above. Open `http://localhost:8081`; the dashboard should say **Connected to Studget**. Stop the API and click **Check again** to exercise the failure and retry flow.

For mobile, use `npm start` and scan the QR code with an Expo Go version compatible with the project's SDK, or use `npm run ios` / `npm run android` with the relevant simulator installed. See [the development guide](docs/development.md) for phone networking, environment setup, and acceptance checks.

## Client checks

From `apps/mobile`:

```bash
npm run check
npm run build:web
```

`check` runs TypeScript, ESLint, Prettier, and Jest. Use `npm run format` to format client files. The committed npm lockfile makes client installations repeatable.

Read [the application flow](docs/development.md#how-a-request-flows) to follow a screen through the API and back. Each future feature should include tests of its behavior and a documented manual walkthrough.
