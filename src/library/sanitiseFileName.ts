export default function sanitiseFileName(fileName: string): string {
  const withoutExtension = fileName.substring(0, fileName.lastIndexOf('.'))
  const lowercase = withoutExtension.toLowerCase()
  const withoutSpaces = lowercase.replace(/\s+/g, '-')
  const withoutSpecialCharacters = withoutSpaces
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return withoutSpecialCharacters || 'unnamed-file'
}
