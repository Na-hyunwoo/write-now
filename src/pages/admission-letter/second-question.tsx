import dynamic from 'next/dynamic';
import { createContext, useContext, useMemo, useState, ReactNode, useRef, MouseEvent  } from 'react';

import useSWRMutation from 'swr/mutation';
import { Layout, Typography, theme, Input, Form, Button } from 'antd';
import type { FormItemProps } from 'antd';

import 'react-quill/dist/quill.snow.css';
import { useRouter } from 'next/router';
import Portal from '@/components/Portal';

import striptags from 'striptags';
import { chatEndPoint } from '@/utils/url';
import { generateChat } from '@/api/chat';


const { Header, Content } = Layout;
const { Title, Text } = Typography;

const ReactQuill = dynamic(() => import ('react-quill'), {
  ssr: false
})

export default function SecondQuestion() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const router = useRouter();
  const [editorText, setEditorText] = useState<string>("");
  const { trigger, isMutating, error } = useSWRMutation(chatEndPoint, generateChat);

  const [isEmphasizeVisible, setIsEmphasizeVisible] = useState<boolean>(false);
  const [emphasizeSentence, setEmphasizeSentence] = useState<string>("");
  const [mousePosition, setMousePosition] = useState<{x: number, y:number}>({x: 0, y: 0});
  const editorRef = useRef<HTMLDivElement>(null);

  const editorTextForCount = striptags(editorText)
  const noSpaceEditorTextForCount = editorTextForCount.replace(/\s/g, '');

  const textCount = Array.from(editorTextForCount).length;
  const noSpaceTextCount = Array.from(noSpaceEditorTextForCount).length;

  const handleChangeEditor = (value: string) => {
    setEditorText(value);
  };

  const handleClickRefine = async () => {
    const chat = `${editorText} 이 글이 자연스럽게 읽히도록 다시 써줘`;

    const res = await trigger(chat);
      
    if (!res) {
      return;
    }
    
    setEditorText(res);
  };

  const handleFinish = async (value: OnFinishProps) => {
    const { second_question: { experience, learning } } = value;
    const chat = `
      대학교에 진학하기 위한 자기소개서를 작성해야 되는데, 질문은 다음과 같아. 
      고등학교 재학 기간 중 타인과 공동체를 위해 노력한 경험과 이를 통해 배운 점을 기술해 주시기 바랍니다.
      이와 관련해서 나는 ${experience}와 같은 경험을 통해 타인과 공동체를 위해 노력한 적이 있어.
      그리고, 배운 점은 ${learning}이야. 
      내가 너에게 알려준 정보들을 바탕으로 위에서 적은 질문에 대한 답변을 적어줘. 
    `;

    const res = await trigger(chat);
      
    if (!res) {
      return;
    }
    
    setEditorText(res);
  };

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


  if (error) {
    router.push('/error');
    return;
  }

  return (
    <Layout>
      <Header style={{ padding: 0, background: colorBgContainer }}>
        <Title style={{textAlign: "center", padding: '10px 0px 0px 0px'}}>진학 자소서</Title>
      </Header>
      <div style={{display: "flex"}}>
        <Content style={{ margin: '24px 8px 0 16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, width: 'calc((100vw - 248px) / 2)', 
            height: 'calc(100vh - 110px)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Title level={4}>
              문항 2. 고등학교 재학 기간 중 타인과 공동체를 위해 노력한 경험과 이를 통해 배운 점을 기술해 주시기 바랍니다. 
            </Title>
            <Form name="form_item_path" layout="vertical" onFinish={handleFinish}>
              <FormItemGroup prefix={['second_question']}>
                <FormItem name="experience" label={<Title level={5}>타인과 공동체를 위해 노력한 경험</Title>}>
                  <Input placeholder='학생을 가르치는 봉사 동아리에 가입하여 1년간 운영진으로 활동하였음' required />
                </FormItem>
                <FormItem name="learning" label={<Title level={5}>배운 점</Title>}>
                  <Input placeholder='남을 위해 봉사하는 것이 나에게 큰 행복을 준다는 것을 깨달음' required />
                </FormItem>
              </FormItemGroup>
              <Button type="primary" htmlType="submit" loading={isMutating} block>
                자동 생성
              </Button>
            </Form>
          </div>
        </Content>
        <Content style={{ margin: '24px 16px 0 8px' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, width: 'calc((100vw - 248px) / 2)', height: 'calc(100vh - 110px)' }}>
            {editorText && <Text type="danger">※ 강조하고 싶은 부분을 드래그 해보세요</Text>}
            <div ref={editorRef} onMouseUp={handleMouseUp}>
              <ReactQuill theme="snow" value={editorText} onChange={handleChangeEditor} />
            </div>
            <div style={{display: "flex", justifyContent: "space-between", marginTop: "10px"}}>
              <div>
                <div>
                  <Text>{`공백 포함: ${textCount}`}</Text>
                </div>
                <div>
                  <Text>{`공백 제외: ${noSpaceTextCount}`}</Text>
                </div>
              </div>
              <Button type="primary" size="small" onClick={handleClickRefine} loading={isMutating}>
                문장 다듬기
              </Button>
            </div>
            {isEmphasizeVisible && (
                <Portal selector="root" position={{top: mousePosition.y, left: mousePosition.x}}>
                  <Button type='primary' size="small" onClick={handleClickEmphasize}>강조하기</Button>
                </Portal>
              )}
          </div>
        </Content>
      </div>
    </Layout>
  )
}

interface OnFinishProps {
  second_question: {
    experience: string, 
    learning: string
  }
}

const MyFormItemContext = createContext<(string | number)[]>([]);

interface MyFormItemGroupProps {
  prefix: string | number | (string | number)[];
  children: ReactNode;
}

function toArr(str: string | number | (string | number)[]): (string | number)[] {
  return Array.isArray(str) ? str : [str];
}

const FormItemGroup = ({ prefix, children }: MyFormItemGroupProps) => {
  const prefixPath = useContext(MyFormItemContext);
  const concatPath = useMemo(() => [...prefixPath, ...toArr(prefix)], [prefixPath, prefix]);

  return <MyFormItemContext.Provider value={concatPath}>{children}</MyFormItemContext.Provider>;
};

const FormItem = ({ name, ...props }: FormItemProps) => {
  const prefixPath = useContext(MyFormItemContext);
  const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;

  return <Form.Item name={concatName} {...props} />;
};