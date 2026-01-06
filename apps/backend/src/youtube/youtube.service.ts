import { BadRequestException, Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Innertube, UniversalCache } from 'youtubei.js';

@Injectable()
export class YoutubeService {
  private yt: Innertube | null = null;

  async getInnertube() {
    if (!this.yt) {
      this.yt = await Innertube.create({ 
        cache: new UniversalCache(false),
        generate_session_locally: true 
      });
    }
    return this.yt;
  }

  extractVideoId(url: string): string {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    if (!match) {
      throw new BadRequestException('Invalid youtube URL');
    }
    return match[1];
  }

  async getTranscript(videoId: string): Promise<string> {
    try {
      const yt = await this.getInnertube();
      const info = await yt.getInfo(videoId);
      
      console.log(`[YoutubeService] Attempting transcript fetch for ${videoId}`);

      // Method 1: Formal Innertube getTranscript
      try {
        const transcriptData = await info.getTranscript();
        if (transcriptData?.transcript?.content?.body?.initial_segments) {
          return transcriptData.transcript.content.body.initial_segments
            .map((s: any) => s.snippet?.text || '')
            .join(' ');
        }
      } catch (e) {
        console.warn(`[YoutubeService] Innertube getTranscript failed: ${e.message}`);
      }

      // Method 2: Manually scrape from Player Response (Captions API)
      const captionTracks = info.captions?.caption_tracks;
      if (captionTracks && captionTracks.length > 0) {
        const track = captionTracks.find((t: any) => t.language_code === 'en') || captionTracks[0];
        console.log(`[YoutubeService] Found track: ${track.language_code}. Fetching XML...`);
        
        try {
          const response = await fetch(track.base_url, {
             headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36' }
          });
          const xml = await response.text();
          if (xml && xml.length > 0) {
             const textRegex = /<text.*?>(.*?)<\/text>/g;
             const parts: string[] = [];
             let m: RegExpExecArray | null;
             while ((m = textRegex.exec(xml)) !== null) {
               if (m[1]) {
                 parts.push(m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
               }
             }
             if (parts.length > 0) return parts.join(' ');
          }
        } catch (err) {
           console.warn(`[YoutubeService] Manual XML fetch failed: ${err.message}`);
        }
      }

      // Method 3: If no transcript, use Video Description as a last-resort knowledge base
      if (info.basic_info.short_description) {
        console.log(`[YoutubeService] No transcript found. Using description as fallback Context.`);
        return `VIDEO DESCRIPTION:\n${info.basic_info.short_description}`;
      }

      return '';
    } catch (error) {
      console.warn(`[YoutubeService] Global failure for ${videoId}:`, error.message);
      return '';
    }
  }

  async getVideoInfo(videoId: string) {
    try {
      const yt = await this.getInnertube();
      const info = await yt.getInfo(videoId);
      return {
        title: info.basic_info.title,
        description: info.basic_info.short_description,
      };
    } catch (e) {
      console.warn(`[YoutubeService] getVideoInfo failed for ${videoId}:`, e.message);
      try {
          const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, {
              headers: { 'User-Agent': 'Mozilla/5.0' }
          });
          if (response.ok) return await response.json();
      } catch (err) {}
    }
    return null;
  }

  async spiltText(text: string): Promise<string[]> {
    const split = new RecursiveCharacterTextSplitter({
      chunkOverlap: 200,
      chunkSize: 1000,
    });
    return await split.splitText(text);
  }
}
