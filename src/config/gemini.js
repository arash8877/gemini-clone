import { GoogleGenAI } from "@google/genai";

// 1. Initialize the GenAI instance
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

/**
 * Main chat function
 * Uses Named Export to ensure compatibility with Context.jsx
 */
export async function runChat(input) {
  // Check for API Key early
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY in your .env file.");
  }

  try {
    // We use gemini-2.5-flash as it is the most stable free-tier model in 2026
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: [{ text: input }],
    });

    // Extract text directly from the response object
    const text = response.text;

    if (!text) {
      console.error("Gemini response was empty:", response);
      throw new Error("Gemini returned an empty response.");
    }

    return text;

  } catch (error) {
    throw toUserFacingError(error);
  }
}

/**
 * Handles error parsing and formatting for the UI
 */
const toUserFacingError = (error) => {
  const message = error?.message || "";
  const code = error?.status || error?.error?.code;

  // Handle Quota Issues (429)
  if (code === 429 || message.includes("quota") || message.includes("429")) {
    return new Error(
      "Limit reached. Please check if your project is linked to a billing account in AI Studio to unlock the daily free tier quota."
    );
  }

  // Handle Invalid Model/Version (404)
  if (code === 404) {
    return new Error("Model not found. Please ensure you are using a supported model like gemini-2.5-flash.");
  }

  return error instanceof Error ? error : new Error("Failed to connect to Gemini.");
};