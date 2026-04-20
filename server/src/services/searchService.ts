import axios from 'axios';
import { env } from '../config/env';

export class SearchService {
  /**
   * Performs a Google Search and returns formatted snippets to be injected as RAG context.
   */
  static async performGrounding(query: string) {
    if (!env.GOOGLE_SEARCH_API_KEY || !env.GOOGLE_SEARCH_CX) {
      console.warn("Search API keys missing. Returning mocked grounding data.");
      return `[LIVE GOOGLE SEARCH CONTEXT]\n- Google Search (Mock): Found 3 related articles for "${query}" regarding recent developments.\n[/CONTEXT]`;
    }

    try {
      const url = `https://www.googleapis.com/customsearch/v1?key=${env.GOOGLE_SEARCH_API_KEY}&cx=${env.GOOGLE_SEARCH_CX}&q=${encodeURIComponent(query)}&num=3`;
      const response = await axios.get(url);
      
      if (!response.data.items || response.data.items.length === 0) {
         return "[LIVE GOOGLE SEARCH CONTEXT]\nNo recent information found.\n[/CONTEXT]";
      }
      
      const snippets = response.data.items.map((i: any) => `- ${i.title}: ${i.snippet}`).join('\n');
      return `[LIVE GOOGLE SEARCH CONTEXT]\n${snippets}\n[/CONTEXT]`;
    } catch (error) {
      console.error('Search API failed:', error);
      throw new Error('Grounding search failed during external API request.');
    }
  }
}
