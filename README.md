# 핵심 기능

각각의 페이지는 다음과 같은 공통되는 핵심 기능들이 있습니다. 

### 유저에게 정보를 입력받음

유저들에게 정보를 입력받기 위해 form을 사용하였습니다. 

제가 사용한 ui library인 antd에서는 기본적으로 form을 관리할 수 있도록 해주기 때문에 아래 코드에서와 같이 form 관련 데이터를 한번에 관리할 수 있었습니다. 

```jsx
//example
import { Form } from 'antd';

const [form] = Form.useForm();

// form 
<Form form={form} name="form_item_path" layout="vertical" onFinish={handleFinish} >
  <div>
    <Button size="small" onClick={handleClickExample}>예시 텍스트</Button>
    <Button size="small" onClick={handleClickDeleteAll}>전체 지우기</Button>
  </div>
  <FormItemGroup prefix={['first_question']}>
    <Form.Item name="department" label={<Title level={5}>지원 학과</Title>}>
      <Input placeholder='컴퓨터공학과' required />
    </Form.Item>
    <Form.Item name="experience" label={<Title level={5}>진로와 관련된 학습 경험 혹은 교내 활동</Title>}>
      <Input placeholder='IT 창업 동아리를 만들고, 1년동안 운영자로 활동하였음' required />
    </Form.Item>
    <Form.Item name="learning" label={<Title level={5}>배운 점</Title>}>
      <Input placeholder='조직을 이룸을 통해, 혼자서는 이뤄낼 수 없는 성과를 이뤄낼 수 있었음' required />
    </Form.Item>
  </FormItemGroup>
  <Button type="primary" htmlType="submit" loading={isMutating} block>
    자동 생성
  </Button>
</Form>

const handleFinish = async (value: OnFinishProps) => {
  // form 데이터를 한번에 관리
  const { department, experience, learning } = value;
  const chat = `something`;

  const res = await trigger(chat);
    
  if (!res) {
    return;
  }
  
  setEditorText(res);
};
```

### chat gpt를 활용한 자소서 생성

유저에게 받은 데이터를 rest api를 통해 서버와 통신하였습니다. 

