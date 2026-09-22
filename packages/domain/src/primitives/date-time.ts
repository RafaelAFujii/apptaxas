export function assertFutureDate(value: Date, now = new Date()): Date {
  if (value.getTime() <= now.getTime()) {
    throw new Error('date must be in the future');
  }
  return value;
}
