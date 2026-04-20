import axios from 'axios';
import { env } from '../config/env';

export class SafetyService {
  /**
   * Analyzes text for toxicity using the Google Perspective (Jigsaw) API.
   * Returns a score out of 100.
   */
  static async analyzeToxicity(text: string) {
    if (!env.GOOGLE_PERSPECTIVE_API_KEY) {
      console.warn("Perspective API key missing. Returning mocked safety score.");
      return { toxicity: Math.floor(Math.random() * 15) }; // Safe mock
    }

    try {
      const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${env.GOOGLE_PERSPECTIVE_API_KEY}`;
      const data = {
        comment: { text },
        languages: ['en'],
        requestedAttributes: { TOXICITY: {} }
      };
      
      const response = await axios.post(url, data);
      const toxicityScore = response.data.attributeScores.TOXICITY.summaryScore.value * 100;
      return { toxicity: Math.round(toxicityScore) };
    } catch (error) {
      console.error('Perspective API failed:', error);
      throw new Error('Safety audit failed during text analysis.');
    }
  }
}
