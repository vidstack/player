import { vi } from 'vitest';

import { TextTrack } from './text-track';

// Mock media-captions module
const mockParseText = vi.fn();
const mockVTTCue = vi.fn();
const mockVTTRegion = vi.fn();

vi.mock('media-captions', () => ({
  parseText: mockParseText,
  VTTCue: mockVTTCue,
  VTTRegion: mockVTTRegion,
}));

// Mock DOMEvent to prevent JSDOM issues
vi.mock('maverick.js/std', async () => {
  const actual = (await vi.importActual('maverick.js/std')) as any;
  return {
    ...actual,
    DOMEvent: vi.fn().mockImplementation((type, eventInit) => {
      const event = new Event(type, eventInit);
      if (eventInit?.detail !== undefined) {
        Object.defineProperty(event, 'detail', {
          value: eventInit.detail,
          writable: false,
        });
      }
      if (eventInit?.trigger !== undefined) {
        Object.defineProperty(event, 'trigger', {
          value: eventInit.trigger,
          writable: false,
        });
      }
      return event;
    }),
  };
});

describe('TextTrack Content Parsing', function () {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParseText.mockResolvedValue({ cues: [], regions: [] });
  });

  describe('whitespace normalization in #parseContent', function () {
    it('should normalize indented template literal content', async function () {
      const indentedSrtContent = `    1
    00:00:01,000 --> 00:00:05,000
    First subtitle

    2
    00:00:06,000 --> 00:00:10,000
    Second subtitle`;

      const track = new TextTrack({
        kind: 'subtitles',
        label: 'Test Subtitles',
        content: indentedSrtContent,
        type: 'srt',
      });

      // Wait for the async parseContent to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockParseText).toHaveBeenCalledWith(
        `1\n00:00:01,000 --> 00:00:05,000\nFirst subtitle\n\n2\n00:00:06,000 --> 00:00:10,000\nSecond subtitle`,
        { type: 'srt' },
      );
    });

    it('should handle content with mixed indentation', async function () {
      const mixedIndentationContent = `  1
      00:00:01,000 --> 00:00:05,000
    First subtitle

        2
  00:00:06,000 --> 00:00:10,000
      Second subtitle`;

      const track = new TextTrack({
        kind: 'subtitles',
        label: 'Test Subtitles',
        content: mixedIndentationContent,
        type: 'srt',
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockParseText).toHaveBeenCalledWith(
        `1\n00:00:01,000 --> 00:00:05,000\nFirst subtitle\n\n2\n00:00:06,000 --> 00:00:10,000\nSecond subtitle`,
        { type: 'srt' },
      );
    });

    it('should handle content with leading and trailing whitespace', async function () {
      const whitespaceContent = `
        1
        00:00:01,000 --> 00:00:05,000
        First subtitle
      `;

      const track = new TextTrack({
        kind: 'subtitles',
        label: 'Test Subtitles',
        content: whitespaceContent,
        type: 'srt',
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockParseText).toHaveBeenCalledWith(
        `1\n00:00:01,000 --> 00:00:05,000\nFirst subtitle`,
        { type: 'srt' },
      );
    });

    it('should preserve empty lines in content', async function () {
      const contentWithEmptyLines = `    1
    00:00:01,000 --> 00:00:05,000
    First subtitle

    2
    00:00:06,000 --> 00:00:10,000
    Second subtitle


    3
    00:00:11,000 --> 00:00:15,000
    Third subtitle`;

      const track = new TextTrack({
        kind: 'subtitles',
        label: 'Test Subtitles',
        content: contentWithEmptyLines,
        type: 'srt',
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockParseText).toHaveBeenCalledWith(
        `1\n00:00:01,000 --> 00:00:05,000\nFirst subtitle\n\n2\n00:00:06,000 --> 00:00:10,000\nSecond subtitle\n\n\n3\n00:00:11,000 --> 00:00:15,000\nThird subtitle`,
        { type: 'srt' },
      );
    });

    it('should handle already normalized content without changes', async function () {
      const normalizedContent = `1
00:00:01,000 --> 00:00:05,000
First subtitle

2
00:00:06,000 --> 00:00:10,000
Second subtitle`;

      const track = new TextTrack({
        kind: 'subtitles',
        label: 'Test Subtitles',
        content: normalizedContent,
        type: 'srt',
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockParseText).toHaveBeenCalledWith(normalizedContent, { type: 'srt' });
    });

    it('should handle VTT content with indentation', async function () {
      const indentedVttContent = `    WEBVTT

    1
    00:00:01.000 --> 00:00:05.000
    First subtitle

    2
    00:00:06.000 --> 00:00:10.000
    Second subtitle`;

      const track = new TextTrack({
        kind: 'subtitles',
        label: 'Test Subtitles',
        content: indentedVttContent,
        type: 'vtt',
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockParseText).toHaveBeenCalledWith(
        `WEBVTT\n\n1\n00:00:01.000 --> 00:00:05.000\nFirst subtitle\n\n2\n00:00:06.000 --> 00:00:10.000\nSecond subtitle`,
        { type: 'vtt' },
      );
    });

    it('should handle content with only whitespace', async function () {
      const whitespaceOnlyContent = `    
        
      `;

      const track = new TextTrack({
        kind: 'subtitles',
        label: 'Test Subtitles',
        content: whitespaceOnlyContent,
        type: 'srt',
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockParseText).toHaveBeenCalledWith('', { type: 'srt' });
    });

    it('should handle single line content with indentation', async function () {
      const singleLineContent = `    WEBVTT`;

      const track = new TextTrack({
        kind: 'subtitles',
        label: 'Test Subtitles',
        content: singleLineContent,
        type: 'vtt',
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockParseText).toHaveBeenCalledWith('WEBVTT', { type: 'vtt' });
    });

    it('should not process JSON content through whitespace normalization', async function () {
      const jsonContent = {
        cues: [
          { startTime: 1, endTime: 5, text: 'First subtitle' },
          { startTime: 6, endTime: 10, text: 'Second subtitle' },
        ],
      };

      const track = new TextTrack({
        kind: 'subtitles',
        label: 'Test Subtitles',
        content: jsonContent,
        type: 'json',
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      // parseText should not be called for JSON content
      expect(mockParseText).not.toHaveBeenCalled();
    });

    it('should not process string JSON content through whitespace normalization', async function () {
      const jsonStringContent = `{"cues": [{"startTime": 1, "endTime": 5, "text": "First subtitle"}]}`;

      const track = new TextTrack({
        kind: 'subtitles',
        label: 'Test Subtitles',
        content: jsonStringContent,
        type: 'json',
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      // parseText should not be called for JSON content
      expect(mockParseText).not.toHaveBeenCalled();
    });

    it('should handle complex SRT content with formatting and special characters', async function () {
      const complexSrtContent = `    1
    00:00:01,000 --> 00:00:05,000
    <i>Italic text</i> with special chars: éñü

    2
    00:00:06,500 --> 00:00:10,750
    Line 1
    Line 2 with <b>bold</b>

    3
    00:00:11,123 --> 00:00:15,999
    Text with "quotes" and 'apostrophes'`;

      const track = new TextTrack({
        kind: 'subtitles',
        label: 'Test Subtitles',
        content: complexSrtContent,
        type: 'srt',
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockParseText).toHaveBeenCalledWith(
        `1\n00:00:01,000 --> 00:00:05,000\n<i>Italic text</i> with special chars: éñü\n\n2\n00:00:06,500 --> 00:00:10,750\nLine 1\nLine 2 with <b>bold</b>\n\n3\n00:00:11,123 --> 00:00:15,999\nText with "quotes" and 'apostrophes'`,
        { type: 'srt' },
      );
    });
  });

  describe('edge cases for content normalization', function () {
    it('should handle tabs and mixed whitespace characters', async function () {
      const tabContent = `\t1\n\t00:00:01,000 --> 00:00:05,000\n\t  First subtitle`;

      const track = new TextTrack({
        kind: 'subtitles',
        label: 'Test Subtitles',
        content: tabContent,
        type: 'srt',
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockParseText).toHaveBeenCalledWith(
        `1\n00:00:01,000 --> 00:00:05,000\nFirst subtitle`,
        { type: 'srt' },
      );
    });

    it('should handle content with Windows line endings', async function () {
      const windowsContent = `    1\r\n    00:00:01,000 --> 00:00:05,000\r\n    First subtitle`;

      const track = new TextTrack({
        kind: 'subtitles',
        label: 'Test Subtitles',
        content: windowsContent,
        type: 'srt',
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockParseText).toHaveBeenCalledWith(
        `1\n00:00:01,000 --> 00:00:05,000\nFirst subtitle`,
        { type: 'srt' },
      );
    });

    it('should handle extremely large indentation', async function () {
      const largeIndentContent = `                                        1
                                        00:00:01,000 --> 00:00:05,000
                                        First subtitle`;

      const track = new TextTrack({
        kind: 'subtitles',
        label: 'Test Subtitles',
        content: largeIndentContent,
        type: 'srt',
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockParseText).toHaveBeenCalledWith(
        `1\n00:00:01,000 --> 00:00:05,000\nFirst subtitle`,
        { type: 'srt' },
      );
    });
  });

  describe('regression tests', function () {
    it('should ensure parseText receives normalized content for SRT with comma timestamps', async function () {
      // This tests the original issue: SRT files with comma timestamps should work
      const srtWithCommas = `    1
    00:00:01,000 --> 00:00:05,000
    First subtitle

    2
    00:00:06,500 --> 00:00:10,750
    Second subtitle`;

      const track = new TextTrack({
        kind: 'subtitles',
        label: 'Test Subtitles',
        content: srtWithCommas,
        type: 'srt',
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      // Verify that parseText is called with properly normalized content
      expect(mockParseText).toHaveBeenCalledWith(
        `1\n00:00:01,000 --> 00:00:05,000\nFirst subtitle\n\n2\n00:00:06,500 --> 00:00:10,750\nSecond subtitle`,
        { type: 'srt' },
      );

      // Verify parseText was called exactly once
      expect(mockParseText).toHaveBeenCalledTimes(1);
    });

    it('should work correctly with VTT content that has period timestamps', async function () {
      const vttWithPeriods = `    WEBVTT

    1
    00:00:01.000 --> 00:00:05.000
    First subtitle

    2
    00:00:06.500 --> 00:00:10.750
    Second subtitle`;

      const track = new TextTrack({
        kind: 'subtitles',
        label: 'Test Subtitles',
        content: vttWithPeriods,
        type: 'vtt',
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockParseText).toHaveBeenCalledWith(
        `WEBVTT\n\n1\n00:00:01.000 --> 00:00:05.000\nFirst subtitle\n\n2\n00:00:06.500 --> 00:00:10.750\nSecond subtitle`,
        { type: 'vtt' },
      );
    });
  });
});
