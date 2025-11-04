// import { FLAGS } from '@/config/featureFlags';
import { FLAGS } from '../../config/featureFlags';
import { generateMock } from './mockOpenAI';

export async function generateAI(type: 'price'|'copy'|'message', prompt: string) {
  if (!FLAGS.USE_AI) return generateMock(type, prompt);
  // Ramo reale (opzionale): per MVP-dev teniamo il mock
  return generateMock(type, prompt);
}
