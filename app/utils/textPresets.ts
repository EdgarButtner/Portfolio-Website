import type { CSSProperties } from 'react';

/**
 * A bordered text preset 
 * 
 * @param innerColor  Color for the text fill
 * @param outerColor  Color for the outline
 * @param textSize    Tailwind text-size suffix
 * @param strokeWidth Outline thickness in px 
 * @param fontWeight  Tailwind font-weight class
 * @param font        Tailwind font-family class
 * @param extraClasses Any additional Tailwind classes to append
 */

function isRawCssColor(color: string): boolean {
  return (
    color.startsWith('#') ||
    color.startsWith('rgb') ||
    color.startsWith('hsl') ||
    color.startsWith('var(')
  );
}

function normalizeToken(color: string): string {
  return color.startsWith('text-') ? color.slice(5) : color;
}

function resolveTextClass(color: string): string {
  const c = normalizeToken(color);
  return isRawCssColor(c) ? `text-[${c}]` : `text-${c}`;
}

function resolveShadowColor(color: string): string {
  const c = normalizeToken(color);
  if (isRawCssColor(c)) return c;
  return `var(--${c}, ${c})`;
}

export function outlinedText(
  innerColor: string,
  outerColor: string,
  textSize: string,
  strokeWidth: number = 2,
  fontWeight: string = 'font-extrabold',
  font: string = '',
  extraClasses: string = ''
): { className: string; style: CSSProperties } {
  const w = strokeWidth;

  const offsets: [number, number][] = [
    [ w,  w],
    [-w,  w],
    [ w, -w],
    [-w, -w],
    [ w,  0],
    [-w,  0],
    [ 0,  w],
    [ 0, -w],
  ];

  const shadowColor = resolveShadowColor(outerColor);
  const textShadow = offsets
    .map(([x, y]) => `${x}px ${y}px 0 ${shadowColor}`)
    .join(', ');

  const parts = [
    `text-${textSize}`,
    fontWeight,
    font,
    resolveTextClass(innerColor),
    extraClasses,
  ].filter(Boolean);

  return {
    className: parts.join(' '),
    style: { textShadow },
  };
}
