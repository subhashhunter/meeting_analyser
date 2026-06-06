# Meeting Analyzer — NimitAI Intern Assignment

AI-powered sales call transcript analyzer. Paste a transcript → get detected signals (buying interest, objections, confusion, stalling) with one-line coaching tips.

## LLM Used
**Google Gemini 3.5 Flash** — accessed via the OpenAI-compatible Gemini API endpoint using the `openai` Node.js SDK.

## Stack
- **Backend**: Node.js + Express 
- **Frontend**: React + Tailwind CSS

---

## Project Structure

```
meeting-analyzer/
├── backend/
│   ├── index.js        ← Express server (ES module imports)
│   ├── package.json    ← "type": "module" enabled
│   └── .env            ← Your Gemini API key goes here
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├
    │   ├── index.css       ← Tailwind directives
    │   └── App.jsx        ← Full UI with Tailwind classes
    └── package.json
_____ screenshots
|     |___ res_1.png
|     |___ res_2.png
|
|____ Readme.md

---

## Setup

### 1. Get a free Gemini API Key
1. Go to [https://aistudio.google.com](https://aistudio.google.com)
2. Sign in with Google → click **"Get API Key"** → **"Create API Key"**
3. Copy the key

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Open `.env` and paste your key:
```
GEMINI_API_KEY=your_actual_key_here
PORT=5000
```

Start the server:
```bash
npm start
```

Runs at: `http://localhost:5000`

---

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm start
```

App opens at: `http://localhost:5173`

---

## API

### `POST /analyse`

**Request:**
```json
{ "transcript": "Rep: Hello...\nProspect: Hi..." }
```

**Response:**
```json
{
  "signals": [
    {
      "type": "buying_interest",
      "quote": "That's actually interesting",
      "tip": "Ask about their timeline now"
    }
  ]
}
```

**Signal types:** `buying_interest` | `objection` | `confusion` | `stalling` | `positive_engagement`

---

## How Gemini is used via OpenAI SDK

```js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
```

Gemini supports the OpenAI-compatible format — use the same OpenAI SDK, just swap the key and base URL. Completely free.

