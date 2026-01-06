import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleService {
  private ai: GoogleGenerativeAI;

  constructor() {
    this.ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  async generateEmbedding(text: string) {
    const model = this.ai.getGenerativeModel({
      model: 'text-embedding-004',
    });

    try {
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error('Gemini Embedding Error:', error.message);
      throw error;
    }
  }

  async generateAnswer(question: string, context: string) {
    const model = this.ai.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });

    const prompt = `
      You are an AI assistant helping a user understand a YouTube video. 
      Answer the question based ONLY on the provided transcript context.
      
      CONTEXT:
      ${context}
      
      USER QUESTION:
      ${question}
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}
