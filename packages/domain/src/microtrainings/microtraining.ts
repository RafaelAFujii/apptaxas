export type Microtraining = {
  id: string;
  title: string;
  summary: string;
  contentReference: string;
  durationSeconds: number;
  status: 'draft' | 'published' | 'archived';
};

export function canDisplayMicrotraining(training: Microtraining): boolean {
  return training.status === 'published';
}
