import axios from 'axios';
import type { Song } from '@/types';

export async function getSongUrl(song: Song): Promise<string> {
  if (song.url) return song.url;
  try {
    const response = await axios.get("/api/zingmp3/song/" + song.zingmp3_id, { timeout: 5000 });
    if (response.data?.url) return response.data.url;
  } catch (error) { console.warn("Cannot fetch from ZingMP3, using fallback audio:", error); }
  return "/musics/test.mp3";
}

export function formatDuration(seconds: number): string {
  const rounded = Math.floor(seconds);
  const mins = Math.floor(rounded / 60);
  const secs = rounded % 60;
  return mins + ":" + secs.toString().padStart(2, "0");
}
