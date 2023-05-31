import dynamic from 'next/dynamic';
import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useRef, MouseEvent  } from 'react';

import useSWRMutation from 'swr/mutation';
import { Col, Row, Typography, Layout, theme, Input, Button, Modal, Radio, Form, RadioChangeEvent, Dropdown, Space, MenuProps } from "antd";
import type { FormItemProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import 'react-quill/dist/quill.snow.css';
import { useRouter } from 'next/router';
import Portal from '@/components/Portal';

import striptags from 'striptags';
import { chatEndPoint } from '@/utils/url';
import { generateChat } from '@/api/chat';
import { getTitle } from '@/utils/function';

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
  const [editorText, setEditorText] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const { trigger, isMutating, error } = useSWRMutation(chatEndPoint, generateChat);
  const [motiveForm] = Form.useForm();
  const [careerPlanForm] = Form.useForm();
  const [prepareForm] = Form.useForm();
  const [studyPlanForm] = Form.useForm();

  const [isEmphasizeVisible, setIsEmphasizeVisible] = useState<boolean>(false);
  const [emphasizeSentence, setEmphasizeSentence] = useState<string>("");
  const [mousePosition, setMousePosition] = useState<{x: number, y:number}>({x: 0, y: 0});
  const editorRef = useRef<HTMLDivElement>(null);

  const editorTextForCount = striptags(editorText)
  const noSpaceEditorTextForCount = editorTextForCount.replace(/\s/g, '');

  const textCount = Array.from(editorTextForCount).length;
  const noSpaceTextCount = Array.from(noSpaceEditorTextForCount).length;
  const title = getTitle(router.asPath);
  
  const items: MenuProps['items'] = [
    {
      label: '진학 자소서',
      key: '1',
    },
    {
      label: '취업 자소서',
      key: '2',
    },
  ];

  const onClick: MenuProps['onClick'] = ({ key }: { key: string }) => {
    if (key === '1') {
      return;
    }

    if (key === '2') {
      router.push('/cover-letter');
      return;
    }
  };
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
    setEditorText("");
    setQuestion(event.target.value);
    setIsModalOpen(false);
  };

  const handleClickRefine = async () => {
    const chat = `${editorText} 이 글이 자연스럽게 읽히도록 다시 써줘`;

    const res = await trigger(chat);
      
    if (!res) {
      return;
    }
    
    setEditorText(res);
  };

  // FIX: 이 답변이 마음에 들지 않음.
  const handleFinish = async (type: string, value: OnFinishProps) => {
    if ( type === 'motive') {
      const { university, department, interest, development, reason } = value;
      const chat = `
        대학교에 진학하기 위한 자기소개서를 작성해야 되는데, 질문은 다음과 같아. 
        ${university} ${department}에 지원한 동기에 대해서 자세히 적어주세요. 
        이와 관련해서 나는 ${interest}와 같은 경험을 통해 ${department}에 관심을 가지게 되었어. 
        그리고, ${development}와 같은 경험을 통해서 ${department}에 대한 열정을 발전시켜 나갔지.  
        마지막으로, ${reason}과 같은 이유로 ${university}의 ${department}를 선택하게 되었어.  
        내가 너에게 알려준 정보들을 활용해서 위에서 적은 질문에 대한 답변을 적어줘. 
      `;

      const res = await trigger(chat);

      if (!res) {
        return;
      }

      setEditorText(res);

      return;
    };

    if (type === 'careerPlan') {
      const { earnings, dream } = value;
      const chat = `
        대학교에 진학하기 위한 자기소개서를 작성해야 되는데, 질문은 다음과 같아. 
        해당 학과에 입학한 뒤에 진로 계획에 대해서 자세히 적어주세요. 
        이와 관련해서 나는 ${earnings}과 같은 학문적 지식 및 기술적 능력을 얻고 싶어.
        그리고, ${dream}와 같은 장래희망과 그것을 이루기 위한 계획이 있어. 
        내가 너에게 알려준 정보들을 활용해서 위에서 적은 질문에 대한 답변을 적어줘. 
      `;

      const res = await trigger(chat);

      if (!res) {
        return;
      }

      setEditorText(res);

      return;
    }


    if (type === 'prepare') {
      const { interest, experience, plan } = value;
      const chat = `
        대학교에 진학하기 위한 자기소개서를 작성해야 되는데, 질문은 다음과 같아. 
        해당 학과에 입학하기 위해 준비한 것들에 대해서 자세히 적어주세요. 
        이와 관련해서 나는 ${interest}과 같은 경험을 통해 해당 학과에 관심을 가지게 되었어. 
        그리고, ${experience}와 같은 관련 경험이 있어. 
        마지막으로, ${plan}와 같은 자기계발 계획을 가지고 있어. 
        내가 너에게 알려준 정보들을 활용해서 위에서 적은 질문에 대한 답변을 적어줘. 
      `;

      const res = await trigger(chat);

      if (!res) {
        return;
      }

      setEditorText(res);

      return;
    }

    if (type === 'studyPlan') {
      const { major, practice, research } = value;
      const chat = `
        대학교에 진학하기 위한 자기소개서를 작성해야 되는데, 질문은 다음과 같아. 
        해당 학과한 뒤에 학업 계획에 대해서 자세히 적어주세요. 
        이와 관련해서 나는 ${major}과 같은 경험을 통해 학문적 기반을 탄탄히 다질거야. 
        그리고, ${practice}와 같은 경험을 통해 실무 능력을 키울거야.  
        마지막으로, ${research}와 같은 연구 및 학술 활동을 통해 학문적인 성장을 이뤄낼거야.
        내가 너에게 알려준 정보들을 활용해서 위에서 적은 질문에 대한 답변을 적어줘. 
      `;

      const res = await trigger(chat);

      if (!res) {
        return;
      }

      setEditorText(res);

      return;
    }

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

  const handleClickExample = () => {
    if (question === '지원 동기') {
      motiveForm.setFieldsValue({ 
        university: '서울대학교', 
        department: '컴퓨터공학과', 
        interest: "중학교 시절, 우연히 참여한 프로그래밍 동아리에서 컴퓨터 언어를 학습하게 되었음.",
        development: "중학교와 고등학교 때 IT 관련 동아리에 참여하며 다양한 프로젝트를 진행",
        reason: "지원하는 대학교는 컴퓨터 공학 분야에서 좋은 커리큘럼을 가지고 있음",
      });
      return;
    }

    if (question === '진로 계획') {
      careerPlanForm.setFieldsValue({ 
        earnings: '인공지능, 빅데이터, 사물인터넷 등 다양한 분야에 대한 전문 지식과, 프로젝트 경험을 통해 실질적인 업무 능력', 
        dream: '졸업 후에는 IT 기업에서 소프트웨어 엔지니어로 활동하며, 획기적인 기술 개발에 기여하고 싶음. 또한, 차후에는 스타트업을 설립하여 기술 혁신을 이끌어 나가는 창업자가 되고 싶음', 
      });
    }

    if (question === '준비 상황') {
      prepareForm.setFieldsValue({ 
        interest: '어렸을 때 우연히 접한 컴퓨터 게임을 더 전문적으로 하고 싶어 컴퓨터에 대해 공부하기 시작함', 
        experience: '게임을 커스텀하기 위해 처음부터 만든적이 있음. 사람들이 게임을 즐기는 모습을 보면서, 다른이들에게 재미를 주는 것이 굉장히 큰 행복을 준다는 것을 느낌', 
        plan: '게임에만 국한되지 않고 소프트웨어를 통해 사람들에게 좋은 가치를 줄 수 있는 일이라면 무엇이든지 도전하며 사람들에게 긍정적인 가치를 제공하는 개발자가 되고싶음',
      });
    }

    if (question === '학업 계획') {
      studyPlanForm.setFieldsValue({ 
        major: '네트워크, 알고리즘, 운영체제, 데이터베이스와 같은 컴퓨터 공학의 핵심이 되는 과목들을 통해 컴퓨터 공학과 관련된 기반을 탄탄히 다질 계획', 
        practice: '캡스톤 디자인과 같은 실전 프로젝트를 만들 수 있는 과목을 통해 실무 능력 향상 기대', 
        research: '컴퓨터 비전 분야에서 이미지 처리와 패턴 인식에 대한 연구 주제를 탐구하고, 새로운 알고리즘 및 기술을 개발하여 실제 문제에 적용할 수 있는 연구를 진행',
      });
    }
  };

  const handleClickDeleteAll = () => {
    if (question === '지원 동기') {
      motiveForm.resetFields();
      return;
    }

    if (question === '진로 계획') {
      careerPlanForm.resetFields();
      return;
    }

    if (question === '준비 상황') {
      prepareForm.resetFields();
      return;
    }

    if (question === '학업 계획') {
      studyPlanForm.resetFields();
      return;
    }

  };

  if (error) {
    router.push('/error');
    return;
  }

  return (
    <Layout>
      <Header style={{ display: "flex", justifyContent: "center", padding: 0, background: colorBgContainer }}>
        <Dropdown menu={{ items, onClick }}>
          <Space style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
            <Title style={{textAlign: "center", margin: '0px'}}>{title}</Title>
            <DownOutlined />
          </Space>
        </Dropdown>
      </Header>
      <div style={{display: "flex"}}>
        <Content style={{ margin: '24px 8px 0 16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, width: 'calc((100vw - 248px) / 2)', 
            height: 'calc(100vh - 110px)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Title level={4}>
              자율 문항. 필요 시 대학별로 지원동기, 진로 계획 등의 자율 문항 1개를 추가하여 활용하시기 바랍니다. 
            </Title>
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", position: "absolute", right: 0, gap: "5px", zIndex: 1 }}>
                <Button size="small" onClick={handleClickExample}>예시 텍스트</Button>
                <Button size="small" onClick={handleClickDeleteAll}>전체 지우기</Button>
              </div>
              <Title level={5}>질문 선택</Title>
              <Input placeholder="항목 선택" onClick={handleInputClick} value={question}/>
            </div>
            <Modal 
              width="700px"
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
                  <Col span={12}>
                    <Radio value="준비 상황">
                      <Text strong>준비 상황</Text>
                    </Radio>
                  </Col>
                  <Col span={12}>
                    <Radio value="학업 계획">
                      <Text strong>학업 계획</Text>
                    </Radio>
                  </Col>
                </Row>
              </Radio.Group>
            </Modal>
            {question === '지원 동기' && (
              <Form form={motiveForm} name="form_item_path" layout="vertical" onFinish={(value) => handleFinish('motive', value)}>
                <FormItemGroup prefix={['motive']}>
                  <Form.Item name="university" label={<Title level={5}>지원 대학</Title>}>
                    <Input placeholder='서울대학교' required />
                  </Form.Item>
                  <Form.Item name="department" label={<Title level={5}>지원 학과</Title>}>
                    <Input placeholder='컴퓨터공학과' required />
                  </Form.Item>
                  <Form.Item name="interest" label={<Title level={5}>해당 학과에 관심을 갖게한 개인적 경험 또는 성장 과정</Title>}>
                    <Input placeholder='중학교 시절, 우연히 참여한 프로그래밍 동아리에서 컴퓨터 언어를 학습하게 되었음.' required />
                  </Form.Item>
                  <Form.Item name="development" label={<Title level={5}>지원하는 학과에 대한 관심과 열정이 발전된 과정</Title>}>
                    <Input placeholder='중학교와 고등학교 때 IT 관련 동아리에 참여하며 다양한 프로젝트를 진행' required />
                  </Form.Item>
                  <Form.Item name="reason" label={<Title level={5}>지원하는 대학교의 선택의 이유</Title>}>
                    <Input placeholder='지원하는 대학교는 컴퓨터 공학 분야에서 좋은 커리큘럼을 가지고 있음' required />
                  </Form.Item>
                </FormItemGroup>
                <Button type="primary" htmlType="submit" loading={isMutating} block>
                  자동 생성
                </Button>
              </Form>
            )}
            {question === '진로 계획' && (
              <Form form={careerPlanForm} name="form_item_path" layout="vertical" onFinish={(value) => handleFinish('careerPlan', value)}>
                <FormItemGroup prefix={['careerPlan']}>
                  <Form.Item name="earnings" label={<Title level={5}>대학에서 얻고자 하는 학문적 지식 및 기술적 능력</Title>}>
                    <Input placeholder='인공지능, 빅데이터, 사물인터넷 등 다양한 분야에 대한 전문 지식과, 프로젝트 경험을 통해 실질적인 업무 능력' required />
                  </Form.Item>
                  <Form.Item name="dream" label={<Title level={5}>자신의 장래희망과, 그것을 이루기 위한 계획</Title>}>
                    <Input placeholder='졸업 후에는 IT 기업에서 소프트웨어 엔지니어로 활동하며, 획기적인 기술 개발에 기여하고 싶음. 또한, 차후에는 스타트업을 설립하여 기술 혁신을 이끌어 나가는 창업자가 되고 싶음' required />
                  </Form.Item>
                </FormItemGroup>
                <Button type="primary" htmlType="submit" loading={isMutating} block>
                  자동 생성
                </Button>
              </Form>
            )}
            {question === '준비 상황' && (
              <Form form={prepareForm} name="form_item_path" layout="vertical" onFinish={(value) => handleFinish('prepare', value)}>
                <FormItemGroup prefix={['prepare']}>
                  <Form.Item name="interest" label={<Title level={5}>해당 학과에 대한 관심을 가지게 된 경험, 동기, 또는 이유</Title>}>
                    <Input placeholder='어렸을 때 우연히 접한 컴퓨터 게임을 더 전문적으로 하고 싶어 컴퓨터에 대해 공부하기 시작함' required />
                  </Form.Item>
                  <Form.Item name="experience" label={<Title level={5}>해당 학과에 진학하기 위한 경험과 학습 활동</Title>}>
                    <Input placeholder='게임을 커스텀하기 위해 처음부터 만든적이 있음. 사람들이 게임을 즐기는 모습을 보면서, 다른이들에게 재미를 주는 것이 굉장히 큰 행복을 준다는 것을 느낌' required />
                  </Form.Item>
                  <Form.Item name="plan" label={<Title level={5}>어떤 자기계발 계획이 있는지 적어주세요.</Title>}>
                    <Input placeholder='게임에만 국한되지 않고 소프트웨어를 통해 사람들에게 좋은 가치를 줄 수 있는 일이라면 무엇이든지 도전하며 사람들에게 긍정적인 가치를 제공하는 개발자가 되고싶음' required />
                  </Form.Item>
                </FormItemGroup>
                <Button type="primary" htmlType="submit" loading={isMutating} block>
                  자동 생성
                </Button>
              </Form>
            )}
            {question === '학업 계획' && (
              <Form form={studyPlanForm} name="form_item_path" layout="vertical" onFinish={(value) => handleFinish('studyPlan', value)}>
                <FormItemGroup prefix={['studyPlan']}>
                  <Form.Item name="major" label={<Title level={5}>학문적 기반을 탄탄히 다지기 위해 하고싶은 전공 과목과 교육 경험</Title>}>
                    <Input placeholder='네트워크, 알고리즘, 운영체제, 데이터베이스와 같은 컴퓨터 공학의 핵심이 되는 과목들을 통해 컴퓨터 공학과 관련된 기반을 탄탄히 다질 계획' required />
                  </Form.Item>
                  <Form.Item name="practice" label={<Title level={5}>실무 능력을 키우고자 하는 계획</Title>}>
                    <Input placeholder='캡스톤 디자인과 같은 실전 프로젝트를 만들 수 있는 과목을 통해 실무 능력 향상 기대' required />
                  </Form.Item>
                  <Form.Item name="research" label={<Title level={5}>학문적인 성장을 이루고자 하는 계획</Title>}>
                    <Input placeholder='컴퓨터 비전 분야에서 이미지 처리와 패턴 인식에 대한 연구 주제를 탐구하고, 새로운 알고리즘 및 기술을 개발하여 실제 문제에 적용할 수 있는 연구를 진행' required />
                  </Form.Item>
                </FormItemGroup>
                <Button type="primary" htmlType="submit" loading={isMutating} block>
                  자동 생성
                </Button>
              </Form>
            )}
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
  university: string;
  department: string;
  interest: string;
  development: string;
  reason: string;
  earnings: string;
  dream: string;
  experience: string;
  plan: string;
  major: string;
  practice: string;
  research: string;
};

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
