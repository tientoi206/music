'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Image, Spin, Empty, Button, Modal, Input, Form, message } from 'antd';
import { PlusOutlined, SoundOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import type { Playlist } from '@/types';
import { playlistApi } from '@/lib/mockapi';
import { usePlayerStore } from '@/store/playerStore';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;
const { Meta } = Card;

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const playSong = usePlayerStore((state) => state.playSong);

  const fetchPlaylists = async () => {
    try {
      const data = await playlistApi.getAll();
      setPlaylists(data);
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async (values: { name: string; description: string }) => {
    try {
      await playlistApi.create({
        name: values.name,
        description: values.description,
        coverImage: 'https://via.placeholder.com/300x300/1a1a2e/1DB954?text=Playlist',
        userId: 'u1',
        songIds: [],
      });
      message.success('Tạo Playlist thành công!');
      setModalOpen(false);
      form.resetFields();
      fetchPlaylists();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const handleDeletePlaylist = async (id: string) => {
    try {
      await playlistApi.delete(id);
      message.success('Đã xoá playlist');
      fetchPlaylists();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.songs && playlist.songs.length > 0) {
      playSong(playlist.songs[0], playlist.songs);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ color: '#fff', margin: 0 }}>
            Playlist của tôi
          </Title>
          <Text style={{ color: '#888' }}>{playlists.length} playlist</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
          size="large"
        >
          Tạo Playlist
        </Button>
      </div>

      {playlists.length === 0 ? (
        <Empty
          image={<SoundOutlined style={{ fontSize: 64, color: '#333' }} />}
          description={
            <Text style={{ color: '#888' }}>
              Bạn chưa có Playlist nào. Hãy tạo Playlist đầu tiên!
            </Text>
          }
        />
      ) : (
        <Row gutter={[16, 16]}>
          {playlists.map((playlist) => (
            <Col key={playlist.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{
                  background: '#1a1a2e',
                  border: '1px solid #16213e',
                  borderRadius: 12,
                }}
                cover={
                  <div style={{ position: 'relative' }}>
                    <Image
                      alt={playlist.name}
                      src={playlist.coverImage}
                      width="100%"
                      height={200}
                      style={{ objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                      preview={false}
                      fallback="https://via.placeholder.com/300x200/1a1a2e/666"
                    />
                    <div
                      onClick={() => handlePlayPlaylist(playlist)}
                      style={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        background: '#1DB954',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                      }}
                      className="play-button-overlay"
                    >
                      <PlayCircleOutlined style={{ fontSize: 24, color: '#fff' }} />
                    </div>
                  </div>
                }
                actions={[
                  <Button
                    key="view"
                    type="link"
                    onClick={() => router.push(`/playlists/${playlist.id}`)}
                  >
                    Xem
                  </Button>,
                  <Button
                    key="delete"
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeletePlaylist(playlist.id)}
                  >
                    Xoá
                  </Button>,
                ]}
              >
                <Meta
                  title={<Text style={{ color: '#fff', fontSize: 14 }}>{playlist.name}</Text>}
                  description={
                    <div>
                      <Text style={{ color: '#888', fontSize: 12 }}>{playlist.description}</Text>
                      <br />
                      <Text style={{ color: '#666', fontSize: 11 }}>
                        {playlist.songIds.length} bài hát
                      </Text>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title="Tạo playlist mới"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreatePlaylist}>
          <Form.Item
            name="name"
            label="Tên playlist"
            rules={[{ required: true, message: 'Vui lòng nhập tên playlist' }]}
          >
            <Input placeholder="Nhập tên playlist..." />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea placeholder="Mô tả về playlist..." rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

