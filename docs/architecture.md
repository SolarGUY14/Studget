# Architecture

## Planned system

```text
React Native / Expo (iOS, Android, web)
        |
        v
FastAPI
        |
        v
PostgreSQL
```

Studget should begin as a modular monolith. Clear internal module boundaries will support maintainability without the operational cost and complexity of prematurely adopting microservices.

The React Native / Expo client communicates with the FastAPI backend. The backend will own business rules, authorization, integrations, and access to PostgreSQL. M1 provides the universal client and health API; PostgreSQL is planned, not installed.

## M1 boundaries

`apps/mobile` retains its original path but serves all three platforms. Expo Router's `app` directory contains routes and layouts only. Screen components and the typed HTTP client live under `src`; tests live outside the route directory. React Native's wrapping layout adapts the same dashboard to narrow phones and wide browsers.

The screen asks the API client for health, and the client validates the response at runtime with a five-second timeout. The screen renders loading, connected, or error states and supports retry. There is no financial data or calculation in M1. Financial cards use an em dash rather than fabricated balances.

Browser requests cross origins during development, so FastAPI allows only configured web origins through CORS. CORS is a browser policy, not user authorization; authentication and per-user access control remain future requirements.

Node 24 and a committed npm lockfile establish the client toolchain. See [development.md](development.md) for request flow, local configuration, tests, and manual checks.

## Future integrations and infrastructure

- Plaid for connected financial accounts and transaction ingestion
- OpenAI for grounded financial explanations and copilot experiences
- Background workers for asynchronous processing
- Job and queue infrastructure
- Cloud deployment
- Observability for logs, metrics, traces, and alerting
