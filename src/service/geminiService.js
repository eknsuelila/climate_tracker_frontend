import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateAnalyticsSummary(region, events, severity) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an environmental analyst.
      Analyze the environmental event data for the region: ${region}.
      
      Event data: ${JSON.stringify(events, null, 2)}
      Severity distribution: ${JSON.stringify(severity, null, 2)}

      Provide a concise 2–3 sentence summary highlighting:
      - The most frequent event type
      - The general severity trend
      - Any notable insights or anomalies
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Gemini summary generation failed:", error);
    }
    return "Unable to generate summary at this time.";
  }
}
