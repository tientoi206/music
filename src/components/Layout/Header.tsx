'use client';
import React from 'react';
import { Layout, Avatar, Button, Typography, Space, Dropdown } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Text } = Typography;
interface HeaderProps { collapsed: boolean; onToggle: () => void; }

export default function Header({ collapsed, onToggle }: HeaderProps) {
  return (
    <AntHeader style={{ padding: "0 24px", background: "#0f0f23", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #16213e", height: 64, position: "sticky", top: 0, zIndex: 99 }}>
      <Space>
        <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={onToggle} style={{ color: "#fff", fontSize: 18 }} />
        <Text style={{ color: "#fff", fontSize: 16 }}>Chào mừng bạn đến với MusicApp</Text>
      </Space>
      <Dropdown menu={{ items: [
        { key: "profile", icon: <UserOutlined />, label: "Hồ sơ" },
        { key: "settings", icon: <SettingOutlined />, label: "Cài đặt" },
        { type: "divider" as const },
        { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất" },
      ]}} placement="bottomRight">
        <Space style={{ cursor: "pointer" }}>
          <Avatar size={36} icon={<UserOutlined />} style={{ backgroundColor: "#1DB954" }} />
          <Text style={{ color: "#fff" }}>Admin</Text>
        </Space>
      </Dropdown>
    </AntHeader>
  );
}
