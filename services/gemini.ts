import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateLessonContent = async (
  topic: string,
  section: 'outcomes' | 'objectives' | 'activities' | 'assessments'
): Promise<string> => {
  if (!apiKey) {
    console.warn("Tidak ada API Key yang disediakan untuk Gemini");
    return "Pembuatan konten AI tidak tersedia tanpa API Key.";
  }

  const prompts = {
    outcomes: `Buatkan 3-4 capaian pembelajaran yang jelas dan terukur untuk pelajaran sekolah tentang "${topic}". Format sebagai daftar berpoin dalam Bahasa Indonesia.`,
    objectives: `Tuliskan tujuan pembelajaran spesifik untuk siswa yang mempelajari "${topic}". Fokus pada taksonomi Bloom. Gunakan Bahasa Indonesia.`,
    activities: `Sarankan rencana langkah kegiatan kelas langkah demi langkah untuk mengajarkan "${topic}" kepada siswa menengah. Sertakan waktu. Gunakan Bahasa Indonesia.`,
    assessments: `Buat daftar instrumen penilaian (formatif dan sumatif) untuk pelajaran tentang "${topic}". Gunakan Bahasa Indonesia.`
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // Use stable model
      contents: [{
        role: 'user',
        parts: [{ text: prompts[section] }]
      }],
    });

    return response.text() || "Tidak ada konten yang dihasilkan.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terjadi kesalahan saat membuat konten. Silakan coba lagi.";
  }
};
