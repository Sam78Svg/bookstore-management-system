import { GoogleGenAI } from "@google/genai";

// Lazy initialize GenAI client to shield process from startup crashing if key is not populated
let aiInstance = null;

function getAIClient() {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required in secrets");
    }
    aiInstance = new GoogleGenAI({ apiKey: key });
  }
  return aiInstance;
}

/**
 * Extracts bibliophile structural metadata details from PDF content using Gemini AI
 * @param {string} pdfBase64 - Raw base64 string of the uploaded PDF file
 * @returns {Promise<Object>} Extracted metadata object
 */
export async function extractMetadataFromPdf(pdfBase64) {
  try {
    const ai = getAIClient();
    
    const prompt = `Extract standard bibliophile metadata details from this book document cover sheet, forward, or introductory pages.
Provide the output strictly as a valid JSON parsed structure with these exact fields:
- title: (string, the official title of the book)
- author: (string, name of the main authors or creators)
- genre: (string, choose strictly one of these exact options: Sci-Fi, Technology, Mystery, Self-Help, Fantasy, History)
- publicationDate: (string representing the publication date, e.g., "August 12, 2023" or similar format found in text)
- publicationYear: (string representing the four digit publication year, e.g., "2023")
- summary: (string, a concise, engaging 1-2 sentence description summarizing the core plot or focus of the book)
- description: (string, a longer comprehensive paragraph outlining the narrative, background, or analytical value of the book)`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: pdfBase64
          }
        },
        prompt
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsedData = JSON.parse(response.text);
    return parsedData;
  } catch (error) {
    console.error("Gemini PDF parsing metadata extractor failed:", error);
    throw error;
  }
}
