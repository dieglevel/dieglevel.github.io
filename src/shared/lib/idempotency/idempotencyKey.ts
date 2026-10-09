/**
 * Idempotency Key Utilities
 *
 * The FE generates a UUID v4 per user-initiated mutation action.
 * The key is:
 *   1. Generated once per user action (e.g. on form open or on submit).
 *   2. Stored transiently (not persisted between sessions).
 *   3. Attached as the `Idempotency-Key` HTTP header on every mutation request.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Usage patterns:
 *
 *   // Generate once when the form opens → stable across retries
 *   const key = generateIdempotencyKey()
 *
 *   // Pass to the mutation
 *   mTransaction_Create.mutate({ body: dto, idempotencyKey: key })
 *
 *   // Regenerate if you want a completely new transaction (e.g. "Save Another")
 *   const freshKey = generateIdempotencyKey()
 * ────────────────────────────────────────────────────────────────────────────
 */

/**
 * Generate a cryptographically-random UUID v4.
 *
 * Uses the browser's `crypto.randomUUID()` when available (all modern browsers
 * and Node ≥ 19). Falls back to a manual RFC-4122 implementation for older
 * environments (Jest, Node 18, etc.).
 */
export function generateIdempotencyKey(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  // RFC 4122 compliant UUID v4 fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Validate that a string looks like a UUID v4.
 * Useful for asserting keys before sending.
 */
export function isValidUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  )
}
