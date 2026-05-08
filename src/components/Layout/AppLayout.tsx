'use client';

import React, { useState, useEffect } from 'react';
import { Layout, ConfigProvider, theme, Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Sidebar from './Sidebar';
import Header from './Header';
import PlayerBar from './PlayerBar';

const { Content } = Layout;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const sidebarWidth = collapsed ? 80 : 240;

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
      <Layout style={{ height: '100vh', background: '#0f0f23' }}>
        {/* Desktop sidebar - only render on desktop */}
        {!isMobile && (
          <Sidebar collapsed={collapsed} onMobileToggle={() => {}} />
        )}

        {/* Mobile hamburger button - only render on mobile */}
        {isMobile && (
          <div style={{
            position: 'fixed', top: 0, left: 0, zIndex: 99,
            height: 64, display: 'flex', alignItems: 'center', paddingLeft: 12,
          }}>
            <Button
              type="text"
              icon={<MenuOutlined style={{ color: '#fff', fontSize: 22 }} />}
              onClick={() => setMobileDrawerOpen(true)}
              style={{ width: 40, height: 40 }}
            />
          </div>
        )}

        {/* Mobile drawer */}
        <Drawer
          placement="left"
          open={isMobile && mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          width={260}
          styles={{
            body: { padding: 0, background: '#1a1a2e' },
            mask: { background: 'rgba(0,0,0,0.6)' },
            header: { display: 'none' },
          }}
          closable={false}
        >
          <Sidebar collapsed={false} onMobileToggle={() => setMobileDrawerOpen(false)} />
        </Drawer>

        <Layout
          style={{
            marginLeft: isMobile ? 0 : sidebarWidth,
            transition: 'margin-left 0.3s',
            background: '#0f0f23',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} isMobile={isMobile} />
          <Content
            style={{
              padding: isMobile ? '12px' : '24px',
              paddingTop: isMobile ? '76px' : '24px',
              background: '#0f0f23',
              overflow: 'auto',
              flex: 1,
              paddingBottom: isMobile ? 140 : 96,
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
