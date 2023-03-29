import { useGenerateChat } from "@/hooks/useGenerateChat";
import { Layout, Typography, Input, Button } from "antd";
import { MAKE_CONCLUSION } from "@/utils/constants";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

const { Title } = Typography;
const { TextArea } = Input;
const { Content } = Layout;

interface Props {
  mainSubject: string | undefined;
  conclusion: string | undefined;
  setConclusion: Dispatch<SetStateAction<string | undefined>>;
  onChangeMainSubject: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onClickNext: (step: string) => void;
}

export default function Conclusion({
  mainSubject,
  conclusion,
  setConclusion,
  onChangeMainSubject,
  onClickNext,
}: Props) {
  const { error, isValidating, mutate } = useGenerateChat(mainSubject + MAKE_CONCLUSION);

  const handleClickMakeConclusion = async () => {
    const res = await mutate('generateChat');

    setConclusion(res);
  }

  if (error) {
    return <>에러가 발생하였습니다.</>;
  }

  return (
    <Layout style={{height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'row'}}>
      <Content style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px'}}>
        <Title level={3}>본론을 입력해 주세요.</Title>
        <TextArea 
          style={{resize: 'none', height: 'calc(100% - 10px)', marginBottom: '10px'}} 
          value={mainSubject} 
          onChange={onChangeMainSubject}
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
          <Button size='large' onClick={() => onClickNext('editor')}>다음으로</Button>
        </Content>
      </Content>
    </Layout>
  )
}