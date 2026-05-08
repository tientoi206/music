'use client';

import React, { useEffect, useState } from 'react';
import { Typography, Space, Button, Image, Tag } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, HeartOutlined, HeartFilled, PlusOutlined } from '@ant-design/icons';
import type { Song } from '@/types';
import { usePlayerStore } from '@/store/playerStore';
import { formatDuration } from '@/lib/zingmp3';

const { Text } = Typography;

interface SongCardProps {
  song: Song;
  isFavorite?: boolean;
  showIndex?: number;
  onToggleFavorite?: (songId: string) => void;
  onAddToPlaylist?: (song: Song) => void;
}

export default function SongCard({ song, isFavorite, showIndex, onToggleFavorite, onAddToPlaylist }: SongCardProps) {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerStore();
  const isCurrentSong = currentSong?.id === song.id;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const [realDuration, setRealDuration] = useState<number | null>(null);

  // Load duration from audio URL for all songs (not just current)
  useEffect(() => {
    if (!song.url) return;
    let cancelled = false;
    const tempAudio = new Audio();
    tempAudio.preload = 'metadata';

    const handleMetadata = () => {
      if (!cancelled && tempAudio.duration && isFinite(tempAudio.duration)) {
        setRealDuration(tempAudio.duration);
      }
      tempAudio.removeEventListener('loadedmetadata', handleMetadata);
    };

    tempAudio.addEventListener('loadedmetadata', handleMetadata);
    tempAudio.src = song.url;

    return () => {
      cancelled = true;
      tempAudio.removeEventListener('loadedmetadata', handleMetadata);
      tempAudio.src = '';
    };
  }, [song.url]);

  const displayDuration = realDuration || 0;

  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  const imgSize = isMobile ? 40 : 48;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: isMobile ? "6px 8px" : "8px 12px",
        borderRadius: 8,
        cursor: "pointer",
        background: isCurrentSong ? "rgba(29, 185, 84, 0.1)" : "transparent",
        transition: "background 0.3s",
        border: isCurrentSong ? "1px solid rgba(29, 185, 84, 0.3)" : "1px solid transparent",
      }}
      className="song-card"
      onMouseEnter={(e) => { if (!isCurrentSong) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
      onMouseLeave={(e) => { if (!isCurrentSong) e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ position: "relative", marginRight: 10, flexShrink: 0, width: imgSize, height: imgSize }}>
        {showIndex !== undefined && (
          <div style={{
            position: "absolute", top: -6, left: -6, zIndex: 2,
            width: isMobile ? 18 : 20, height: isMobile ? 18 : 20,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: isCurrentSong ? "#1DB954" : "#333",
            borderRadius: "50%",
            color: "#fff", fontSize: isMobile ? 9 : 10, fontWeight: 600,
          }}>
            {showIndex + 1}
          </div>
        )}
        <Image
          src={song.thumbnail}
          alt={song.title}
          width={imgSize}
          height={imgSize}
          style={{ borderRadius: 4, objectFit: "cover" }}
          preview={false}
          fallback="https://via.placeholder.com/48/1a1a2e/666"
        />
        <div
          onClick={handlePlay}
          style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.5)", borderRadius: 4, opacity: 0,
            transition: "opacity 0.3s", cursor: "pointer",
          }}
          className="play-overlay"
        >
          {isCurrentSong && isPlaying ? (
            <PauseCircleOutlined style={{ fontSize: isMobile ? 20 : 24, color: "#fff" }} />
          ) : (
            <PlayCircleOutlined style={{ fontSize: isMobile ? 20 : 24, color: "#fff" }} />
          )}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Text
            strong
            style={{
              color: isCurrentSong ? "#1DB954" : "#fff",
              fontSize: isMobile ? 13 : 14, display: "block",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}
          >
            {song.title}
          </Text>
          {isCurrentSong && !isMobile && <Tag color="#1DB954" style={{ fontSize: 10, lineHeight: "16px", padding: "0 6px" }}>Đang phát</Tag>}
        </div>
        <Text style={{ color: "#888", fontSize: isMobile ? 11 : 12 }}>{song.artist}</Text>
      </div>

      <Text style={{ color: "#666", fontSize: isMobile ? 11 : 12, marginRight: isMobile ? 8 : 12, flexShrink: 0 }}>
        {formatDuration(displayDuration)}
      </Text>

      <Space size={isMobile ? 2 : 4}>
        {onToggleFavorite && (
          <Button
            type="text"
            icon={isFavorite ? <HeartFilled style={{ color: "#1DB954", fontSize: isMobile ? 14 : 16 }} /> : <HeartOutlined style={{ color: "#888", fontSize: isMobile ? 14 : 16 }} />}
            size="small"
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(song.id); }}
          />
        )}
        {onAddToPlaylist && !isMobile && (
          <Button
            type="text"
            icon={<PlusOutlined style={{ color: "#888" }} />}
            size="small"
            onClick={(e) => { e.stopPropagation(); onAddToPlaylist(song); }}
          />
        )}
      </Space>
    </div>
  );
}