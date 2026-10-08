# Developing Studget

## How a request flows

1. Expo Router loads `apps/mobile/app/_layout.tsx` for the navigation shell and `app/index.tsx` for the home route.
2. The route renders `src/screens/DashboardScreen.tsx`. The screen initially shows a loading state and calls `getHealth()` on mount.
3. `src/api/client.ts` reads `EXPO_PUBLIC_API_URL` (default `http://localhost:8000`) and fetches `/health`. It checks the HTTP status and JSON shape, and aborts after five seconds.
4. FastAPI's CORS middleware checks browser origins. The `/health` function in `services/api/app/main.py` returns `{"status":"healthy"}`.
5. The promise resolves or rejects. The screen shows connected or error state; retry starts a new request. Late results after unmount are ignored.

The route selects the screen, the screen owns presentation state, the API client handles HTTP, and FastAPI owns server behavior. Future financial calculations belong in backend domain services. Health currently means the API process responds, not that any financial integration is ready.

## Local configuration

Use Python 3.12+ and Node 24 LTS. The root `.nvmrc` supports `nvm use`. Install client dependencies with `npm ci` in `apps/mobile`; Python dependencies stay inside `services/api/.venv`.

The root `.env.example` documents backend configuration. It is not automatically loaded. `APP_ENV`, `API_HOST`, and `API_PORT` are reserved placeholders; set host and port using the uvicorn flags below. `CORS_ORIGINS` is read from the process environment at API startup. Its default permits `http://localhost:8081` and `http://127.0.0.1:8081` only.

The client defaults to `http://localhost:8000`. To override it, copy `apps/mobile/.env.example` to `apps/mobile/.env` and edit `EXPO_PUBLIC_API_URL`. Expo loads this file; restart Expo after changing it. `EXPO_PUBLIC_` values are bundled into the application and must never contain secrets.

### A physical phone or Android emulator

A phone's `localhost` is the phone itself. On a trusted local network, run:

```bash
cd services/api
.venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Set `EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_LAN_IP:8000` in the client `.env`. Put the phone and computer on the same network and allow the development port through the local firewall. On the standard Android emulator use `http://10.0.2.2:8000`; the iOS simulator usually reaches the computer through `localhost`.

For a browser opened through a LAN address, also set `CORS_ORIGINS` to include that browser's exact origin (scheme, hostname, and port), then restart FastAPI. Native clients do not enforce browser CORS. Expo's tunnel exposes the frontend development server, not the separate API. Production will require HTTPS and explicit production origins.

## Automated verification

From `services/api`, run `.venv/bin/python -m pytest`: health contract, allowed/disallowed browser origins, and preflight.

From `apps/mobile`, run `npm run check`: strict TypeScript, ESLint, formatting, API response/error/timeout tests, and dashboard loading/success/error/retry tests. `npm run build:web` produces the ignored `dist` bundle. `npx expo export --platform all` also checks the iOS and Android JavaScript bundles; it does not replace a native device test.

The client tests mock HTTP or the API boundary for deterministic behavior. They do not prove a live server or a native build works. Use the manual checks below as well.

## Manual acceptance checks

1. Start FastAPI and run `npm run web` in the client. Visit `http://localhost:8081` and confirm the dashboard says “Connected to Studget”.
2. Resize to a narrow phone viewport and a wide desktop viewport. Confirm cards wrap, text stays readable, and controls remain usable by keyboard.
3. Stop FastAPI. Press “Check again”; confirm an error appears within five seconds. Restart FastAPI and press “Retry connection”; confirm recovery.
4. Confirm financial cards display em dashes and there are no fabricated transactions, balances, or insights.
5. Run on an available iOS or Android device/simulator using the networking configuration above. Confirm scrolling, safe areas, and the same connection/retry behavior.

For every future feature, explain the user flow and affected modules, add tests for meaningful success/failure/edge cases, run relevant checks, and report what was actually tested. Financial calculations require deterministic scenario tests; authorization will require cross-user denial tests.

## M1 verification and remaining checks

Verified on October 8, 2026, using Node 24.21.0 and Python 3.12.6:

- `npm run check`: TypeScript, ESLint, formatting, and 10 client tests passed.
- `npx expo export --platform all`: web, iOS, and Android bundles exported successfully.
- `.venv/bin/python -m pytest`: 4 backend tests passed. The existing Starlette/httpx and AnyIO deprecation warnings remain.
- The actual `getHealth` TypeScript function returned `{ status: 'healthy' }` against a running FastAPI process; live HTTP checks confirmed health CORS headers and a 200 response from the Expo web server.
- Native device execution and browser visual inspection were not completed. The browser automation runtime failed to initialize. Follow the manual acceptance checklist before treating the UI as visually verified.

`npm audit` reported 64 affected dependency entries (49 high, 15 moderate), stemming from five underlying advisories in `braces`, `decode-uri-component`, `node-forge`, `sprintf-js`, and `uuid`. Many entries propagate through build/test tools; this is not a claim that all are exploitable in the shipped application. The report proposed incompatible major upgrades or downgrades, so no forced audit fix was applied. Review patched SDK/tooling versions and exposure before a public deployment. The lockfile records the tested SDK 57 dependency set; re-run the audit when updating it.
