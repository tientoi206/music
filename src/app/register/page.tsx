'use client';

import React, { useState } from 'react';
import { Typography, Input, Button, Form, Card, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const router = useRouter();

  const onFinish = async (values: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const success = await register(values.name, values.email, values.password);
      if (success) {
        message.success('Đăng ký thành công!');
        router.push('/');
      } else {
        message.error('Email này đã được đăng ký!');
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
          <Title level={2} style={{ color: '#fff', margin: 0 }}>Đăng ký</Title>
          <Text style={{ color: '#888' }}>Tạo tài khoản mới</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên!' },
              { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#666' }} />}
              placeholder="Họ và tên"
              size="large"
              style={{ background: '#0f0f23', border: '1px solid #16213e', color: '#fff', borderRadius: 8 }}
            />
          </Form.Item>

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
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#666' }} />}
              placeholder="Mật khẩu"
              size="large"
              style={{ background: '#0f0f23', border: '1px solid #16213e', color: '#fff', borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#666' }} />}
              placeholder="Xác nhận mật khẩu"
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
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: '#888' }}>
            Đã có tài khoản?{' '}
            <Link href="/login" style={{ color: '#1DB954' }}>Đăng nhập</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}
