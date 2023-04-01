import useSWRImmutable from 'swr';

import { generateImg } from '@/api/chat';

export const useGenerateImg = (value?: string) => {
  return useSWRImmutable<string>('generateImg', () => generateImg(value));
}