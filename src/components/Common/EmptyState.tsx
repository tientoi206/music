'use client';

import React from 'react';
import { Empty, Typography } from 'antd';

const { Text } = Typography;

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

export default function EmptyState({
  icon,
  title = 'Không có dứ liệu',
  description = 'Hiện tại chưa có dữ liệu nào hiển thị.',
}: EmptyStateProps) {
  return (
    <div style={{ padding: 80, textAlign: 'center' }}>
      <Empty
        image={icon || Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div>
            <Text strong style={{ color: '#fff', fontSize: 16, display: 'block', marginBottom: 8 }}>
              {title}
            </Text>
            <Text style={{ color: '#888' }}>{description}</Text>
          </div>
        }
      />
    </div>
  );
}

