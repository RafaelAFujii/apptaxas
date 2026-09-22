import { expect, it } from 'vitest';
import { canDisplayMicrotraining } from './microtraining.js';

it('only displays published microtraining', () => {
  expect(
    canDisplayMicrotraining({
      id: '1',
      title: 'Arrival',
      summary: 'Quick',
      contentReference: 'speckit://1',
      durationSeconds: 60,
      status: 'published',
    }),
  ).toBe(true);
  expect(
    canDisplayMicrotraining({
      id: '2',
      title: 'Draft',
      summary: 'Quick',
      contentReference: 'speckit://2',
      durationSeconds: 60,
      status: 'draft',
    }),
  ).toBe(false);
});
