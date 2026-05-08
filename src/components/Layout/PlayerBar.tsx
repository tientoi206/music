'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Layout, Space, Typography, Slider, Button, Image, Tooltip, Modal, List } from 'antd';
import { StepBackwardOutlined, StepForwardOutlined, CaretRightOutlined, PauseOutlined, SoundOutlined, ShakeOutlined, RetweetOutlined, OrderedListOutlined, DeleteOutlined } from '@ant-design/icons';
import { usePlayerStore } from '@/store/playerStore';
import { formatDuration } from '@/lib/zingmp3';

const { Text } = Typography;
const { Footer } = Layout;

export default function PlayerBar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queueOpen, setQueueOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { currentSong, queue, isPlaying, volume, currentTime, duration, isShuffled, repeatMode, playSong, togglePlay, nextSong, prevSong, setVolume, setCurrentTime, setDuration, toggleShuffle, cycleRepeatMode, setAudioElement, removeFromQueue } = usePlayerStore();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!audioRef.current) { audioRef.current = new Audio(); setAudioElement(audioRef.current); }
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => { if (repeatMode === "one") { audio.currentTime = 0; audio.play(); } else nextSong(); };
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    return () => { audio.removeEventListener("timeupdate", handleTimeUpdate); audio.removeEventListener("durationchange", handleDurationChange); audio.removeEventListener("ended", handleEnded); };
  }, [setCurrentTime, setDuration, setAudioElement, nextSong, repeatMode]);

  if (!currentSong) return (
    <Footer style={{ background: "#1a1a2e", borderTop: "1px solid #16213e", padding: "12px 24px", textAlign: "center", position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
      <Text style={{ color: "#666", fontSize: isMobile ? 12 : 14 }}>Chọn bài hát để bắt đầu phát nhạc</Text>
    </Footer>
  );

  // Mobile player bar - compact
  if (isMobile) {
    return (
      <>
        <Footer style={{ background: "#1a1a2e", borderTop: "1px solid #16213e", padding: "6px 12px", position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000, height: 120 }}>
          {/* Progress bar on top */}
          <div style={{ margin: "0 -12px", marginBottom: 4 }}>
            <Slider min={0} max={duration || 100} value={currentTime} onChange={(v) => { if (audioRef.current) { audioRef.current.currentTime = v; setCurrentTime(v); } }} style={{ margin: "0 4px", padding: 0 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Song info */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
              <Image src={currentSong.thumbnail} alt={currentSong.title} width={40} height={40} style={{ borderRadius: 4, objectFit: "cover" }} preview={false} fallback="https://via.placeholder.com/40" />
              <div style={{ minWidth: 0 }}>
                <Text strong style={{ color: "#fff", fontSize: 12, display: "block", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentSong.title}</Text>
                <Text style={{ color: "#888", fontSize: 10 }}>{currentSong.artist}</Text>
              </div>
            </div>
            {/* Controls */}
            <Space size={4}>
              <Button type="text" icon={<StepBackwardOutlined style={{ color: "#fff", fontSize: 16 }} />} onClick={prevSong} size="small" />
              <Button type="primary" shape="circle" icon={isPlaying ? <PauseOutlined /> : <CaretRightOutlined />} onClick={togglePlay} size="small" style={{ backgroundColor: "#1DB954", borderColor: "#1DB954", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }} />
              <Button type="text" icon={<StepForwardOutlined style={{ color: "#fff", fontSize: 16 }} />} onClick={nextSong} size="small" />
              <Button type="text" icon={<OrderedListOutlined style={{ color: queue.length > 0 ? "#1DB954" : "#888", fontSize: 16 }} />} onClick={() => setQueueOpen(true)} size="small" />
            </Space>
          </div>
          {/* Time labels */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
            <Text style={{ color: "#888", fontSize: 10 }}>{formatDuration(Math.floor(currentTime))}</Text>
            <Text style={{ color: "#888", fontSize: 10 }}>{formatDuration(Math.floor(duration))}</Text>
          </div>
        </Footer>

        {/* Queue Modal */}
        <Modal
          title={<Space><OrderedListOutlined /><span>DS phát ({queue.length})</span></Space>}
          open={queueOpen}
          onCancel={() => setQueueOpen(false)}
          footer={null}
          width="95%"
          styles={{ content: { background: "#1a1a2e", border: "1px solid #16213e" }, header: { background: "#1a1a2e", borderBottom: "1px solid #16213e" } }}
        >
          {queue.length === 0 ? (
            <Text style={{ color: "#666", display: "block", textAlign: "center", padding: 20 }}>Danh sách phát trống</Text>
          ) : (
            <List
              dataSource={queue}
              renderItem={(song, index) => (
                <List.Item
                  style={{ borderBottom: "1px solid #16213e", padding: "8px 0", cursor: "pointer" }}
                  onClick={() => playSong(song, queue)}
                  actions={[
                    <Button key="remove" type="text" icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />} onClick={(e) => { e.stopPropagation(); removeFromQueue(song.id); }} />
                  ]}
                >
                  <Space>
                    <Text style={{ color: currentSong?.id === song.id ? "#1DB954" : "#666", width: 24, textAlign: "center", fontSize: 12 }}>
                      {currentSong?.id === song.id && isPlaying ? "♫" : index + 1}
                    </Text>
                    <div>
                      <Text strong style={{ color: currentSong?.id === song.id ? "#1DB954" : "#fff", fontSize: 13, display: "block" }}>{song.title}</Text>
                      <Text style={{ color: "#888", fontSize: 11 }}>{song.artist}</Text>
                    </div>
                  </Space>
                </List.Item>
              )}
            />
          )}
        </Modal>
      </>
    );
  }

  // Desktop player bar
  return (
    <>
      <Footer style={{ background: "#1a1a2e", borderTop: "1px solid #16213e", padding: "8px 24px", position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000, height: 80 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", maxWidth: 1400, margin: "0 auto", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: "0 0 300px" }}>
            <Image src={currentSong.thumbnail} alt={currentSong.title} width={48} height={48} style={{ borderRadius: 4, objectFit: "cover" }} preview={false} fallback="https://via.placeholder.com/48" />
            <div>
              <Text strong style={{ color: "#fff", fontSize: 14, display: "block", lineHeight: 1.2 }}>{currentSong.title}</Text>
              <Text style={{ color: "#888", fontSize: 12 }}>{currentSong.artist}</Text>
            </div>
          </div>
          <div style={{ flex: 1, maxWidth: 600 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 4 }}>
              <Tooltip title="Phát ngẫu nhiên">
                <Button type="text" icon={<ShakeOutlined style={{ color: isShuffled ? "#1DB954" : "#888", fontSize: 16 }} />} onClick={toggleShuffle} size="small" />
              </Tooltip>
              <Button type="text" icon={<StepBackwardOutlined style={{ color: "#fff", fontSize: 18 }} />} onClick={prevSong} size="small" />
              <Button type="primary" shape="circle" icon={isPlaying ? <PauseOutlined /> : <CaretRightOutlined />} onClick={togglePlay} size="large" style={{ backgroundColor: "#1DB954", borderColor: "#1DB954", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }} />
              <Button type="text" icon={<StepForwardOutlined style={{ color: "#fff", fontSize: 18 }} />} onClick={nextSong} size="small" />
              <Tooltip title={repeatMode === "one" ? "Lặp 1 bài" : repeatMode === "all" ? "Lặp tất cả" : "Không lặp"}>
                <Button type="text" icon={<RetweetOutlined style={{ color: repeatMode !== "none" ? "#1DB954" : "#888" }} />} onClick={cycleRepeatMode} size="small" />
              </Tooltip>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Text style={{ color: "#888", fontSize: 11, minWidth: 35, textAlign: "right" }}>{formatDuration(Math.floor(currentTime))}</Text>
              <Slider min={0} max={duration || 100} value={currentTime} onChange={(v) => { if (audioRef.current) { audioRef.current.currentTime = v; setCurrentTime(v); } }} style={{ flex: 1, margin: "0 4px" }} />
              <Text style={{ color: "#888", fontSize: 11, minWidth: 35 }}>{formatDuration(Math.floor(duration))}</Text>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: "0 0 200px", justifyContent: "flex-end" }}>
            <SoundOutlined style={{ color: "#888", fontSize: 16 }} />
            <Slider min={0} max={100} value={volume * 100} onChange={(v) => setVolume(v / 100)} style={{ width: 100, margin: 0 }} />
            <Tooltip title="Danh sách phát">
              <Button type="text" icon={<OrderedListOutlined style={{ color: queue.length > 0 ? "#1DB954" : "#888", fontSize: 16 }} />} onClick={() => setQueueOpen(true)} size="small" />
            </Tooltip>
          </div>
        </div>
      </Footer>

      {/* Queue Modal */}
      <Modal
        title={<Space><OrderedListOutlined /><span>Danh sách phát ({queue.length} bài)</span></Space>}
        open={queueOpen}
        onCancel={() => setQueueOpen(false)}
        footer={null}
        width={500}
        styles={{ content: { background: "#1a1a2e", border: "1px solid #16213e" }, header: { background: "#1a1a2e", borderBottom: "1px solid #16213e" } }}
      >
        {queue.length === 0 ? (
          <Text style={{ color: "#666", display: "block", textAlign: "center", padding: 20 }}>Danh sách phát trống</Text>
        ) : (
          <List
            dataSource={queue}
            renderItem={(song, index) => (
              <List.Item
                style={{ borderBottom: "1px solid #16213e", padding: "8px 0", cursor: "pointer" }}
                onClick={() => playSong(song, queue)}
                actions={[
                  <Button key="remove" type="text" icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />} onClick={(e) => { e.stopPropagation(); removeFromQueue(song.id); }} />
                ]}
              >
                <Space>
                  <Text style={{ color: currentSong?.id === song.id ? "#1DB954" : "#666", width: 24, textAlign: "center" }}>
                    {currentSong?.id === song.id && isPlaying ? "♫" : index + 1}
                  </Text>
                  <div>
                    <Text strong style={{ color: currentSong?.id === song.id ? "#1DB954" : "#fff", fontSize: 13, display: "block" }}>{song.title}</Text>
                    <Text style={{ color: "#888", fontSize: 11 }}>{song.artist}</Text>
                  </div>
                </Space>
              </List.Item>
            )}
          />
        )}
      </Modal>
    </>
  );
}