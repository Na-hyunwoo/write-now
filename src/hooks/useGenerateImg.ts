import useSWR from 'swr';

import { generateImg } from '@/api/chat';

export const useGenerateImg = (value?: string) => {
  return useSWR<string>('generateImg', () => generateImg(value));
}