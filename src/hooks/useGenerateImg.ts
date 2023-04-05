import useSWRImmutable from 'swr';

import { generateImg } from '@/api/chat';

// 왜 immutable이 제대로 동작하지 않는것 같지...
export const useGenerateImg = (value: string) => {
  const endpoint = '/images/generations';
  return useSWRImmutable<string>(endpoint, () => generateImg(endpoint, value), {
    revalidateOnMount: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
}