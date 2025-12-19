
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from '../types';

export const getSmartSuggestions = async (query: string, inventory: Product[]) => {
  try {
    // Acessa a API_KEY apenas no momento da execução para evitar erros de inicialização precoce
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
    
    if (!apiKey) {
      console.warn("Gemini API Key não encontrada em process.env.API_KEY");
      return [];
    }

    const ai = new GoogleGenAI({ apiKey });
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

    const text = response.text;
    if (!text) return [];
    
    const data = JSON.parse(text);
    return (data.suggestedIds || []) as string[];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};
