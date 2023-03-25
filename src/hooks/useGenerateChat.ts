import useSWR from 'swr';

import { generateChat } from "@/api/chat"

export const useGenerateChat = (value: string) => {
  return useSWR<string>('generateChat', () => generateChat(value), {
    revalidateOnMount: false,
  });
}