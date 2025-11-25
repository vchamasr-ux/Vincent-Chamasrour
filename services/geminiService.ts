import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { Persona, AISettings } from "../types";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFinancialPersona = async (interests: string[], name: string): Promise<Persona> => {
  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    User Name: ${name}
    Interests: ${interests.join(", ")}

    Analyze the user's interests and create a "Financial Persona" for a modern, Gen Z banking app.
    The persona should be cool, punchy, and forward-looking.
    
    1. Create a short, catchy "Persona Name" (e.g., "Digital Nomad", "Tech Tycoon", "Eco Warrior").
    2. Write a 1-sentence description of their financial vibe.
    3. Suggest 3 "Pocket Names" (savings goals) with emojis based on their interests.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      personaName: { type: Type.STRING, description: "A catchy 2-3 word title for the user's financial style" },
      description: { type: Type.STRING, description: "A single sentence description of their spending/saving style" },
      suggestedPockets: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 emoji-prefixed names for savings pots"
      }
    },
    required: ["personaName", "description", "suggestedPockets"]
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");
    
    const data = JSON.parse(text) as Persona;
    return data;
  } catch (error) {
    console.error("Error generating persona:", error);
    // Fallback if AI fails
    return {
      personaName: "Future Builder",
      description: "You're laying the groundwork for a massive empire.",
      suggestedPockets: ["🚀 Moonshot Fund", "☕ Daily Fuel", "🌍 Adventure"]
    };
  }
};

export const generateAIPersonalityWelcome = async (name: string, modeLabel: string, personaName: string): Promise<string> => {
  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    User: ${name}
    User's Financial Persona: ${personaName}
    AI Assistant Mode: ${modeLabel}

    Write a very short (max 15 words) welcome message from the AI assistant to the user.
    The tone should strictly match the "AI Assistant Mode".
    - Strategist: Professional, efficient, analytical.
    - Hype Man: Excited, using emojis, high energy.
    - Zen Guide: Calm, minimalist, soothing.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text?.trim() || "Ready to optimize your wealth.";
  } catch (error) {
    return "Welcome to Nova. Let's grow your wealth.";
  }
};

export const createNovaChat = (name: string, persona: Persona, settings: AISettings): Chat => {
  const modelId = "gemini-2.5-flash";

  const systemInstruction = `
    You are Nova, an advanced AI financial assistant for ${name}.
    
    USER CONTEXT:
    - Persona: ${persona.personaName} (${persona.description})
    - Goals: ${settings.goals.join(", ")}
    - Your Personality Mode: ${settings.modeId} (See definitions below)

    PERSONALITY DEFINITIONS:
    - strategist: Ruthless optimization, professional, concise, focuses on efficiency and math.
    - hype-man: High energy, uses lots of emojis (🔥, 🚀), enthusiastic, encouraging, slangy but professional.
    - zen-guide: Calm, soothing, minimalist, focuses on peace of mind and simplicity.

    INSTRUCTIONS:
    - Adopt the voice of the selected Personality Mode deeply.
    - Keep responses short (under 50 words unless asked for deep analysis) and mobile-friendly.
    - You are helpful, smart, and proactive about their money.
    - Do not offer generic advice; reference their goals or persona if relevant.
  `;

  return ai.chats.create({
    model: modelId,
    config: {
      systemInstruction: systemInstruction,
    }
  });
};