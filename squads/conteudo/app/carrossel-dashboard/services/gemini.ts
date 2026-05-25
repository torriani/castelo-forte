
import { GoogleGenAI, Type } from "@google/genai";
import { BrandProfile, CarouselConfig, SlideData, SlideLayout } from "../types";

// Helper to get ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const generateCarouselContent = async (
  config: CarouselConfig,
  brand: BrandProfile
): Promise<SlideData[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are a LEGENDARY Direct Response Copywriter and Viral Growth Hacker.
    
    GOAL: Create a ${config.slideCount}-slide carousel manifesto.
    
    CONTEXT:
    - Topic: ${config.topic}
    - Proof/Facts: ${config.facts}
    - Intention: ${config.intention}
    - Framework: ${config.framework}
    - Final CTA: ${config.customCta}

    *** THE NARRATIVE TRIPLET (STRICT FORMAT) ***
    We do NOT use headlines/titles. We use a 3-step logical argument for every slide.
    
    You MUST output exactly 3 lines per slide, separated by \\n.
    
    LINE 1: THE PREMISE (A Premissa)
    - A declarative statement, a hard fact, or a belief. 
    - It is NOT a title. It is the beginning of the thought.
    - Max 10-12 words.
    
    LINE 2: THE DEVELOPMENT (O Desenvolvimento)
    - Expands on the premise. Explains the "why" or provides context.
    - Must connect naturally to Line 1.
    
    LINE 3: THE CONSEQUENCE (O Fechamento)
    - The conclusion of this specific thought or the bridge to the next slide.
    - Completes the argument of the slide.

    *** EXAMPLE OF DESIRED FLOW ***
    Slide Input: "Why agencies fail"
    Output:
    "A maioria das agências quebra em menos de 12 meses." (Premise)
    "Elas focam em métricas de vaidade enquanto o caixa sangra." (Development)
    "Sem lucro real, a criatividade não paga as contas." (Conclusion)

    *** TONE GUIDELINES ***
    1. **CONTINUITY:** The lines should read like a cohesive paragraph split into 3 visual chunks.
    2. **AGGRESSIVE & DIRECT:** No fluff. Direct assertions.
    3. **NO TITLES:** Line 1 is text, not a header.
    4. **LANGUAGE:** Portuguese (Brazil).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a carousel about: "${config.topic}". Structure: Premise -> Development -> Conclusion.`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: {
                type: Type.STRING,
                enum: ["cover", "content", "list", "quote", "cta"],
                description: "The layout type of the slide."
              },
              content: {
                type: Type.STRING,
                description: "Line 1 (Premise) \\n Line 2 (Development) \\n Line 3 (Conclusion). EXACTLY 3 LINES."
              },
              title: {
                type: Type.STRING,
                description: "DEPRECATED. MUST BE EMPTY STRING."
              },
              highlight: {
                type: Type.STRING,
                description: "DEPRECATED. MUST BE EMPTY STRING."
              }
            },
            required: ["type", "content"]
          }
        }
      }
    });

    const rawJson = response.text;
    if (!rawJson) throw new Error("No data returned from AI");

    const parsedSlides = JSON.parse(rawJson);

    // Hydrate with IDs, formatting, and default layouts
    return parsedSlides.map((s: any, index: number) => {
      let defaultLayout: SlideLayout = 'text-top';

      if (index === 0) {
        defaultLayout = 'impact';
      } else if (s.type === 'list') {
        defaultLayout = 'list';
      }

      return {
        id: generateId(),
        type: s.type,
        layout: defaultLayout, // Auto-assign layout
        title: "", // FORCE EMPTY TITLE
        content: s.content || "",
        highlight: "", 
        footerText: `${index + 1}/${parsedSlides.length}`
      };
    });

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
