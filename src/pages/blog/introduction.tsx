import { KeyboardEvent } from 'react';

import { useGenerateChat } from '@/hooks/useGenerateChat';
import { Button, Input, Layout, Typography } from 'antd';
import { MAKE_INTRODUCTION } from '@/utils/constants';
import { useRouter } from 'next/router';
import { useIntroduction, useSubject } from '@/stores/blog';
import Link from 'next/link';

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

export default function Introduction() {
  const { subject, handleChangeSubject } = useSubject();
  const { introduction, setIntroduction, handleChangeIntroduction} = useIntroduction();

  const { error, isValidating, mutate } = useGenerateChat(subject + MAKE_INTRODUCTION);
  const router = useRouter();

  const handleClickButton = async() => {
    const res = await mutate();

    setIntroduction(res);
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleClickButton();
    }
  }

  if (error) {
    router.push('/error');
    console.log(error);
    return <></>;
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
          onChange={handleChangeIntroduction} 
        />
        <Layout style={{flexDirection: 'row-reverse'}}>
          <Link href="/blog/mainSubject">
            <Button size='large' disabled={!introduction}>다음으로</Button>
          </Link>
        </Layout>
      </Content>
    </Layout>
  )
}