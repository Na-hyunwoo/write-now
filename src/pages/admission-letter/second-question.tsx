import { Layout, Typography, theme } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function SecondQuestion() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Header style={{ padding: 0, background: colorBgContainer }}>
        <Title style={{textAlign: "center", padding: '10px 0px 0px 0px'}}>진학 자소서</Title>
      </Header>
      <div style={{display: "flex"}}>
        <Content style={{ margin: '24px 8px 0 16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, height: 'calc(100vh - 110px)' }}>
            content
          </div>
        </Content>
        <Content style={{ margin: '24px 16px 0 8px' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, height: 'calc(100vh - 110px)' }}>
            content
          </div>
        </Content>
      </div>
    </Layout>
  )
}