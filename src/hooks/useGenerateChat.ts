import uswSWRMutation from 'swr';

import { generateChat } from "@/api/chat"

export const useGenerateChat = (value: string) => {
  const endpoint = '/chat/completions';

  return uswSWRMutation<string>(endpoint, () => generateChat(endpoint, value), {
    revalidateOnMount: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
}