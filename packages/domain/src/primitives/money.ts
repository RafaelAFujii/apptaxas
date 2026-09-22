export function assertNonNegativeCents(value: number): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error('valueCents must be a non-negative integer');
  }
  return value;
}
