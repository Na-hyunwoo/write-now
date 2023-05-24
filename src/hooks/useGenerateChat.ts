import useSWRMutation from 'swr';

import { generateChat } from "@/api/chat"

export const useGenerateChat = (value: string) => {
  const endpoint = '/chat/completions';

  return useSWRMutation<string>(endpoint, () => generateChat(endpoint, {arg: value}), {
    revalidateOnMount: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
}