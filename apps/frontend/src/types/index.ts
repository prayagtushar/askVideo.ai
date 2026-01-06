export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  videoId: string;
  messages: Message[];
  createdAt: string;
}

export interface CreateSessionResponse {
  id: string;
  videoId: string;
}
