'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Spin, Button, message, Image, Space } from 'antd';
import { ArrowLeftOutlined, PlayCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import SongList from '@/components/Music/SongList';
import type { Playlist } from '@/types';
import { playlistApi } from '@/lib/mockapi';
import { usePlayerStore } from '@/store/playerStore';

const { Title, Text } = Typography;

export default function PlaylistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const playSong = usePlayerStore((state) => state.playSong);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!params.id) return;
      try {
        const data = await playlistApi.getById(params.id as string);
        setPlaylist(data || null);
      } catch (error) {
        console.error('Failed to fetch playlist:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [params.id]);

  const handlePlayAll = () => {
    if (playlist?.songs && playlist.songs.length > 0) {
      playSong(playlist.songs[0], playlist.songs);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!playlist) return;
    try {
      await playlistApi.delete(playlist.id);
      message.success('Đã xoá playlist');
      router.push('/playlists');
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Title level={3} style={{ color: '#888' }}>Không tìm thấy playlist</Title>
        <Button type="primary" onClick={() => router.push('/playlists')}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: 16,
          padding: 32,
          marginBottom: 24,
          display: 'flex',
          gap: 24,
          alignItems: 'flex-end',
        }}
      >
        <Image
          src={playlist.coverImage}
          alt={playlist.name}
          width={180}
          height={180}
          style={{ borderRadius: 8, objectFit: 'cover' }}
          preview={false}
          fallback="https://via.placeholder.com/180/1a1a2e/666"
        />
        <div style={{ flex: 1 }}>
          <Text style={{ color: '#888', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            PLAYLIST
          </Text>
          <Title level={2} style={{ color: '#fff', margin: '8px 0' }}>
            {playlist.name}
          </Title>
          <Text style={{ color: '#aaa' }}>{playlist.description}</Text>
          <br />
          <Text style={{ color: '#888', fontSize: 12 }}>
            {playlist.songs?.length || 0} bài hát
          </Text>
          <div style={{ marginTop: 16 }}>
            <Space>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                size="large"
                onClick={handlePlayAll}
                disabled={!playlist.songs || playlist.songs.length === 0}
              >
                Phát tất cả
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeletePlaylist}
              >
                Xoá playlist
              </Button>
            </Space>
          </div>
        </div>
      </div>

      <SongList
        songs={playlist.songs || []}
        showFavorites
      />
    </div>
  );
}

