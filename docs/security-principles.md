# Security Principles

- Financial information is sensitive data.
- Never expose Plaid secrets to a mobile client.
- Never expose Plaid access tokens to a mobile client.
- Never expose OpenAI API keys to a mobile client.
- Never include raw Plaid access tokens in LLM prompts.
- Minimize financial information sent to an LLM.
- Enforce strict per-user authorization.
- Encrypt sensitive credentials where appropriate.
- Store secrets through environment and configuration systems.
- Never commit `.env` files.
- Design for account and data deletion.
- Do not log secrets or sensitive financial credentials.
- Ground AI-generated financial explanations in trusted backend calculations; do not let the model invent financial values.

These are engineering principles for future development, not a claim that Studget currently satisfies any compliance framework, regulation, or security certification.
