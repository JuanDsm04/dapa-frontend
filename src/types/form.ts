export interface QuestionOption {
  id: number
  questionId?: number
  option: string
}

export interface QuestionType {
  id: number
  type: string
}

export interface Question {
  id: number;
  question: string;
  description?: string | null;
  type: QuestionType
  options?: QuestionOption[];
  isActive: boolean;
  position: number;
}

export interface Answer {
  id: number;
  submissionId: number;
  question: Question;
  answer?: string;
  questionOptions?: QuestionOption[];
}

export interface Submission {
  id: number;
  submittedAt: string;
  status: 'pending' | 'cancelled' | 'approved';
  answers: Answer[];
}

export interface SubmissionStats {
  totalSubmissions: number;
  submissionsByStatus: { status: string; count: number }[];
  answersByQuestion: { questionId: number; optionId: number; count: number }[];
}