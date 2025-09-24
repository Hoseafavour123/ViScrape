


export function extractJsonString(text: string): string {
  // Strip code fences like ```json ... ```
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (fenceMatch) {
    return fenceMatch[1]
  }
  return text.trim()
}

export function safeParseJson<T = any>(text: string): T | null {
  try {
    return JSON.parse(extractJsonString(text))
  } catch {
    return null
  }
}
