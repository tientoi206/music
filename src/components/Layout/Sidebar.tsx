'use client';
import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { HomeOutlined, SearchOutlined, HeartOutlined, PlusOutlined, SoundOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps { collapsed: boolean; onMobileToggle?: () => void; }

export default function Sidebar({ collapsed, onMobileToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (key: string) => {
    router.push(key);
    if (onMobileToggle) onMobileToggle();
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={240}
      style={{ background: "#1a1a2e", borderRight: "1px solid #16213e", overflow: "auto", height: "100vh", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100 }}>
      <div style={{ padding: "20px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #16213e" }}>
        <CustomerServiceOutlined style={{ fontSize: 28, color: "#1DB954" }} />
        {!collapsed && <Text strong style={{ fontSize: 20, color: "#fff", margin: 0 }}>TTMusic</Text>}
      </div>
      <Menu mode="inline" selectedKeys={[pathname]} onClick={({ key }) => handleNavigate(key)}
        items={[
          { key: "/", icon: <HomeOutlined />, label: "Trang chủ" },
          { key: "/search", icon: <SearchOutlined />, label: "Tìm kiếm" },
          { key: "/favorites", icon: <HeartOutlined />, label: "Yêu thích" },
        ]}
        style={{ background: "transparent", borderRight: "none", marginTop: 8 }} theme="dark" />
      <div style={{ marginTop: 24, padding: "0 16px" }}>
        {!collapsed && <Text style={{ color: "#888", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Playlist của bạn</Text>}
      </div>
      <Menu mode="inline" selectedKeys={[pathname]} onClick={({ key }) => handleNavigate(key)}
        items={[
          { key: "/playlists", icon: <SoundOutlined />, label: "Playlist" },
          { key: "/playlists/new", icon: <PlusOutlined />, label: "Tạo playlist" },
        ]}
        style={{ background: "transparent", borderRight: "none" }} theme="dark" />
    </Sider>
  );
}
