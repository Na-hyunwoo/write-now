import axios from 'axios';

const api_url = process.env.NEXT_PUBLIC_API_URL as string;

export const generateChat = async(input: string): Promise<string> => {
  const url = api_url + '/chat/completions';

  const response = await axios.post(url, {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user", "content": input
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

export const generateImg = async(input?: string): Promise<string> => {
  const url = api_url + '/images/generations'

  const response = await axios.post(url, {
    "prompt": input,
    "n": 1,
    "size": "256x256"
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
    }
  })

  return response.data.data[0].url;
}