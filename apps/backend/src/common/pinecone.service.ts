import { Pinecone } from '@pinecone-database/pinecone';
import { Injectable } from '@nestjs/common';
import { Chunks } from 'src/types';

@Injectable()
export class PineconeService {
  private p: Pinecone;
  constructor() {
    this.p = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }

  getIndex() {
    return this.p.index(process.env.PINECONE_INDEX_NAME!);
  }

  async upsertTranscript(chunks: Chunks[]) {
    const index = this.getIndex();
    await index.upsert(chunks);
  }

  async queryByVector(vector: number[], videoId: string) {
    const index = this.getIndex();
    return await index.query({
      vector,
      topK: 5,
      includeMetadata: true,
      filter: {
        videoId: {
          $eq: videoId,
        },
      },
    });
  }
}
