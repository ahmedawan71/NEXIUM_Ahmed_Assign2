export const urduDictionary = {
  inspire: "حوصلہ افزائی",
  success: "کامیابی",
  achieve: "حاصل کرنا",
  learn: "سیکھنا",
  goal: "ہدف",
  // Add more words as needed
};

export async function translateToUrdu(text: string): Promise<string> {
  let translated = text;
  for (const [en, ur] of Object.entries(urduDictionary)) {
    translated = translated.replace(new RegExp(`\\b${en}\\b`, "gi"), ur);
  }
  return translated;
}