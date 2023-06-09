import axios from 'axios';
import { getTranslate } from './translate';

const api_url = process.env.NEXT_PUBLIC_OPENAI_API_URL as string;

export const generateChat = async(url: string, { arg }: { arg: string }): Promise<string> => {
  const _url = api_url + url;
  
  const response = await axios.post(_url, {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user", "content": arg
      },
    ]
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
    },
  });

  return response.data.choices[0].message.content;
}

export const generateImg = async(url: string, input: string): Promise<string> => {
  const translatedInput = await getTranslate(input);

  const _url = api_url + url;
  const response = await axios.post(_url, {
    "prompt": translatedInput,
    "n": 1,
    "size": "256x256"
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
    }
  })

  console.log(translatedInput);

  return response.data.data[0].url;
}