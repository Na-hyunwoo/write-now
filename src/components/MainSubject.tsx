import { useGenerateChat } from "@/hooks/useGenerateChat";
import { MAKE_MAIN_SUBJECT } from "@/utils/constants";
import { Button, Input, Layout, Typography } from "antd";
import { ChangeEvent, useState } from "react";

const { TextArea } = Input;
const { Content } = Layout;
const { Title } = Typography;

interface Props {
  introduction: string | undefined;
  onChangeIntroduction: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function MainSubject({ 
  introduction,
  onChangeIntroduction 
}: Props) {
  const { error, isValidating, mutate } = useGenerateChat(introduction + MAKE_MAIN_SUBJECT);
  const [mainSubject, setMainSubject] = useState<string>();

  const handleClickMakeMainSubject = async() => {
    const res = await mutate('generateChat');

    setMainSubject(res);
  }

  if (error) {
    return <>에러가 발생하였습니다.</>;
  }

  return (
    <Layout style={{height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'row'}}>
      <Content style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px'}}>
        <Title level={3}>서론을 입력해 주세요.</Title>
        <TextArea 
          style={{resize: 'none', height: 'calc(100% - 10px)', marginBottom: '10px'}} 
          value={introduction} 
          onChange={onChangeIntroduction}
        />
        <Button 
          size='large' 
          onClick={handleClickMakeMainSubject}
          loading={isValidating}
        >본론 생성</Button>
      </Content>
      <Content style={{padding: '20px', height: '100%'}}>
        <TextArea  
          style={{resize: 'none', height: 'calc(100% - 50px)', marginBottom: '10px'}}
          value={mainSubject}
        />
        <Content style={{display: 'flex', flexDirection: 'row-reverse'}}>
          <Button size='large'>다음으로</Button>
        </Content>
      </Content>
    </Layout>
  )
}