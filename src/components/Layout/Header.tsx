'use client';
import React from 'react';
import { Layout, Avatar, Button, Typography, Space, Dropdown } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

const { Header: AntHeader } = Layout;
const { Text } = Typography;
interface HeaderProps { collapsed: boolean; onToggle: () => void; isMobile: boolean; }

export default function Header({ collapsed, onToggle, isMobile }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return (
      <AntHeader style={{ padding: isMobile ? "0 12px 0 56px" : "0 24px", background: "#0f0f23", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #16213e", height: 64, position: "sticky", top: 0, zIndex: 10 }}>
        <Space>
          {!isMobile && (
            <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={onToggle} style={{ color: "#fff", fontSize: 18 }} />
          )}
          {!isMobile && <Text style={{ color: "#fff", fontSize: 16 }}>Chào mừng bạn đến với TTMusic</Text>}
        </Space>
        <Space size={isMobile ? 4 : 8}>
          <Button type="primary" icon={<LoginOutlined />} onClick={() => router.push('/login')} style={{ borderRadius: 8 }} size={isMobile ? 'small' : 'middle'}>
            {!isMobile && 'Đăng nhập'}
          </Button>
          <Button icon={<UserAddOutlined />} onClick={() => router.push('/register')} style={{ borderColor: '#1DB954', color: '#1DB954', borderRadius: 8 }} size={isMobile ? 'small' : 'middle'}>
            {!isMobile && 'Đăng ký'}
          </Button>
        </Space>
      </AntHeader>
    );
  }

  return (
    <AntHeader style={{ padding: isMobile ? "0 12px 0 56px" : "0 24px", background: "#0f0f23", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #16213e", height: 64, position: "sticky", top: 0, zIndex: 10 }}>
      <Space>
        {!isMobile && (
          <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={onToggle} style={{ color: "#fff", fontSize: 18 }} />
        )}
        {!isMobile && <Text style={{ color: "#fff", fontSize: 16 }}>Xin chào, {user?.name || 'Admin'}</Text>}
      </Space>
      <Dropdown menu={{ items: [
        { key: "profile", icon: <UserOutlined />, label: "Hồ sơ" },
        { type: "divider" as const },
        { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất", danger: true },
      ], onClick: ({ key }) => { if (key === 'logout') handleLogout(); } }} placement="bottomRight">
        <Space style={{ cursor: "pointer" }}>
          <Avatar size={isMobile ? 32 : 36} icon={<UserOutlined />} style={{ backgroundColor: "#1DB954" }} />
          {!isMobile && <Text style={{ color: "#fff" }}>{user?.name || 'Admin'}</Text>}
        </Space>
      </Dropdown>
    </AntHeader>
  );
}
