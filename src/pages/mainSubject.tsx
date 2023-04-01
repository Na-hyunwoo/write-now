import { useGenerateChat } from "@/hooks/useGenerateChat";
import { useIntroduction, useMainSubject, useSubject } from "@/stores/editor";
import { MAKE_MAIN_SUBJECT } from "@/utils/constants";
import { Button, Input, Layout, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

const { TextArea } = Input;
const { Content } = Layout;
const { Title } = Typography;

export default function MainSubject() {
  const { subject } = useSubject();
  const { introduction, handleChangeIntroduction } = useIntroduction();
  const { mainSubject, setMainSubject, handleChangeMainSubjectChange } = useMainSubject();

  const { error, isValidating, mutate } = useGenerateChat(subject + MAKE_MAIN_SUBJECT);
  const router = useRouter();

  const handleClickMakeMainSubject = async () => {
    const res = await mutate('generateChat');

    setMainSubject(res);
  }

  if (error) {
    router.push('/error');
    console.log(error);
    return <></>;
  }

  return (
    <Layout style={{height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'row'}}>
      <Content style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px'}}>
        <Title level={3}>서론을 입력해 주세요.</Title>
        <TextArea 
          style={{resize: 'none', height: 'calc(100% - 10px)', marginBottom: '10px'}} 
          value={introduction} 
          onChange={handleChangeIntroduction}
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
          onChange={handleChangeMainSubjectChange}
          value={mainSubject}
        />
        <Content style={{display: 'flex', flexDirection: 'row-reverse'}}>
          <Link href="/conclusion">
            <Button size='large'>다음으로</Button>
          </Link>
        </Content>
      </Content>
    </Layout>
  )
}