(chat gpt rest api docs: https://platform.openai.com/docs/api-reference/chat/create)

http 통신 라이브러리인 axios와 서버 상태 관리 라이브러리인 swr을 활용하였습니다. 

```jsx
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
const { trigger, isMutating, error } = useSWRMutation(endPoint, generateChat);

// 생성하기 클릭시 실행되는 함수 
const handleFinish = async (value: OnFinishProps) => {
  // form 데이터를 한번에 관리
  const { department, experience, learning } = value;
  const chat = `something`;

  const res = await trigger(chat);
    
  if (!res) {
    return;
  }
  
  setEditorText(res);
};
```

### 예시 텍스트 생성 및 삭제

사용자로 하여금 더 빠르게 저희 앱을 사용해볼 수 있도록 “예시 텍스트” 및 “전체 비우기” 버튼 클릭시에 예시 텍스트 채우기 및 삭제를 할 수 있도록 제공하였습니다. 이 또한 Form을 통해 간단하게 할 수 있었습니다. 

```jsx
const handleClickExample = () => {
  form.setFieldsValue({ 
    department: '컴퓨터공학과', 
    experience: 'IT 창업 동아리를 만들고, 1년동안 운영자로 활동하였음', 
    learning: "조직을 이룸을 통해, 혼자서는 이뤄낼 수 없는 성과를 이뤄낼 수 있었음",
  });
};

const handleClickDeleteAll = () => {
  form.resetFields();
};
```

### 에디터

에디터는 기본적으로 react-quill이라는 라이브러리를 통해 구현하였습니다. react-quill을 선택한 이유는 다른 라이브러리에 비해서 사용하는 사람이 커스텀할 여지가 많기 때문입니다. 

```jsx
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import ('react-quill'), {
  ssr: false
});

<ReactQuill theme="snow" value={editorText} onChange={handleChangeEditor} />
```

### 문장 다듬기

문장 다듬기의 경우 chat gpt rest api를 다시 활용하였습니다. 

```jsx
<Button type="primary" size="small" onClick={handleClickRefine} loading={isMutating}>
  문장 다듬기
</Button>

const handleClickRefine = async () => {
  const chat = `${editorText} 이 글이 자연스럽게 읽히도록 다시 써줘`;

  const res = await trigger(chat);
      
  if (!res) {
    return;
  }
    
  setEditorText(res);
};
```

### 문장 강조하기

문장 강조하기는 다음의 두가지 쟁점이 있습니다. 

1. 에디터 안에 드래그 한 텍스트를 가져오기 
2. 사용자가 드래그를 마친 위치에 floating buttong 띄우기 

먼저 첫 번째 문제를 해결하기 위해서, window.getSelection method를 통해서, 사용자가 드래그한 정보를 가져올 수 있었습니다. 

그리고, 두 번째 문제를 해결하기 위해서, mouseUp event를 활용하였습니다. 사용자가 editor 안에서 마우스를 up 하는 순간, 커서의 위치를 가져와 그곳에 floating button을 띄우는 방식을 사용하였습니다. 

```jsx
const [mousePosition, setMousePosition] = useState<{x: number, y:number}>({x: 0, y: 0});

const handleMouseUp = (event: MouseEvent) => {
  const selection = window.getSelection();

  if (!selection || !editorRef.current) {
    return;
  }

  if (selection.toString().length > 0 && editorRef.current.contains(selection?.anchorNode)) {
    setMousePosition({x: event.clientX + 5, y: event.clientY - 30})
    setIsEmphasizeVisible(true);
    setEmphasizeSentence(selection.toString());
    return;
  }

  setIsEmphasizeVisible(false);
};

const handleClickEmphasize = async () => {
  const chat = `${editorText} 이 자기소개서 글에서, ${emphasizeSentence} 이 부분이 핵심이야. 따라서, 해당 부분을 반복해서 강조해서 자기소개서를 다시 써줘. 
    실제로 학교에 제출할 수 있게 정돈해서 써줘야돼.`;

  setIsEmphasizeVisible(false);

  const res = await trigger(chat);
    
  if (!res) {
    return;
  }
  
  setEditorText(res);
};

<div ref={editorRef} onMouseUp={handleMouseUp}>
  <ReactQuill theme="snow" value={editorText} onChange={handleChangeEditor} />
</div>

<Portal selector="root" position={{top: mousePosition.y, left: mousePosition.x}}>
  <Button type='primary' size="small" onClick={handleClickEmphasize}>강조하기</Button>
</Portal>
```

### 호버를 통한 가이드라인 제공

특정 아이콘 hover시 tooltip 메세지를 제공하기 위해, 이번에 사용한 antd 라이브러리를 통해 구현하였습니다. 

```jsx
import { Tooltip } from "antd";

<Tooltip title="대학에서 어떤 지식이나 능력을 습득하고 싶은지에 대해 구체적으로 적을수록 좋아요" >
  <QuestionCircleOutlined style={{position: "absolute", left: "310px", top: "5px"}} />
</Tooltip>
```

# 프롬프트 짜보기

각각의 문항에 해당하는 프롬프트를 짜려는 시도를 했습니다. 

그러나 open ai에서 프롬프트를 짜기 위한 토큰을 4096token으로 제한하고 있었습니다. 

자소서 작성 프롬프트의 경우에는 예시가 길면서, 많은 토큰을 필요로 합니다. 따라서, 프롬프트를 짜는데 제한이 있었습니다. 

그러나, temperature와 top_p, top_k와 같은 값을 조정함에 따라 프롬프트의 성향이 달라진다는 것을 배울 수 있었습니다. 

```jsx
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
```

# Fine Tuning 해보기

프롬프트는 토큰의 제한이 있었습니다. 따라서 만약 모델을 직접 만들 수 있다면 프롬프트에 사용되는 토큰을 아낄 수 있고, 더 많은 예시 데이터를 학습시킬 수 있음에 따라 좋은 퀄리티의 결과를 얻을 수 있다고 생각했습니다. 

따라서, 

https://platform.openai.com/docs/guides/fine-tuning

open ai docs에서 제시하는 fine-tuning하는 방법을 따라해보았습니다. 

1. installation

```jsx
pip install --upgrade openai
```

1. prepare training data

```jsx
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
...
```

1. cli data preparation tool

```jsx
openai tools fine_tunes.prepare_data -f <LOCAL_FILE>
```

![스크린샷 2023-06-07 오후 9 11 18](https://github.com/Na-hyunwoo/write-now/assets/22545843/cff478c4-2582-4cb8-a789-cdb05e2f3f8d)

긴 글의 데이터를 jsonl 데이터로 변환하는 것이 굉장히 큰 공수였습니다. open ai에서는 fine-tuned된 모델을 만들기 위해서 최소 수백개의 데이터를 입력하는 것을 추천했지만, 현실적으로 무리가 있었습니다. 그래서 소량의 데이터만을 넣었습니다. 

1. create a fine-tuned model

```jsx
openai api fine_tunes.create -t <TRAIN_FILE_ID_OR_PATH> -m <BASE_MODEL>
```

![스크린샷 2023-06-07 오후 9 11 31](https://github.com/Na-hyunwoo/write-now/assets/22545843/5e5e7fce-3410-4c48-8bf8-3e60c84923ab)

성공적으로 모델을 만들 수 있었습니다. 

그러나, 충분한 양의 데이터를 활용하지 못함에 따라서, 좋은 퀄리티의 모델이 만들어지지 못해 제품에 녹여내기엔 문제가 있다고 판단했습니다. 

이후에는 양질의 데이터를 추려내서, 충분한 양의 데이터를 제공한다면 더 좋은 퀄리티의 모델을 만들 수 있을 것을 기대할 수 있었습니다.
