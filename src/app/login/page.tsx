'use client';

import React, { useState } from 'react';
import { Typography, Input, Button, Form, Space, Card, message, Divider } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const success = await login(values.email, values.password);
      if (success) {
        message.success('Đăng nhập thành công!');
        router.push('/');
      } else {
        message.error('Email hoặc mật khẩu không đúng!');
      }
    } catch {
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        padding: 24,
      }}
    >
      <Card
        style={{
          width: 420,
          maxWidth: '100%',
          background: '#1a1a2e',
          border: '1px solid #16213e',
          borderRadius: 16,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <CustomerServiceOutlined style={{ fontSize: 48, color: '#1DB954', marginBottom: 12 }} />
          <Title level={2} style={{ color: '#fff', margin: 0 }}>TTMusic</Title>
          <Text style={{ color: '#888' }}>Đăng nhập để tiếp tục</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#666' }} />}
              placeholder="Email"
              size="large"
              style={{ background: '#0f0f23', border: '1px solid #16213e', color: '#fff', borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#666' }} />}
              placeholder="Mật khẩu"
              size="large"
              style={{ background: '#0f0f23', border: '1px solid #16213e', color: '#fff', borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{ borderRadius: 8, height: 44, fontSize: 16 }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: '#888' }}>
            Chưa có tài khoản?{' '}
            <Link href="/register" style={{ color: '#1DB954' }}>Đăng ký ngay</Link>
          </Text>
        </div>

        <Divider style={{ borderColor: '#16213e', color: '#888' }}>Tài khoản demo</Divider>

        <div style={{ background: '#0f0f23', padding: 12, borderRadius: 8 }}>
          <Text style={{ color: '#888', fontSize: 13, display: 'block' }}>
            Email: <Text style={{ color: '#1DB954' }}>admin@musicapp.com</Text>
          </Text>
          <Text style={{ color: '#888', fontSize: 13, display: 'block' }}>
            Mật khẩu: <Text style={{ color: '#1DB954' }}>123456</Text>
          </Text>
        </div>
      </Card>
    </div>
  );
}
