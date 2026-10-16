'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface MarkdownTextProps {
  content: string;
}

/**
 * Formats inline bold (**text**) and italic (*text*)
 */
function renderInlineFormatting(text: string): React.ReactNode[] {
  // Split on bold (**...**)
  const boldTokens = text.split(/(\*\*[^*]+\*\*)/g);

  return boldTokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      const inner = token.slice(2, -2);
      return (
        <strong key={i} style={{ fontWeight: 700 }}>
          {renderItalics(inner, i)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{renderItalics(token, i)}</React.Fragment>;
  });
}

function renderItalics(text: string, parentKey: number | string): React.ReactNode[] {
  // Split on italic (*...*)
  const italicTokens = text.split(/(?<!\*)\*([^*]+)\*(?!\*)/g);

  return italicTokens.map((token, j) => {
    if (j % 2 === 1) {
      return (
        <em key={`${parentKey}-${j}`} style={{ fontStyle: 'italic' }}>
          {token}
        </em>
      );
    }
    return <React.Fragment key={`${parentKey}-${j}`}>{token}</React.Fragment>;
  });
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({ content }) => {
  if (!content) return null;

  // Defensive JSON error cleaning for rate limits / raw API exceptions
  if (content.includes('{"error"') || content.includes('"RESOURCE_EXHAUSTED"')) {
    if (content.includes('429') || content.includes('RESOURCE_EXHAUSTED') || content.includes('Quota exceeded')) {
      return (
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#ef4444',
            fontSize: '0.84rem',
            lineHeight: 1.5,
          }}
        >
          <strong>Rate Limit Notice:</strong> Google Gemini free-tier rate limit was reached. Please wait 30 seconds and ask your question again.
        </Box>
      );
    }
  }

  const lines = content.split('\n');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
          return <Box key={idx} sx={{ height: 6 }} />;
        }

        // Heading 3 (### )
        if (trimmed.startsWith('### ')) {
          return (
            <Typography
              key={idx}
              variant="subtitle2"
              sx={{ fontWeight: 800, mt: 1, mb: 0.25, color: 'inherit' }}
            >
              {renderInlineFormatting(trimmed.slice(4))}
            </Typography>
          );
        }

        // Heading 2 (## )
        if (trimmed.startsWith('## ')) {
          return (
            <Typography
              key={idx}
              variant="subtitle1"
              sx={{ fontWeight: 800, mt: 1, mb: 0.25, color: 'inherit' }}
            >
              {renderInlineFormatting(trimmed.slice(3))}
            </Typography>
          );
        }

        // Bullet list item (* or - )
        if (/^[-*]\s+/.test(trimmed)) {
          const itemText = trimmed.replace(/^[-*]\s+/, '');
          return (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                ml: 0.5,
                my: 0.15,
                lineHeight: 1.4,
              }}
            >
              <Box
                component="span"
                sx={{
                  color: 'primary.main',
                  fontSize: '1rem',
                  lineHeight: 1.2,
                  userSelect: 'none',
                }}
              >
                •
              </Box>
              <Box component="span" sx={{ flexGrow: 1 }}>
                {renderInlineFormatting(itemText)}
              </Box>
            </Box>
          );
        }

        // Numbered list item (1. )
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
          const num = numberedMatch[1];
          const itemText = numberedMatch[2];
          return (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                ml: 0.5,
                my: 0.15,
                lineHeight: 1.4,
              }}
            >
              <Box
                component="span"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  fontSize: '0.85rem',
                  minWidth: 16,
                }}
              >
                {num}.
              </Box>
              <Box component="span" sx={{ flexGrow: 1 }}>
                {renderInlineFormatting(itemText)}
              </Box>
            </Box>
          );
        }

        // Regular paragraph
        return (
          <Typography
            key={idx}
            component="p"
            variant="body2"
            sx={{
              lineHeight: 1.5,
              m: 0,
              fontSize: '0.9rem',
              color: 'inherit',
            }}
          >
            {renderInlineFormatting(line)}
          </Typography>
        );
      })}
    </Box>
  );
};
