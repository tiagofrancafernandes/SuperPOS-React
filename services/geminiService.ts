
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartSuggestions = async (query: string, inventory: Product[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the following inventory: ${JSON.stringify(inventory.map(p => ({ id: p.id, name: p.name, category: p.category })))}, identify which products the user is looking for with this search: "${query}". Return the IDs of the best matching products.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            reasoning: { type: Type.STRING }
          },
          required: ["suggestedIds"]
        }
      }
    });

    const data = JSON.parse(response.text || '{"suggestedIds": []}');
    return data.suggestedIds as string[];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};
