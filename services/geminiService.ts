import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Updated: Strictly use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const translateText = async (text: string, onChunk?: (chunk: string) => void): Promise<string> => {
  if (!text.trim()) return '';

  const model = 'gemini-3-pro-preview';
  const systemInstruction = `You are a professional German-to-English translator. 
  Maintain a formal, professional tone. 
  Preserve all structural formatting like bullet points, numbering, and headers.
  If the text looks like a legal or technical document, use appropriate terminology.
  Your output should ONLY be the translated English text.`;

  try {
    if (onChunk) {
      const responseStream = await ai.models.generateContentStream({
        model,
        contents: text,
        config: { systemInstruction }
      });

      let fullText = '';
      for await (const chunk of responseStream) {
        // Correct: Access .text property directly
        const chunkText = (chunk as GenerateContentResponse).text || '';
        fullText += chunkText;
        onChunk(chunkText);
      }
      return fullText;
    } else {
      const response = await ai.models.generateContent({
        model,
        contents: text,
        config: { systemInstruction }
      });
      // Correct: Access .text property directly
      return response.text || '';
    }
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Translation failed. Please check your connection and try again.");
  }
};

export const translateDocumentContent = async (content: string): Promise<string> => {
  const model = 'gemini-3-pro-preview';
  const systemInstruction = `You are an expert document formatter and translator. 
  Translate the following German document into English. 
  CRITICAL: You MUST maintain the EXACT alignment, spacing, and hierarchy of the original text. 
  Use Markdown to represent structural elements like bolding, tables (if text-based), and lists.
  Ensure headers are clearly defined.
  The output should be clean, professional, and ready for high-quality printing.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: content,
      config: { 
        systemInstruction,
        temperature: 0.2 // Lower temperature for more consistent formatting
      }
    });
    // Correct: Access .text property directly
    return response.text || '';
  } catch (error) {
    console.error("Document translation error:", error);
    throw new Error("Failed to process document translation.");
  }
};