export type ActiveTab = 'assistant' | 'app' | 'books' | 'feedback' | 'suggest' | 'collab' | 'faq' | 'admin';

export interface AppIssueForm {
  name: string;
  email: string;
  appName: string;
  deviceBrowser: string;
  whatHappened: string;
  errorCode: string;
  frequency: string;
}

export interface BookQuestionForm {
  name: string;
  email: string;
  series: string;
  questionType: string;
  question: string;
}

export interface FeedbackForm {
  name: string;
  email: string;
  subject: string;
  feedbackType: string;
  message: string;
  rating: number;
}

export interface SuggestionForm {
  name: string;
  email: string;
  suggestionFor: string;
  suggestion: string;
  credit: string;
}

export interface CollabForm {
  name: string;
  email: string;
  website: string;
  inquiryType: string;
  proposal: string;
  audienceSize: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category: 'quick-fixes' | 'app-issues' | 'books' | 'general';
}
