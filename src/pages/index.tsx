import { Col, Row } from "antd";

export default function Home() {
  return (
    <>
      <Row>
        <Col className="flex items-center" span={8}>01. 개인 성향</Col>
        <Col span={8}>02. 작성항목 및 직무</Col>
        <Col span={8}>03. 맞춤</Col>
      </Row>
      <Row></Row>
    </>
  )
}