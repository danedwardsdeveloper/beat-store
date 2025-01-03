export function createParagraph(content: string, weight: 'normal' | 'semibold' = 'normal'): string {
  return `<p style="margin-bottom: 16px; font-size: 16px; line-height: 1.5; font-weight: ${weight === 'semibold' ? '600' : '400'};">${content}</p>`
}
