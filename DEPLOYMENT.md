# SurgiFlow Deployment Package

## Requirements

- Node.js 20 or newer
- npm
- Production OpenAI API key if Copilot is enabled

## Install backend dependencies

From the deployment folder:

npm install --omit=dev

## Environment Configuration

Create a `.env` file based on `.env.example`.

Example:

OPENAI_API_KEY=YOUR_OPENAI_API_KEY
PORT=8787

Do not commit or share the production API key.

## Frontend

The production frontend build is located in:

frontend/dist

This directory should be served by the production web server.

For React Router, configure the web server to fall back to:

index.html

for routes that do not correspond to physical files.

## Copilot Backend

The Copilot API server is located in:

server/index.mjs

The production web server should route:

/api/copilot

to the Node.js Copilot backend.

## Production Build

To rebuild the frontend:

npm install
npm run build

## Verification

After deployment verify:

- Dashboard loads
- Patient Directory loads
- Patient Details open correctly
- Reception works
- Cashier works
- Pre-Op works
- Surgery works
- Post-Op works
- Page refresh works on nested routes
- Copilot API responds