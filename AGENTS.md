# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a Gatsby v2 personal portfolio site ("CALE_OS"). It is a single-service static site with no backend, database, or Docker dependencies.

### Node version

Gatsby v2 requires **Node 14** (`lts/fermium`). The environment uses nvm with Node 14 set as the default. Node 16+ will fail on various dependency builds.

### Key gotcha: sharp native module

The `sharp` image processing library requires system-level `libvips-dev` and a compatible `node-gyp`. The VM snapshot has these pre-installed. If `yarn install` fails on sharp, ensure:
1. `libvips-dev` is installed (`sudo apt-get install -y libvips-dev`)
2. Use the global `node-gyp` v9: `npm_config_node_gyp=$(which node-gyp) yarn install`

### Running the dev server

```
yarn develop     # starts Gatsby dev server on http://localhost:8000
```

### Build

```
yarn build       # production build to public/
```

### Lint

No standalone ESLint config exists. Gatsby runs internal linting during build. Running `yarn build` validates code correctness.

### Tests

No automated test suite is configured. Cypress scripts exist in `package.json` (`develop:cypress`, `build:cypress`) but no test files are present.

### Environment variables

- `GOOGLE_ANALYTICS_ID` (optional): Set in `.env` file for Google Analytics tracking. The site runs fully without it.
