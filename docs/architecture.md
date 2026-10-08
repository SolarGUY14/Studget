# Architecture

## Planned system

```text
React Native / Expo
        |
        v
FastAPI
        |
        v
PostgreSQL
```

Studget should begin as a modular monolith. Clear internal module boundaries will support maintainability without the operational cost and complexity of prematurely adopting microservices.

The React Native / Expo client will communicate with the FastAPI backend. The backend will own business rules, authorization, integrations, and access to PostgreSQL. Only the minimal FastAPI foundation exists in M0; the mobile application and database are not yet initialized.

## Future integrations and infrastructure

- Plaid for connected financial accounts and transaction ingestion
- OpenAI for grounded financial explanations and copilot experiences
- Background workers for asynchronous processing
- Job and queue infrastructure
- Cloud deployment
- Observability for logs, metrics, traces, and alerting
