
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

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
      return response.text || '';
    }
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Translation failed. Please check your connection and try again.");
  }
};

export const translateDocumentContent = async (content: string): Promise<string> => {
  const model = 'gemini-3-pro-preview';
  const systemInstruction = `You are an expert Document Architect and Translator. 
  Your goal is to translate a German document into English while maintaining a "Visual Mirror" of the original layout.
  
  RULES:
  1. PHYSICAL ALIGNMENT: Use whitespace, tabs, and line breaks to mimic the original document's spatial arrangement.
  2. HEADERS: Use Markdown headers (# ## ###) that correspond to the visual weight of the original headers.
  3. LISTS/TABLES: Preserve every bullet point and table structure exactly.
  4. TERMINOLOGY: Use high-level professional English (e.g., in business or legal contexts).
  5. NO METADATA: Do not add any "Translated by" or "Page X" notes unless they were in the source.
  
  The result must look clean, professional, and ready for official submission.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: content,
      config: { 
        systemInstruction,
        temperature: 0.1, // Near-zero temperature for maximum structural consistency
        thinkingConfig: { thinkingBudget: 1000 } // Reserve tokens for layout reasoning
      }
    });
    return response.text || '';
  } catch (error) {
    console.error("Document translation error:", error);
    throw new Error("Failed to process document translation.");
  }
};
