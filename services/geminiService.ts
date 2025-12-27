
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export const translateText = async (text: string, onChunk?: (chunk: string) => void): Promise<string> => {
  if (!text.trim()) return '';

  // Create instance right before call as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';
  const systemInstruction = `You are a professional German-to-English translator. 
  Maintain a formal, professional tone. 
  Preserve all structural formatting like bullet points, numbering, and headers.
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
  } catch (error: any) {
    console.error("Translation error:", error);
    if (error.message?.includes("not found")) {
      throw new Error("API_KEY_MISSING");
    }
    throw new Error(error.message || "Translation module failure.");
  }
};

export const translateDocumentContent = async (content: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';
  const systemInstruction = `You are an expert Document Architect and Translator. 
  Translate the following German document into English while maintaining a "Visual Mirror" of the original layout.
  Use Markdown to represent structural elements. Ensure terminology is professional.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: content,
      config: { 
        systemInstruction,
        temperature: 0.1,
        thinkingConfig: { thinkingBudget: 1000 }
      }
    });
    return response.text || '';
  } catch (error: any) {
    console.error("Doc error:", error);
    if (error.message?.includes("not found")) {
      throw new Error("API_KEY_MISSING");
    }
    throw new Error(error.message || "Document processing failed.");
  }
};
