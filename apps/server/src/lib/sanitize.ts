import sanitizeHtml from 'sanitize-html'

export function sanitizeContent(content: string): string {
  return sanitizeHtml(content, {
    allowedTags: [],        // strip all HTML tags entirely
    allowedAttributes: {},  // strip all attributes
  }).trim()
}