import axios from "axios";

const api_url = process.env.NEXT_PUBLIC_GOOGLE_API_URL;
const key = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATION_API_KEY;

export const getTranslate = async (value: string): Promise<string> => {
  const url = api_url + `/language/translate/v2?q=${value}&target=en&key=${key}`;
  const response = await axios.post(url);
  
  console.log(response.data.data.translations[0].translatedText);

  return response.data.data.translations[0].translatedText;
}

