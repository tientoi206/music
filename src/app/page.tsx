'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Image, Spin, Space, Button } from 'antd';
import { PlayCircleOutlined, RightOutlined, SoundOutlined, HeartOutlined } from '@ant-design/icons';
import SongList from '@/components/Music/SongList';
import type { Song, Album } from '@/types';
import { songApi, albumApi } from '@/lib/mockapi';
import { usePlayerStore } from '@/store/playerStore';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;
const { Meta } = Card;

export default function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const playSong = usePlayerStore((state) => state.playSong);
  const router = useRouter();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songsData, albumsData] = await Promise.all([
          songApi.getAll(),
          albumApi.getAll(),
        ]);
        setSongs(songsData);
        setAlbums(albumsData);
        setTrendingSongs(songsData.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePlayAlbum = (album: Album) => {
    const albumSongs = songs.filter(s => s.albumId === album.id);
    if (albumSongs.length > 0) {
      playSong(albumSongs[0], albumSongs);
    }
  };

  return (
    <div className="fade-in">
      {/* Hero Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          borderRadius: 16,
          padding: isMobile ? "24px" : "40px",
          marginBottom: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <Space direction="vertical" size={isMobile ? 8 : 16}>
            <Title level={isMobile ? 3 : 2} style={{ color: "#fff", margin: 0, fontSize: isMobile ? 22 : 32 }}>
              Chào mừng đến với TTMusic
            </Title>
            <Text style={{ color: "#aaa", fontSize: isMobile ? 13 : 16, maxWidth: 500, display: "block" }}>
              Khám phá hàng ngàn bài hát hot nhất hiện nay, tạo playlist và thưởng thức âm nhạc không giới hạn.
            </Text>
            <Space wrap>
              <Button
                type="primary"
                size={isMobile ? 'middle' : 'large'}
                icon={<PlayCircleOutlined />}
                onClick={() => { if (songs.length > 0) playSong(songs[0], songs); }}
              >
                Nghe ngay
              </Button>
              <Button
                size={isMobile ? 'middle' : 'large'}
                icon={<HeartOutlined />}
                onClick={() => router.push("/favorites")}
                style={{ borderColor: "#1DB954", color: "#1DB954" }}
              >
                Yêu thích
              </Button>
            </Space>
          </Space>
        </div>
      </div>

      {/* Trending Songs */}
      <section style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Title level={isMobile ? 4 : 3} style={{ color: "#fff", margin: 0, fontSize: isMobile ? 16 : 24 }}>
            Bài hát hot
          </Title>
          <Button type="link" icon={<RightOutlined />} onClick={() => router.push("/search")} style={{ fontSize: isMobile ? 12 : 14 }}>
            Xem tất cả
          </Button>
        </div>
        <SongList songs={trendingSongs} loading={loading} showFavorites />
      </section>

      {/* Albums Section */}
      <section style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Title level={isMobile ? 4 : 3} style={{ color: "#fff", margin: 0, fontSize: isMobile ? 16 : 24 }}>
            <SoundOutlined style={{ color: "#1DB954", marginRight: 8 }} />
            Album & Playlist nổi bật
          </Title>
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}><Spin size="large" /></div>
        ) : (
          <Row gutter={[12, 12]}>
            {albums.map((album) => (
              <Col key={album.id} xs={12} sm={8} md={6} lg={4}>
                <Card
                  hoverable
                  style={{ background: "#1a1a2e", border: "1px solid #16213e", borderRadius: 12, overflow: "hidden" }}
                  cover={
                    <div style={{ position: "relative" }}>
                      <Image
                        alt={album.title}
                        src={album.coverImage}
                        width="100%"
                        height={isMobile ? 120 : 180}
                        style={{ objectFit: "cover" }}
                        preview={false}
                        fallback="https://via.placeholder.com/300x180/1a1a2e/666"
                      />
                      <div
                        onClick={() => handlePlayAlbum(album)}
                        style={{
                          position: "absolute", bottom: 8, right: 8,
                          background: "#1DB954", borderRadius: "50%", width: isMobile ? 32 : 40, height: isMobile ? 32 : 40,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", opacity: 0, transition: "opacity 0.3s, transform 0.3s",
                          transform: "translateY(8px)",
                        }}
                        className="play-button"
                      >
                        <PlayCircleOutlined style={{ fontSize: isMobile ? 18 : 24, color: "#fff" }} />
                      </div>
                    </div>
                  }
                >
                  <Meta
                    title={<Text style={{ color: "#fff", fontSize: isMobile ? 12 : 14 }}>{album.title}</Text>}
                    description={<Text style={{ color: "#888", fontSize: isMobile ? 10 : 12 }}>{album.artist}</Text>}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </section>

      {/* All Songs */}
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Title level={isMobile ? 4 : 3} style={{ color: "#fff", margin: 0, fontSize: isMobile ? 16 : 24 }}>
            Tất cả bài hát
          </Title>
        </div>
        <SongList songs={songs} loading={loading} showFavorites showIndex />
      </section>
    </div>
  );
}