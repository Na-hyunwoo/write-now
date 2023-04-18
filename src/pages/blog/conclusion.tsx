import { useGenerateChat } from "@/hooks/useGenerateChat";
import { Layout, Typography, Input, Button } from "antd";
import { MAKE_CONCLUSION } from "@/utils/constants";
import { useRouter } from "next/router";
import { useConclusion, useMainSubject, useSubject } from "@/stores/editor";
import Link from "next/link";

const { Title } = Typography;
const { TextArea } = Input;
const { Content } = Layout;

export default function Conclusion() {
  const { subject } = useSubject();
  const { mainSubject, handleChangeMainSubjectChange } = useMainSubject();
  const { conclusion, setConclusion } = useConclusion();

  const { error, isValidating, mutate } = useGenerateChat(subject + MAKE_CONCLUSION);
  const router = useRouter();

  const handleClickMakeConclusion = async () => {
    const res = await mutate();

    setConclusion(res);
  }

  if (error) {
    router.push('/error');
    console.log(error);
    return <></>;
  }

  return (
    <Layout style={{height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'row'}}>
      <Content style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px'}}>
        <Title level={3}>본론을 입력해 주세요.</Title>
        <TextArea 
          style={{resize: 'none', height: 'calc(100% - 10px)', marginBottom: '10px'}} 
          value={mainSubject} 
          onChange={handleChangeMainSubjectChange}
        />
        <Button 
          size='large' 
          onClick={handleClickMakeConclusion}
          loading={isValidating}
        >결론 생성</Button>
      </Content>
      <Content style={{padding: '20px', height: '100%'}}>
        <TextArea  
          style={{resize: 'none', height: 'calc(100% - 50px)', marginBottom: '10px'}}
          value={conclusion}
        />
        <Content style={{display: 'flex', flexDirection: 'row-reverse'}}>
          <Link href="/blog/editor">
            <Button size='large' disabled={!conclusion}>다음으로</Button>
          </Link>
        </Content>
      </Content>
    </Layout>
  )
}