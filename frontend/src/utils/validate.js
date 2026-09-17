const ALLOWED = ["image/jpeg", "image/png", "image/webp"]
const MAX = 10 * 1024 * 1024
export function validateImageFile(file) {
  if (!file) return "No file selected."
  if (!ALLOWED.includes(file.type)) return "Use JPEG, PNG, or WebP."
  if (file.size > MAX) return "Image exceeds 10MB."
  if (file.size === 0) return "Empty file."
  return null
}
