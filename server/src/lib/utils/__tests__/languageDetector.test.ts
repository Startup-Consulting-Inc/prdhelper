/**
 * Language Detector Unit Tests
 *
 * Tests for the language detection utility used to ensure consistent
 * language in AI responses.
 */

import { describe, it, expect } from 'vitest';
import {
  detectLanguage,
  getLanguageInstruction,
  getLanguageName,
} from '../languageDetector.js';

describe('detectLanguage', () => {
  describe('English detection', () => {
    it('should detect pure English text', () => {
      expect(detectLanguage('Building an e-commerce platform')).toBe('en');
    });

    it('should detect English with numbers and punctuation', () => {
      expect(
        detectLanguage('E-Commerce Platform v2.0 - Shopping Cart Integration!')
      ).toBe('en');
    });

    it('should default to English for empty input', () => {
      expect(detectLanguage('')).toBe('en');
    });

    it('should default to English for whitespace-only input', () => {
      expect(detectLanguage('   ')).toBe('en');
    });

    it('should default to English for numbers-only input', () => {
      expect(detectLanguage('123456')).toBe('en');
    });
  });

  describe('Korean detection', () => {
    it('should detect pure Korean text', () => {
      expect(detectLanguage('전자상거래 플랫폼 구축')).toBe('ko');
    });

    it('should detect Korean with English mixed (majority Korean)', () => {
      expect(detectLanguage('E-Commerce 플랫폼을 구축하고 싶습니다')).toBe('ko');
    });

    it('should detect Korean project description', () => {
      expect(
        detectLanguage(
          '쇼핑 카트와 결제 통합이 포함된 현대적인 전자상거래 플랫폼 구축'
        )
      ).toBe('ko');
    });
  });

  describe('Japanese detection', () => {
    it('should detect pure Japanese text with Hiragana', () => {
      expect(detectLanguage('これはテストです')).toBe('ja');
    });

    it('should detect Japanese text with Katakana', () => {
      expect(detectLanguage('プラットフォーム')).toBe('ja');
    });

    it('should detect mixed Hiragana and Katakana', () => {
      expect(
        detectLanguage('電子商取引プラットフォームを構築する')
      ).toBe('ja');
    });
  });

  describe('Chinese detection', () => {
    it('should detect pure Chinese text (no Japanese kana)', () => {
      expect(detectLanguage('电子商务平台')).toBe('zh');
    });

    it('should detect Chinese project description', () => {
      expect(
        detectLanguage('建立一个现代化的电子商务平台，包括购物车和支付集成')
      ).toBe('zh');
    });
  });

  describe('Mixed language handling', () => {
    it('should detect Korean when Korean chars present with English title', () => {
      // Common case: English product name, Korean description
      const text = 'PRD Helper 프로젝트 요구사항 문서 생성 도구';
      expect(detectLanguage(text)).toBe('ko');
    });

    it('should detect English when very few non-English characters', () => {
      // Less than 5% non-English should default to English
      const text =
        'This is a long English text about building a platform for e-commerce 플';
      expect(detectLanguage(text)).toBe('en');
    });
  });
});

describe('getLanguageInstruction', () => {
  it('should return English instruction', () => {
    const instruction = getLanguageInstruction('en');
    expect(instruction).toContain('English');
    expect(instruction).toContain('CRITICAL');
    expect(instruction).toContain('MUST');
  });

  it('should return Korean instruction with Korean text', () => {
    const instruction = getLanguageInstruction('ko');
    expect(instruction).toContain('Korean');
    expect(instruction).toContain('한국어');
  });

  it('should return Japanese instruction with Japanese text', () => {
    const instruction = getLanguageInstruction('ja');
    expect(instruction).toContain('Japanese');
    expect(instruction).toContain('日本語');
  });

  it('should return Chinese instruction with Chinese text', () => {
    const instruction = getLanguageInstruction('zh');
    expect(instruction).toContain('Chinese');
    expect(instruction).toContain('中文');
  });
});

describe('getLanguageName', () => {
  it('should return correct language names', () => {
    expect(getLanguageName('en')).toBe('English');
    expect(getLanguageName('ko')).toBe('Korean');
    expect(getLanguageName('ja')).toBe('Japanese');
    expect(getLanguageName('zh')).toBe('Chinese');
  });
});
