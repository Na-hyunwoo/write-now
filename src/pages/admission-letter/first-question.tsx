import dynamic from 'next/dynamic';
import { ChangeEvent, ComponentType, createContext, MouseEvent, useContext, useEffect, useMemo, useRef, useState  } from 'react';

import { Layout, Typography, theme, Input, Form, Button } from 'antd';
import type { FormItemProps } from 'antd';

import 'react-quill/dist/quill.snow.css';
import { useGenerateChat } from '@/hooks/useGenerateChat';
import { useRouter } from 'next/router';
import Portal from '@/components/Portal';

import striptags from 'striptags';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const ReactQuill = dynamic(() => import ('react-quill'), {
  ssr: false
})

export default function FirstQuestion() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const router = useRouter();
  const [chatMessage, setChatMessage] = useState<string>("");
  const [editorText, setEditorText] = useState<string>("");
  const { error, isValidating, mutate } = useGenerateChat(chatMessage);

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

  const handleClickRefine = () => {
    const chat = `${editorText} 이 문장을 부드럽게 다듬어줘`;

    setChatMessage(chat);
  }

  const handleFinish = (value: OnFinishProps) => {
    const { first_question: { department, experience, learning } } = value;
    const chat = `
      내가 대학교에 진학하기 위해서 자기소개서를 작성해야 돼. 질문은 다음과 같아. 
      고등학교 재학 기간 중 자신의 진로와 관련하려 어떤 노력을 해왔는지 본인에게 의미 있는 학습 경험과 교내 활동을 중심으로 기술해 주시기 바랍니다. 
      내가 지원하려는 학과는 ${department}이고, 진로와 관련된 학습 경험 혹은 교내 활동은 ${experience}와 같은 것들이 있어. 
      그리고, 배운 점은 ${learning}이야. 
      내가 너에게 알려준 정보들을 바탕으로 위에서 적은 질문에 대한 답변을 적어줘.
    `
    setChatMessage(chat);
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
  }

  const handleClickEmphasize = () => {
    const chat = `${editorText} 이 자기소개서 글에서, ${emphasizeSentence} 이 부분이 핵심이야. 따라서, 해당 부분을 반복해서 강조해서 자기소개서를 다시 써줘. 
      실제로 학교에 제출할 수 있게 정돈해서 써줘야돼.`;

    setIsEmphasizeVisible(false);
    setChatMessage(chat);
  }

  useEffect(() => {
    if (!chatMessage) {
      return;
    }

    const fetchData = async () => {
      const res = await mutate();
      
      if (!res) {
        return;
      }
      
      setEditorText(res);
    }

    fetchData();

  }, [chatMessage]);

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
              문항 1. 고등학교 재학 기간 중 자신의 진로와 관련하여 어떤 노력을 해왔는지 본인에게 의미 있는 학습 경험과 교내 활동을 중심으로 기술해 주시기 바랍니다.
            </Title>
            <Form name="form_item_path" layout="vertical" onFinish={handleFinish}>
              <FormItemGroup prefix={['first_question']}>
                <FormItem name="department" label={<Title level={5}>지원 학과</Title>}>
                  <Input placeholder='컴퓨터공학과' required />
                </FormItem>
                <FormItem name="experience" label={<Title level={5}>진로와 관련된 학습 경험 혹은 교내 활동</Title>}>
                  <Input placeholder='IT 창업 동아리를 만들고, 1년동안 운영자로 활동하였음' required />
                </FormItem>
                <FormItem name="learning" label={<Title level={5}>배운 점</Title>}>
                  <Input placeholder='조직을 이룸을 통해, 혼자서는 이뤄낼 수 없는 성과를 이뤄낼 수 있었음' required />
                </FormItem>
              </FormItemGroup>
              <Button type="primary" htmlType="submit" loading={isValidating} block>
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
              <Button type="primary" size="small" onClick={handleClickRefine} loading={isValidating}>
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
  first_question: {
    department: string, 
    experience: string, 
    learning: string
  }
}

const MyFormItemContext = createContext<(string | number)[]>([]);


interface MyFormItemGroupProps {
  prefix: string | number | (string | number)[];
  children: React.ReactNode;
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