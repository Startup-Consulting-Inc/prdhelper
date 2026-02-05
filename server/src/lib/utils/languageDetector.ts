/**
 * Language Detection Utility
 *
 * Detects language from text input using character range analysis.
 * Used to ensure AI responses match the language of user inputs.
 */

export type SupportedLanguage = 'en' | 'ko' | 'ja' | 'zh';

interface LanguagePattern {
  language: SupportedLanguage;
  test: (text: string) => number; // Returns confidence 0-1
}

/**
 * Language detection patterns using Unicode character ranges
 */
const languagePatterns: LanguagePattern[] = [
  {
    language: 'ko',
    test: (text: string) => {
      // Korean Hangul: U+AC00-U+D7A3 (syllables), U+1100-U+11FF (jamo)
      const koreanChars = (text.match(/[\uAC00-\uD7A3\u1100-\u11FF]/g) || []).length;
      return text.length > 0 ? koreanChars / text.length : 0;
    },
  },
  {
    language: 'ja',
    test: (text: string) => {
      // Japanese: Hiragana (U+3040-U+309F), Katakana (U+30A0-U+30FF)
      // Note: Kanji (CJK) shared with Chinese, so we prioritize kana detection
      const hiragana = (text.match(/[\u3040-\u309F]/g) || []).length;
      const katakana = (text.match(/[\u30A0-\u30FF]/g) || []).length;
      const japaneseChars = hiragana + katakana;
      return text.length > 0 ? japaneseChars / text.length : 0;
    },
  },
  {
    language: 'zh',
    test: (text: string) => {
      // Chinese: CJK Unified Ideographs (U+4E00-U+9FFF)
      // Only count as Chinese if no Japanese kana present
      const cjkChars = (text.match(/[\u4E00-\u9FFF]/g) || []).length;
      const japaneseKana = (text.match(/[\u3040-\u309F\u30A0-\u30FF]/g) || []).length;
      // If kana present, this is likely Japanese, not Chinese
      if (japaneseKana > 0) return 0;
      return text.length > 0 ? cjkChars / text.length : 0;
    },
  },
];

/**
 * Detect the primary language of the input text
 *
 * @param text - The text to analyze
 * @returns The detected language code ('en', 'ko', 'ja', 'zh')
 */
export function detectLanguage(text: string): SupportedLanguage {
  if (!text || text.trim().length === 0) return 'en';

  // Remove whitespace and punctuation for more accurate character ratio
  const cleanText = text.replace(/[\s\p{P}\p{N}]/gu, '');
  if (cleanText.length === 0) return 'en';

  // Calculate confidence for each non-English language
  const results = languagePatterns.map((pattern) => ({
    language: pattern.language,
    confidence: pattern.test(cleanText),
  }));

  // Find the highest confidence non-English language
  const bestMatch = results.reduce((best, current) =>
    current.confidence > best.confidence ? current : best
  );

  // If any non-English language has >5% character match, use that language
  // Lower threshold (5%) to catch mixed-language inputs where user clearly uses non-English
  if (bestMatch.confidence > 0.05) {
    return bestMatch.language;
  }

  // Default to English
  return 'en';
}

/**
 * Get language name for display
 */
export function getLanguageName(language: SupportedLanguage): string {
  const names: Record<SupportedLanguage, string> = {
    en: 'English',
    ko: 'Korean',
    ja: 'Japanese',
    zh: 'Chinese',
  };
  return names[language];
}

/**
 * Get explicit language instruction for AI prompts
 *
 * This instruction is appended to system prompts to ensure
 * the AI responds in the correct language.
 *
 * @param language - The target language code
 * @returns A strong instruction string for the AI
 */
export function getLanguageInstruction(language: SupportedLanguage): string {
  const instructions: Record<SupportedLanguage, string> = {
    en: `**CRITICAL LANGUAGE REQUIREMENT**: You MUST respond ONLY in English. All questions, explanations, and generated content must be written in English. Do not use any other language.`,
    ko: `**CRITICAL LANGUAGE REQUIREMENT**: You MUST respond ONLY in Korean (한국어). All questions, explanations, and generated content must be written in Korean. 모든 응답은 반드시 한국어로 작성해야 합니다.`,
    ja: `**CRITICAL LANGUAGE REQUIREMENT**: You MUST respond ONLY in Japanese (日本語). All questions, explanations, and generated content must be written in Japanese. すべての回答は必ず日本語で記述してください。`,
    zh: `**CRITICAL LANGUAGE REQUIREMENT**: You MUST respond ONLY in Chinese (中文). All questions, explanations, and generated content must be written in Chinese. 所有回答必须用中文书写。`,
  };

  return instructions[language];
}
