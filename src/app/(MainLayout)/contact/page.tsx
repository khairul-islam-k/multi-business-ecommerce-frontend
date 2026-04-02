'use client';

import React from 'react';
import { Row, Col, Form, Input, Button, Typography, Card } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { motion, Variants } from 'framer-motion';

const { Title, Text } = Typography;

/* ----------------------------------
   Animation Variants (TS-safe)
----------------------------------- */
const leftVariants: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
};

const rightVariants: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
};

const ContactUs = () => {
  return (
    <section style={{ padding: '80px 16px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[32, 32]} align="middle">

          {/* LEFT: CONTACT INFO */}
          <Col xs={24} md={12}>
            <motion.div
              variants={leftVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Title level={3}>Contact Us</Title>
              <Text type="secondary">
                Have questions or need help? Reach out to us anytime.
              </Text>

              <div style={{ marginTop: 32 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <MailOutlined style={{ fontSize: 20, color: '#fa8c16' }} />
                  <Text>support@fleekstore.com</Text>
                </div>

                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <PhoneOutlined style={{ fontSize: 20, color: '#fa8c16' }} />
                  <Text>+880 1234 567 890</Text>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <EnvironmentOutlined style={{ fontSize: 20, color: '#fa8c16' }} />
                  <Text>Dhaka, Bangladesh</Text>
                </div>
              </div>
            </motion.div>
          </Col>

          {/* RIGHT: CONTACT FORM */}
          <Col xs={24} md={12}>
            <motion.div
              variants={rightVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card bordered={false} style={{ borderRadius: 12 }}>
                <Form layout="vertical">
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[{ required: true, message: 'First name required' }]}
                      >
                        <Input placeholder="John" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[{ required: true, message: 'Last name required' }]}
                      >
                        <Input placeholder="Doe" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Email required' },
                      { type: 'email', message: 'Invalid email' },
                    ]}
                  >
                    <Input placeholder="john@example.com" />
                  </Form.Item>

                  <Form.Item
                    label="Subject"
                    name="subject"
                    rules={[{ required: true, message: 'Subject required' }]}
                  >
                    <Input placeholder="How can we help?" />
                  </Form.Item>

                  <Form.Item
                    label="Message"
                    name="message"
                    rules={[{ required: true, message: 'Message required' }]}
                  >
                    <Input.TextArea rows={4} placeholder="Write your message..." />
                  </Form.Item>

                  <Button type="primary" block size="large">
                    Send Message
                  </Button>
                </Form>
              </Card>
            </motion.div>
          </Col>

        </Row>
      </div>
    </section>
  );
};

export default ContactUs;