import dynamic from 'next/dynamic';
import { createContext, useContext, useEffect, useMemo, useState, ReactNode  } from 'react';

import { Col, Row, Typography, Layout, theme, Input, Button, Modal, Radio, Form, RadioChangeEvent } from "antd";

import type { FormItemProps } from 'antd';

import 'react-quill/dist/quill.snow.css';
import { useGenerateChat } from '@/hooks/useGenerateChat';
import { useRouter } from 'next/router';


const { Header, Content } = Layout;
const { Title, Text } = Typography;

const ReactQuill = dynamic(() => import ('react-quill'), {
  ssr: false
})

export default function ThirdQuestion() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const router = useRouter();
  const [chatMessage, setChatMessage] = useState<string>("");
  const [editorText, setEditorText] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const { error, isValidating, mutate } = useGenerateChat(chatMessage);

  const handleChangeEditor = (value: string) => {
    setEditorText(value);
  };

  const handleInputClick = () => {
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  const handleChangeRadio = (event: RadioChangeEvent) => {
    setQuestion(event.target.value);
    setIsModalOpen(false);
  };

  // FIX: 이 답변이 마음에 들지 않음.
  const onFinish = (value: OnFinishProps) => {
    const { motive: { university, department, interest, development, reason } } = value;
    const chat = `
      대학교에 진학하기 위한 자기소개서를 작성해야 되는데, 질문은 다음과 같아. 
      ${university} ${department}에 지원한 동기에 대해서 자세히 적어주세요. 
      이와 관련해서 나는 ${interest}와 같은 경험을 통해 ${department}에 관심을 가지게 되었어. 
      그리고, ${development}와 같은 경험을 통해서 ${department}에 대한 관심과 열정을 발전시켜 나갔지.  
      마지막으로, ${reason}과 같은 이유로 ${university}의 ${department}를 선택하게 되었어.  
      내가 너에게 알려준 정보들을 활용해서 위에서 적은 질문에 대한 답변을 한국어로 적어줘. 
    `
    console.log(chat);
    setChatMessage(chat);
  };

  // FIX: 이렇게 하면 동일한 메세지에 대해서 데이터를 호출할 수 없음.
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
              자율 문항. 필요 시 대학별로 지원동기, 진로 계획 등의 자율 문항 1개를 추가하여 활용하시기 바랍니다. 
            </Title>
            <label>
              <Title level={5}>질문 선택</Title>
              <Input placeholder="항목 선택" onClick={handleInputClick} value={question}/>
            </label>
            <Modal 
              width="1000px"
              open={isModalOpen} 
              centered 
              title={
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                  <Title level={3}>
                    항목 선택
                  </Title>
                </div>
              }
              footer={[]} 
              onCancel={handleCancelModal}
            >
              <Radio.Group style={{width: "100%"}} onChange={handleChangeRadio} value={question}>
                <Row style={{padding: "10px 0px"}}>
                  <Col span={12}>
                    <Radio value="지원 동기">
                      <Text strong>지원 동기</Text>
                    </Radio>
                  </Col>
                  <Col span={12}>
                    <Radio value="진로 계획">
                      <Text strong>진로 계획</Text>
                    </Radio>
                  </Col>
                </Row>
              </Radio.Group>
            </Modal>
            {question === '지원 동기' && (
              <Form name="form_item_path" layout="vertical" onFinish={onFinish}>
                <FormItemGroup prefix={['motive']}>
                  <FormItem name="university" label={<Title level={5}>지원 대학</Title>}>
                    <Input placeholder='서울대학교' required />
                  </FormItem>
                  <FormItem name="department" label={<Title level={5}>지원 학과</Title>}>
                    <Input placeholder='컴퓨터 공학과' required />
                  </FormItem>
                  <FormItem name="interest" label={<Title level={5}>어떤 개인적 경험 또는 성장 과정이 해당 학과에 관심을 갖게 되게 했나요?</Title>}>
                    <Input placeholder='중학교 시절, 우연히 참여한 프로그래밍 동아리에서 처음으로 컴퓨터 공학에 관심을 갖게 되었습니다.' required />
                  </FormItem>
                  <FormItem name="development" label={<Title level={5}>지원하는 학과에 대한 관심과 열정은 어떻게 발전되었나요?</Title>}>
                    <Input placeholder='중학교와 고등학교 때 IT 관련 동아리에 참여하며 다양한 프로젝트를 진행하며 열정을 키웠습니다.' required />
                  </FormItem>
                  <FormItem name="reason" label={<Title level={5}>지원하는 대학교의 특장점과 명성이 어떻게 선택의 이유가 되었나요?</Title>}>
                    <Input placeholder='지원하는 대학교는 컴퓨터 공학 분야에서 국내외적으로 높은 명성과 우수한 교수진을 가지고 있습니다.' required />
                  </FormItem>
                </FormItemGroup>
                <Button type="primary" htmlType="submit" loading={isValidating} block>
                  자동 생성
                </Button>
              </Form>
            )}
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
  motive: {
    university: string,
    department: string,
    interest: string, 
    development: string,
    reason: string,
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