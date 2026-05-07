'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Spin } from 'antd';
import { HeartFilled } from '@ant-design/icons';
import SongList from '@/components/Music/SongList';
import type { Song } from '@/types';
import { favoriteApi } from '@/lib/mockapi';

const { Title, Text } = Typography;

export default function FavoritesPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await favoriteApi.getAll('u1');
        setSongs(data);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="fade-in">
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)',
          borderRadius: 16,
          padding: 32,
          marginBottom: 24,
        }}
      >
        <HeartFilled style={{ fontSize: 48, color: '#1DB954', marginBottom: 16 }} />
        <Title level={2} style={{ color: '#fff', margin: 0 }}>
          Bài hát yêu thích
        </Title>
        <Text style={{ color: '#aaa' }}>
          {songs.length} bài hát
        </Text>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : (
        <SongList songs={songs} showFavorites />
      )}
    </div>
  );
}

