'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Input, Space, Tag, Spin } from 'antd';
import { SearchOutlined, ClockCircleOutlined } from '@ant-design/icons';
import SongList from '@/components/Music/SongList';
import type { Song } from '@/types';
import { songApi } from '@/lib/mockapi';

const { Title, Text } = Typography;

const SUGGESTED_SEARCHES = ['See Tinh', 'Son Tung', 'V-Pop', 'Nhac tre', 'Mono', 'Den'];

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (kw: string) => {
    if (!kw.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await songApi.search(kw);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      handleSearch(keyword);
    }, 500);
    return () => clearTimeout(debounce);
  }, [keyword, handleSearch]);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ color: '#fff', marginBottom: 16 }}>
          Tìm kiếm
        </Title>
        <Input
          size="large"
          placeholder="Tìm kiếm bài hát, nghệ sĩ..."
          prefix={<SearchOutlined style={{ color: '#888' }} />}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            background: '#1a1a2e',
            border: '1px solid #16213e',
            borderRadius: 24,
            padding: '8px 20px',
            color: '#fff',
            maxWidth: 600,
          }}
        />
      </div>

      {!hasSearched && (
        <div style={{ marginBottom: 32 }}>
          <Space direction="vertical" size={12}>
            <Text style={{ color: '#888' }}>
              <ClockCircleOutlined style={{ marginRight: 8 }} />
              Gợi ý tìm kiếm
            </Text>
            <Space wrap>
              {SUGGESTED_SEARCHES.map((s) => (
                <Tag
                  key={s}
                  onClick={() => setKeyword(s)}
                  style={{
                    background: '#1a1a2e',
                    border: '1px solid #16213e',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: '4px 16px',
                    borderRadius: 16,
                  }}
                >
                  {s}
                </Tag>
              ))}
            </Space>
          </Space>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : hasSearched ? (
        <div>
          <Text style={{ color: '#888', marginBottom: 16, display: 'block' }}>
            Tìm thấy {results.length} kết quả cho &ldquo;{keyword}&rdquo;
          </Text>
          <SongList songs={results} showFavorites />
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: 80,
          background: '#1a1a2e',
          borderRadius: 16,
          border: '1px solid #16213e',
        }}>
          <SearchOutlined style={{ fontSize: 48, color: '#333', marginBottom: 16 }} />
          <Text style={{ color: '#666', fontSize: 16, display: 'block' }}>
            Tìm kiếm bài hát ưa thích của bạn
          </Text>
        </div>
      )}
    </div>
  );
}

