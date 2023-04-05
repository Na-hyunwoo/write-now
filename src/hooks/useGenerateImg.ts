import useSWRImmutable from 'swr';

import { generateImg } from '@/api/chat';

export const useGenerateImg = (value: string) => {
  const endpoint = '/images/generations';
  return useSWRImmutable<string>(endpoint, () => generateImg(endpoint, value));
}