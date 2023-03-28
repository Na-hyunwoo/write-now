import { ChangeEvent, useState, KeyboardEvent, SetStateAction, Dispatch } from 'react';

import { useGenerateChat } from '@/hooks/useGenerateChat';
import { Button, Input, Layout, Typography } from 'antd';
import { MAKE_INTRODUCTION } from '@/utils/constants';

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

interface Props {
  introduction: string | undefined;
  setIntroduction: Dispatch<SetStateAction<string | undefined>>;
  onChangeIntroduction: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onClickNext: (step: string) => void;
}

export default function Introduction({ 
  introduction,
  setIntroduction,
  onChangeIntroduction,
  onClickNext 
}: Props) {
  const [subject, setSubject] = useState<string>('');
  const { error, isValidating, mutate } = useGenerateChat(subject + MAKE_INTRODUCTION);

  const handleChangeSubject = (event: ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
  }

  const handleClickButton = async() => {
    const res = await mutate('generateChat');

    setIntroduction(res);
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleClickButton();
    }
  }

  if (error) {
    return <>에러가 발생하였습니다.</>;
  }

  return (
    <Layout style={{height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'row'}}>
      <Content style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px'}}>
        <Content>
          <Title level={3}>주제를 입력해 주세요.</Title>
          <Input size='large' onChange={handleChangeSubject} onKeyDown={handleKeyDown} placeholder='초콜릿 효능'/>
        </Content>
          <Button size='large' onClick={handleClickButton} loading={isValidating}>생성</Button>
      </Content>
      <Content style={{height: '100%', padding: '20px'}}>
        <TextArea 
          style={{resize: 'none', height: 'calc(100% - 50px)', marginBottom: '10px'}}
          value={introduction} 
          onChange={onChangeIntroduction} 
        />
        <Layout style={{flexDirection: 'row-reverse'}}>
          <Button size='large' disabled={!introduction} onClick={() => onClickNext('mainSubject')}>다음으로</Button>
        </Layout>
      </Content>
    </Layout>
  )
}