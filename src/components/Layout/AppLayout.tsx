'use client';

import React, { useState } from 'react';
import { Layout, ConfigProvider, theme } from 'antd';
import Sidebar from './Sidebar';
import Header from './Header';
import PlayerBar from './PlayerBar';

const { Content } = Layout;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#1DB954',
          colorBgContainer: '#1a1a2e',
          colorBgElevated: '#16213e',
          colorText: '#fff',
          colorTextSecondary: '#888',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#0f0f23' }}>
        <Sidebar collapsed={collapsed} />
        <Layout
          style={{
            marginLeft: collapsed ? 80 : 240,
            transition: 'margin-left 0.3s',
            background: '#0f0f23',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
          <Content
            style={{
              padding: '24px',
              background: '#0f0f23',
              overflow: 'auto',
              flex: 1,
              paddingBottom: 96,
            }}
          >
            {children}
          </Content>
        </Layout>
        <PlayerBar />
      </Layout>
    </ConfigProvider>
  );
}
