
import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosisResult, GroundingSource } from "./types.ts";
import { SYSTEM_INSTRUCTION, GEMINI_MODEL } from "./constants.tsx";

export const diagnosePlant = async (base64Image: string, lang: 'en' | 'hi' = 'en'): Promise<DiagnosisResult> => {
  // Check for API key and provide a helpful error message
  if (!process.env.API_KEY) {
    throw new Error("Missing Gemini API Key. Please ensure API_KEY is set in your environment variables and redeploy.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const targetLanguage = lang === 'hi' ? 'Hindi' : 'English';

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      diseaseName: { type: Type.STRING, description: 'Common name of the disease or health status' },
      isHealthy: { type: Type.BOOLEAN, description: 'True if no disease or deficiency is detected' },
      scientificName: { type: Type.STRING, description: 'Latin/Scientific name of the pathogen' },
      confidence: { type: Type.STRING, description: 'Probability score or confidence level (e.g. 95%)' },
      summary: { type: Type.STRING, description: 'Brief overview of the condition' },
      symptoms: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Visual indicators observed in the image'
      },
      treatmentSteps: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Immediate actions for the farmer'
      },
      preventiveMeasures: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Long-term management strategies'
      },
      recommendedProducts: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Specific product name (e.g., Nativo 75 WG, Amistar Top)' },
            brandName: { type: Type.STRING, description: 'The official brand/manufacturer (e.g., Bayer, Syngenta, BASF)' },
            brandLogoUrl: { type: Type.STRING, description: 'Valid URL to an official logo for this brand' },
            productImageUrl: { type: Type.STRING, description: 'Valid URL to a high-quality product packshot/bottle image' },
            type: { type: Type.STRING, enum: ['Organic', 'Chemical', 'Biological'] },
            reason: { type: Type.STRING, description: 'Why this specific brand product is the best choice for this diagnosis' }
          },
          required: ['name', 'brandName', 'type', 'reason']
        }
      }
    },
    required: [
      'diseaseName', 
      'isHealthy', 
      'confidence', 
      'summary', 
      'symptoms', 
      'treatmentSteps', 
      'preventiveMeasures', 
      'recommendedProducts'
    ]
  };

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          parts: [
            { text: `Perform a precise plant diagnosis in ${targetLanguage}. Use Google Search grounding to find EXACT agricultural products from global leaders like Bayer, Syngenta, BASF, and Corteva that are approved for this specific condition in 2024-2025. IMPORTANT: All text in the JSON response must be in ${targetLanguage}.` },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(',')[1] || base64Image
              }
            }
          ]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No diagnosis received from AI");
    
    const parsedResult = JSON.parse(resultText) as DiagnosisResult;

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      const sources: GroundingSource[] = groundingChunks
        .map((chunk: any) => chunk.web)
        .filter(Boolean)
        .map((web: any) => ({
          uri: web.uri,
          title: web.title
        }));
      parsedResult.sources = sources;
    }

    return parsedResult;
  } catch (error: any) {
    console.error("Diagnosis Error:", error);
    if (error.message?.includes("API key")) {
      throw new Error("Invalid or missing API Key. Please check your Vercel environment variables.");
    }
    throw new Error(error.message || "Failed to process the image. Please try again with a clearer photo.");
  }
};
