import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface IResponse {
  result?: any;
  error?: { 
    message?: string,
  };
}

/**
 * 커스텀 프롬프트를 도입하기 위한 시험
 * 그러나, 4096 token의 제한으로 도입하지 못했습니다. 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<IResponse>) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const arg = req.body.arg;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePromptAboutFirstQuestion({...arg}),
      temperature: 0.6,
      max_tokens: 3500,
    });

    console.log(completion)

    res.status(200).json({ result: completion.data });
  } catch(error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
};

interface GeneratePromptAboutFirstQuestionProps {
  department: string;
  experience: string;
  learning: string;
};

const generatePromptAboutFirstQuestion = ({ department, experience, learning}: GeneratePromptAboutFirstQuestionProps) => {
  return `내가 대학교에 진학하기 위해서 자기소개서를 작성해야 돼 질문은 다음과 같아. 고등학교 재학 기간 중 자신의 진로와 관련하려 어떤 노력을 해왔는지 본인에게 의미 있는 학습 경험과 교내 활동을 중심으로 기술해 주시기 바랍니다. 내가 너에게 정보들을 줄테니까, 이 정보들을 바탕으로 위에서 말한 질문에 대한 답변을 적어줘. 

정보: 지원하고자 하는 학과는 ${department}이다. ${experience}와 같은 진로와 관련된 학습 경험 혹은 교내 활동을 하였다. ${learning}는 것을 배웠다. 
답변:`;
};
