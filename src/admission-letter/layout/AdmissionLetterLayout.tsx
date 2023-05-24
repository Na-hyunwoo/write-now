import { Layout, Typography, Menu } from 'antd';
import {
  TeamOutlined,
  FieldTimeOutlined,
  DingdingOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';

const { Sider } = Layout;
const { Title } = Typography;

interface AdmissionLetterLayoutProps {
  children: ReactElement;
}

export default function AdmissionLetterLayout({children}: AdmissionLetterLayoutProps) {
  const router = useRouter();

  const items = [
    {
      key: '1',
      icon: <FieldTimeOutlined />,
      label: <Link href='first-question'>문항 1</Link>,
    },
    {
      key: '2',
      icon: <TeamOutlined />,
      label: <Link href='second-question'>문항 2</Link>,
    },
    {
      key: '3',
      icon: <DingdingOutlined />,
      label: <Link href='third-question'>자율 문항</Link>,
    }
  ];

  const decideDefaultSelectedKeys = () => {
    const currentUrl = router.asPath;

    if (currentUrl.includes('first')) {
      return '1';
    }

    if (currentUrl.includes('second')) {
      return '2';
    }

    return '3';
  }

  return (
    <Layout style={{ width: '100vw', height: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
      >
        <Title level={2} style={{ color: '#FFF', textAlign: 'center', padding: '10px 0px 0px 0px' }}>write-now</Title>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[decideDefaultSelectedKeys()]}
          items={items}
        />
      </Sider>
      {children}
    </Layout>
  )
}