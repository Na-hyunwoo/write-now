import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { ChangeEvent, useState } from "react";

import { Col, Row, Typography, Select, Divider, Space, Input, Button, Modal, Radio, RadioChangeEvent, Form, Dropdown, MenuProps, theme, Layout } from "antd";
import { DownOutlined } from '@ant-design/icons';

import useSWRMutation from 'swr/mutation';

import 'react-quill/dist/quill.snow.css';
import { getTitle } from "@/utils/function";
import { chatEndPoint } from "@/utils/url";
import { generateChat } from "@/api/chat";

const { Title, Text } = Typography;
const { Header } = Layout;

const ReactQuill = dynamic(() => import ('react-quill'), {
  ssr: false
})
interface IInformation {
  personality: string[], 
  position: string, 
  question: string, 
  school: string,
  major: string,
  experience: string,
}

export default function CoverLetters() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [information, setInformation] = useState<IInformation>({
    personality: ["외향형(E)", "감각형(S)", "논리적(T)", "판단형(J)"],
    position: "",
    question: "",
    school: "",
    major: "",
    experience: ""
  });
  const [editorText, setEditorText] = useState<string>("");

  /**
   * TODO
   * - 각각의 질문에 대해서 더 뾰족한 정보들을 받는다면, 훨씬 좋은 경험을 선사할 수 있을 것 같다. 
   *   그니까 각각의 자기소개서 문항에 대해서, 더 좋은 질문들을 한다면, 훨씬 좋은 사용자 경험을 제공할 수 있을 것 같다.
   * - 추가적으로, 데이터를 받는데 시간이 오래 걸리므로, 
   *   1. 이 시간을 줄일 수 있는 방법을 알아본다. 
   *   2. 로딩 시에 좀 덜 지루할 수 있게 할 수 있는 요소 (애니메이션, 배달의 민족 엘리베이터 거울 등등)를 찾아보자. -> 취업 관련 아티클일 수도 있겠다.
   */
  const chatMessage = `
    나는 ${information.school} ${information.major}을 졸업하고, ${information.experience}라는 경험을 가지고 있어. 
    성격은 ${information.personality.join(", ")}라는 성향을 가지고 있어. 
    이번에 ${information.position}라는 직무를 갖기 위해서, ${information.question}이라는 기업 자기소개서의 질문에 답해야 해.
    따라서, 질문에 걸맞는 기업 자기소개서를 작성해줘`;
  const title = getTitle(router.asPath);


  const { trigger, isMutating, error } = useSWRMutation(chatEndPoint, generateChat);


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
      router.push('/admission-letter/first-question');
      return;
    }

    if (key === '2') {
      router.push('/cover-letter');
      return;
    }
  };

  const handleTendencyChange = (value: any) => {
    if (value === '내향형(I)' || value === '외향형(E)') {
      setInformation((prev) => ({
        ...prev,
        personality: [value, ...information.personality.slice(1)]
      }));
      return;
    }

    if (value === '감각형(S)' || value === '직관형(N)') {
      const newPersonality = information.personality;
      newPersonality[1] = value;
      setInformation((prev) => ({
        ...prev,
        personality: newPersonality
      }));
      return;
    }

    if (value === '논리적(T)' || value === '감정형(F)') {
      const newPersonality = information.personality;
      newPersonality[2] = value;
      setInformation((prev) => ({
        ...prev,
        personality: newPersonality
      }));
      return;
    }

    if (value === '판단형(J)' || value === '인식형(P)') {
      const newPersonality = information.personality;
      newPersonality[3] = value;
      setInformation((prev) => ({
        ...prev,
        personality: newPersonality
      }));
      return;
    }
  };

  const handleChangePosition = (event: ChangeEvent<HTMLInputElement>) => {
    setInformation((prev) => ({
      ...prev,
      position: event.target.value,
    }));
  };

  const handleChangeCustom = (event: any) => {
    if (event.target.id === "school") {
      setInformation((prev) => ({
        ...prev,
        school: event.target.value,
      }))
      return;
    }
    if (event.target.id === "major") {
      setInformation((prev) => ({
        ...prev,
        major: event.target.value,
      }))
      return;
    }
    if (event.target.id === "experience") {
      setInformation((prev) => ({
        ...prev,
        experience: event.target.value,
      }))
      return;
    }
  }

  const handleInputClick = () => {
    setIsModalOpen(true);
  };

  const handleChangeRadio = (event: RadioChangeEvent) => {
    setInformation((prev) => ({
      ...prev,
      question: event.target.value,
    }))
    setIsModalOpen(false);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    const res = await trigger(chatMessage);

    if (res) {
      setEditorText(res);
    }
  };

  const handleChangeEditor = (value: string) => {
    setEditorText(value);
  };

  if (error) {
    router.push('/error');
    return;
  }

  return (
    <>
      <Header style={{ display: "flex", justifyContent: "center", padding: 0, background: colorBgContainer }}>
        <Dropdown menu={{ items, onClick }}>
          <Space style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
            <Title style={{textAlign: "center", margin: '0px'}}>{title}</Title>
            <DownOutlined />
          </Space>
        </Dropdown>
      </Header>
      <Row style={{paddingTop: "20px"}}>
        <Col style={{display: "flex", flexDirection: "column", alignItems: "center" }} span={8}>
          <Title level={3}>01. 개인 성향</Title>
          <Text>본인의 성향을 솔직하게 선택해주세요.</Text>
          <Divider />
          <Space size="large" style={{marginBottom: "20px"}}>
            <Select 
              defaultValue="외향형(E)"
              size="large"
              style={{ width: 120 }}
              onChange={handleTendencyChange}
              options={[
                { value: '외향형(E)' },
                { value: '내향형(I)'}
              ]}
            />
            <Select 
              defaultValue="감각형(S)"
              size="large"
              style={{ width: 120 }}
              onChange={handleTendencyChange}
              options={[
                { value: '감각형(S)' },
                { value: '직관형(N)'}
              ]}
            />
          </Space>
          <Space size="large">
            <Select 
              defaultValue="논리적(T)"
              size="large"
              style={{ width: 120 }}
              onChange={handleTendencyChange}
              options={[
                { value: '논리적(T)' },
                { value: '감정형(F)'}
              ]}
            />
            <Select 
              defaultValue="판단형(J)"
              size="large"
              style={{ width: 120 }}
              onChange={handleTendencyChange}
              options={[
                { value: '판단형(J)' },
                { value: '인식형(P)'}
              ]}
            />
          </Space>
        </Col>
        <Col style={{display: "flex", flexDirection: "column", alignItems: "center" }} span={8}>
          <Title level={3}>02. 작성항목 및 직무</Title>
          <Text>작성하고자 하는 자소서의 항목과 지원 직무를 선택해 주세요.</Text>
          <Divider />
          <Input placeholder="프론트엔드 엔지니어" onChange={handleChangePosition} />
          <div style={{paddingTop: "10px"}} />
          <Input placeholder="항목 선택" onClick={handleInputClick} value={information.question}/>
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
            <Radio.Group style={{width: "100%"}} onChange={handleChangeRadio} value={information.question}>
              <Row style={{padding: "10px 0px"}}>
                <Col span={12}>
                  <Radio value="성격 장단점">
                    <Text strong>성격 장단점</Text>
                  </Radio>
                </Col>
                <Col span={12}>
                  <Radio value="지원 동기">
                    <Text strong>지원 동기</Text>
                  </Radio>
                </Col>
              </Row>
              <Row style={{padding: "10px 0px"}}>
                <Col span={12}>
                  <Radio value="최근 5년 이내 힘들었던 일을 극복하고 성공했거나 실패한 경험">
                    <Text strong>최근 5년 이내 힘들었던 일을 극복하고 성공했거나 실패한 경험</Text>
                  </Radio>
                </Col>
                <Col span={12}>
                  <Radio value="사회활동 경험">
                    <Text strong>사회활동 경험</Text>
                  </Radio>
                </Col>
              </Row>
              <Row style={{padding: "10px 0px"}}>
                <Col span={12}>
                  <Radio value="인재상과 본인과 부합되는 이유">
                    <Text strong>
                      인재상과 본인과 부합되는 이유 
                    </Text>
                    <Text style={{fontSize: "12px"}} disabled>
                      (신뢰,도전,탁월, 혁신, 열정, 국제감각, 창의, 책임감 등)
                    </Text>
                  </Radio>
                </Col>
                <Col span={12}>
                  <Radio value="지원한 분야에서 본인만의 경쟁력">
                    <Text strong>
                      지원한 분야에서 본인만의 경쟁력
                    </Text>
                  </Radio>
                </Col>
              </Row>
              <Row style={{padding: "10px 0px"}}>
                <Col span={12}>
                  <Radio value="성장 과정">
                    <Text strong>
                      성장 과정
                    </Text>
                  </Radio>
                </Col>
                <Col span={12}>
                  <Radio value="학업 외에 본인이 열정을 갖고 참여했던 경험">
                    <Text strong>
                      학업 외에 본인이 열정을 갖고 참여했던 경험
                    </Text>
                    <Text style={{fontSize: "12px"}} disabled>
                      (주제/인원/기간/본인의 역할 포함)
                    </Text>
                  </Radio>
                </Col>
              </Row>
              <Row style={{padding: "10px 0px"}}>
                <Col span={12}>
                  <Radio value="입사 후 포부">
                    <Text strong>
                      입사 후 포부
                    </Text>
                  </Radio>
                </Col>
                <Col span={12}>
                  <Radio value="면접관이 꼭 알아주었으면 하는 점">
                    <Text strong>면접관이 꼭 알아주었으면 하는 점</Text>
                  </Radio>
                </Col>
              </Row>
              <Row style={{padding: "10px 0px"}}>
                <Col span={12}>
                  <Radio value="지원분야와 관련된 학습 및 활동경험에 대해">
                    <Text strong>지원분야와 관련된 학습 및 활동경험에 대해</Text>                  
                    <Text style={{fontSize: "12px"}} disabled>(주제/인원/기간/본인의 역할 포함)</Text>
                  </Radio>
                </Col>
                <Col span={12}>
                  <Radio value="관심있게 공부해온 분야는 무엇이며 교내, 외 단체활동 경험">
                    <Text strong>
                      관심있게 공부해온 분야는 무엇이며 교내, 외 단체활동 경험
                    </Text>
                  </Radio>
                </Col>
              </Row>
            </Radio.Group>
          </Modal>
        </Col>
        <Col style={{display: "flex", flexDirection: "column", alignItems: "center" }} span={8}>
          <Title level={3}>03. 맞춤</Title>
          <Text>본인과의 일치도를 위해 아래 항목에 직접 입력 해주세요.</Text>
          <Divider />
          <Form colon={false}>
            <Space size="middle">
              <Form.Item label="학교">
                <Input id="school" style={{width: "95px"}} placeholder="서울대학교" onChange={handleChangeCustom} />
              </Form.Item>
              <Form.Item label="전공">
                <Input id="major" style={{width: "140px"}} placeholder="컴퓨터공학과" onChange={handleChangeCustom} />
              </Form.Item>
            </Space>
            <Form.Item label="경험">
              <Input id="experience" placeholder="대학 창업공모전에서 대상수상, OO그룹 인턴프로그램 6개월 참여" onChange={handleChangeCustom}/>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <div style={{paddingTop: "50px"}} />
      <Row style={{display: "flex", justifyContent: "center"}}>
        <Button 
          style={{width: "457px", height: "63px", display: "flex", alignItems: "center", justifyContent: "center"}}
          onClick={handleSubmit}
          disabled={!Object.values(information).every((item) => item.length > 0)}
          loading={isMutating}
        >
          <Title level={2} style={{fontStyle: "#FFF", margin: 0}}>
            자기소개서 작성하기
          </Title>
        </Button>
      </Row>
      <div style={{paddingTop: "100px"}} />
      <Row style={{display: "flex", justifyContent: "center"}}>
        <Col span={20}>
          <ReactQuill theme="snow" value={editorText} onChange={handleChangeEditor} />
        </Col>
      </Row>
    </>
  )
}