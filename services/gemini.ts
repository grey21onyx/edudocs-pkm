import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateLessonContent = async (
  topic: string, 
  section: 'outcomes' | 'objectives' | 'activities' | 'assessments'
): Promise<string> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini");
    return "AI generation unavailable without API Key.";
  }

  const prompts = {
    outcomes: `Generate 3-4 clear, measurable learning outcomes for a school lesson about "${topic}". Format as a bulleted list.`,
    objectives: `Write specific learning objectives for students studying "${topic}". Focus on Bloom's taxonomy.`,
    activities: `Suggest a step-by-step classroom activity plan for teaching "${topic}" to secondary students. Include timing.`,
    assessments: `Create a list of assessment instruments (formative and summative) for a lesson on "${topic}".`
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompts[section],
    });
    
    return response.text || "No content generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please try again.";
  }
};
