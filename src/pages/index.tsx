import Head from 'next/head'
import { ChangeEvent, useState } from 'react';
import { Layout, Typography } from 'antd';

import { Introduction, MainSubject, Conclusion, Editor } from '@/components';

const { Header } = Layout;
const { Title } = Typography;

export default function Home() {
  const [step, setStep] = useState<string>('introduction');
  const [introduction, setIntroduction] = useState<string | undefined>('');
  const [mainSubject, setMainSubject] = useState<string>();
  const [conclusion, setConclusion] = useState<string>();

  const handleClickNext = (step: string) => {
    setStep(step);
  };

  const handleChangeIntroduction = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setIntroduction(event.target.value);
  };

  const handleChangeMainSubject = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMainSubject(event.target.value);
  };

  return (
    <>
      <Head>
        <title>Write Now</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout style={{display: 'flex'}}>
        <Header style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Title style={{color: '#FFF', margin: '0px'}}>Write Now</Title>
        </Header>
        {step === 'introduction' && (
          <Introduction 
            introduction={introduction}
            setIntroduction={setIntroduction}
            onChangeIntroduction={handleChangeIntroduction}
            onClickNext={handleClickNext}
          />
        )}
        {step === 'mainSubject' && (
          <MainSubject 
            introduction={introduction}
            mainSubject={mainSubject}
            setMainSubject={setMainSubject}
            onChangeIntroduction={handleChangeIntroduction}
            onChangeMainSubject={handleChangeMainSubject}
            onClickNext={handleClickNext}
          />
        )}
        {step === 'conclusion' && (
          <Conclusion 
            mainSubject={mainSubject}
            conclusion={conclusion}
            setConclusion={setConclusion}
            onChangeMainSubject={handleChangeMainSubject}
            onClickNext={handleClickNext}
          />
        )}
        {true && (
          <Editor 
            introduction={introduction}
          />
        )}
      </Layout> 
    </>
  )
}
