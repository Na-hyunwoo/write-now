import uswSWRMutation from 'swr';

import { generateChat } from "@/api/chat"

export const useGenerateChat = (value: string) => {
  return uswSWRMutation<string>('generateChat', () => generateChat(value), {
    revalidateOnMount: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
}