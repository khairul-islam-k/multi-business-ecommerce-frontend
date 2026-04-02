'use client';

import React from 'react';
import { Row, Col, Typography, Space } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import Logo from '../shared/logo';

const { Title, Text, Link } = Typography;

const Footer: React.FC = () => {
  return (
    <footer style={{ background: '#0f172a', color: '#d1d5db', padding: '50px 20px' }}>
      <Row gutter={[32, 32]} justify="space-between" style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Logo & Description */}
        <Col xs={24} sm={12} md={6}>
          <Space orientation="vertical" size="small">
            <Space size={4}>
              <MailOutlined style={{ color: '#f59e0b', fontSize: 20 }} />
              <Logo />
              {/* <Title level={4} style={{ color: 'white', margin: 0 }}>Store X</Title> */}
            </Space>
            <Text style={{ color: '#9ca3af', fontSize: 14 }}>
              The modern e-commerce platform for ambitious brands.
            </Text>
          </Space>
        </Col>

        {/* Product Links */}
        <Col xs={24} sm={12} md={6}>
          <Space orientation="vertical" size="small">
            <Text strong style={{ color: 'white' }}>Product</Text>
            <Link style={{ color: '#d1d5db' }}>Features</Link>
            <Link style={{ color: '#d1d5db' }}>Pricing</Link>
            <Link style={{ color: '#d1d5db' }}>Integrations</Link>
          </Space>
        </Col>

        {/* Resources Links */}
        <Col xs={24} sm={12} md={6}>
          <Space orientation="vertical" size="small">
            <Text strong style={{ color: 'white' }}>Resources</Text>
            <Link style={{ color: '#d1d5db' }}>Documentation</Link>
            <Link style={{ color: '#d1d5db' }}>Blog</Link>
            <Link style={{ color: '#d1d5db' }}>About</Link>
          </Space>
        </Col>

        {/* Company Links */}
        <Col xs={24} sm={12} md={6}>
          <Space orientation="vertical" size="small">
            <Text strong style={{ color: 'white' }}>Company</Text>
            <Link style={{ color: '#d1d5db' }}>Contact</Link>
            <Link style={{ color: '#d1d5db' }}>Login</Link>
          </Space>
        </Col>
      </Row>

      <div style={{ borderTop: '1px solid #374151', marginTop: 40, paddingTop: 20, textAlign: 'center' }}>
        <Text style={{ color: '#6b7280', fontSize: 12 }}>
          © 2026 StoreX. All rights reserved.
        </Text>
      </div>
    </footer>
  );
};

export default Footer;