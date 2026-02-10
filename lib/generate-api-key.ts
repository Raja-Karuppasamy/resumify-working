import crypto from 'crypto'

export function generateApiKey(): string {
  // Generate a secure random API key
  const randomBytes = crypto.randomBytes(32)
  const apiKey = `rfy_${randomBytes.toString('hex')}`
  return apiKey
}