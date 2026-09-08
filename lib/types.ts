export type Work = {
  id: string;
  number: number;
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  difficulty: number | null;
  interviewRound: string | null;
  question: string;
  analysis: string;
  answer: string;
  pitfall: string;
  tips: string;
  xiaohongshuUrl: string | null;
  quickNoteUrl: string | null;
  sourceDocumentReference: string;
  updatedAt: string;
  featured: boolean;
  mindMaps?: Array<{ src: string; alt: string; width: number; height: number }>;
  mindMapCorrection?: { title: string; content: string };
  supplementalResources?: Array<{
    title: string;
    description: string;
    url: string | null;
    sourceUrl: string | null;
  }>;
};

export type GuestbookPayload = {
  displayName: string;
  message: string;
  feedbackType?: string;
  rating?: number;
  email?: string;
  website?: string;
};
