import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
   timeout: 30000, // 30 seconds
  maxRetries: 2,
});

app.post("/analyse", async (req, res) => {
  const { transcript } = req.body;

  if (!transcript || transcript.trim() === "") {
    return res.status(400).json({ error: "Transcript is required." });
  }

  const prompt = `
You are a sales coach AI. Analyze the following sales call transcript and detect key signals.

For each signal found, return:
- "type": one of "buying_interest", "objection", "confusion", "stalling", "positive_engagement"
- "quote": the exact short quote from the transcript that shows this signal
- "tip": a one-line coaching tip for the sales rep

Return ONLY a raw JSON object. No markdown, no backticks, no explanation. Just JSON.

Format:
{
  "signals": [
    {
      "type": "buying_interest",
      "quote": "That's actually interesting",
      "tip": "Ask about their timeline now"
    }
  ]
}

Transcript:
${transcript}
`;

  try {
    const response = await client.chat.completions.create({
     model: "gemini-3.5-flash",
      messages: [
        {
          role: "system",
          content:
            "You are a sales coach AI that only responds with raw JSON. Never use markdown or backticks.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const raw = response.choices[0].message.content.trim();
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.json(parsed);
  } catch (err) {
    console.error("Full error:", JSON.stringify(err, null, 2));
  console.error("Error message:", err.message);
  console.error("Error status:", err.status);
  console.error("Error response:", err.response?.data);
  return res.status(500).json({ error: err.message });
    
  }
});

app.get("/", (req, res) => {
  res.json({ status: "Meeting Analyzer API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});