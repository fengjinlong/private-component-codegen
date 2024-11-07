import React from 'react';
import { Card, Button, Typography, Row, Col } from 'antd';

const { Title } = Typography;

interface ConfirmCodegenProps {
  onYesClick: () => void;
  onNoClick: () => void;
}

const ConfirmCodegen: React.FC<ConfirmCodegenProps> = ({ onYesClick, onNoClick }) => {
  return (
    <Card
      style={{
        padding: '24px',
        maxWidth: '320px',
        margin: 'auto',
        textAlign: 'center',
        // boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px'
      }}
    >
      <Title level={4} style={{ marginBottom: '24px' }}>
        Do you want to start generating the business component?
      </Title>
      <Row gutter={[16, 16]} justify="center">
        <Col>
          <Button type="primary" onClick={onYesClick} style={{ minWidth: '80px' }}>
            Yes
          </Button>
        </Col>
        <Col>
          <Button type="default" danger onClick={onNoClick} style={{ minWidth: '80px' }}>
            No
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default ConfirmCodegen;
