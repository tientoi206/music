'use client';

import React, { useState } from 'react';
import { Typography, Spin, Empty, Modal, Select, message, Button, Space } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import SongCard from './SongCard';
import type { Song } from '@/types';
import { favoriteApi, playlistApi } from '@/lib/mockapi';
import { usePlayerStore } from '@/store/playerStore';

const { Text } = Typography;

interface SongListProps {
  songs: Song[];
  loading?: boolean;
  showFavorites?: boolean;
  showIndex?: boolean;
  title?: string;
}

export default function SongList({ songs, loading, showFavorites, showIndex, title }: SongListProps) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [playlists, setPlaylists] = useState<{ id: string; name: string }[]>([]);
  const playSong = usePlayerStore((state) => state.playSong);

  React.useEffect(() => {
    if (showFavorites) {
      favoriteApi.getAll("u1").then(favSongs => {
        setFavoriteIds(new Set(favSongs.map(s => s.id)));
      });
    }
    playlistApi.getAll().then(pls => {
      setPlaylists(pls.map(p => ({ id: p.id, name: p.name })));
    });
  }, [showFavorites]);

  const handleToggleFavorite = async (songId: string) => {
    const isFav = await favoriteApi.toggle("u1", songId);
    if (isFav) {
      setFavoriteIds(prev => new Set(prev).add(songId));
      message.success("Đã thêm vào yêu thích");
    } else {
      setFavoriteIds(prev => { const next = new Set(prev); next.delete(songId); return next; });
      message.info("Đã xóa khỏi yêu thích");
    }
  };

  const handleAddToPlaylist = (song: Song) => {
    setSelectedSong(song);
    setPlaylistModalOpen(true);
  };

  const handleConfirmAddToPlaylist = async (playlistId: string) => {
    if (!selectedSong) return;
    try {
      await playlistApi.addSong(playlistId, selectedSong.id);
      message.success("Đã thêm bài hát vào playlist");
      setPlaylistModalOpen(false);
      setSelectedSong(null);
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playSong(songs[0], songs);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: 60 }}><Spin size="large" /></div>;
  }

  if (!songs || songs.length === 0) {
    return <Empty description={<Text style={{ color: "#888" }}>Không có bài hát nào</Text>} style={{ padding: 60 }} />;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        {title && <Text style={{ color: "#aaa", fontSize: 14 }}>{title}</Text>}
        <Button
          type="primary"
          size="small"
          icon={<PlayCircleOutlined />}
          onClick={handlePlayAll}
        >
          Phát tất cả
        </Button>
      </div>

      {songs.map((song, index) => (
        <SongCard
          key={song.id}
          song={song}
          showIndex={showIndex ? index : undefined}
          isFavorite={favoriteIds.has(song.id)}
          onToggleFavorite={showFavorites ? handleToggleFavorite : undefined}
          onAddToPlaylist={handleAddToPlaylist}
        />
      ))}

      <Modal
        title="Thêm vào Playlist"
        open={playlistModalOpen}
        onCancel={() => { setPlaylistModalOpen(false); setSelectedSong(null); }}
        footer={null}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn playlist..."
          options={playlists.map(p => ({ label: p.name, value: p.id }))}
          onSelect={handleConfirmAddToPlaylist}
        />
      </Modal>
    </div>
  );
}