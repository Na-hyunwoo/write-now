import dynamic from 'next/dynamic';
import { createContext, useContext, useEffect, useMemo, useState  } from 'react';

import { Layout, Typography, theme, Input, Form, Button } from 'antd';
import type { FormItemProps } from 'antd';

import 'react-quill/dist/quill.snow.css';
import { useGenerateChat } from '@/hooks/useGenerateChat';
import { useRouter } from 'next/router';


const { Header, Content } = Layout;
const { Title } = Typography;

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

  const handleChangeEditor = (value: string) => {
    setEditorText(value);
  };

  const onFinish = (value: OnFinishProps) => {
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
            <Form name="form_item_path" layout="vertical" onFinish={onFinish}>
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
            <ReactQuill theme="snow" value={editorText} onChange={handleChangeEditor} />
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