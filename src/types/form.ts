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
}

