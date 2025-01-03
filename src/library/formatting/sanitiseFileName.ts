export function sanitiseFileName(fileName: string): string {
  const withoutExtension = fileName.substring(0, fileName.lastIndexOf('.'))
  const lowercase = withoutExtension.toLowerCase()
  const withoutSpaces = lowercase.replace(/\s+/g, '-')
  const withoutSpecialCharacters = withoutSpaces
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return withoutSpecialCharacters || 'unnamed-file'
}

export default function sanitiseString(message: string): string {
  if (!message) return ''
  const stringMessage = String(message)
  const normalized = stringMessage.trim().replace(/\s+/g, ' ')
  const sanitized = normalized
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control/invisible characters
    .replace(/[\u2018\u2019]/g, "'") // Convert curly single quotes to straight quotes
    .replace(/[\u201C\u201D]/g, '"') // Convert curly double quotes to straight quotes
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/[!?.]{3,}/g, '...') // Replace 3+ punctuation marks with ellipsis
  return sanitized || ''
}
