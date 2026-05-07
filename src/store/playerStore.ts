import { create } from 'zustand';
import type { Song } from '@/types';
import { getSongUrl } from '@/lib/zingmp3';

interface PlayerStore {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isShuffled: boolean;
  repeatMode: "none" | "one" | "all";
  audioElement: HTMLAudioElement | null;
  setAudioElement: (audio: HTMLAudioElement | null) => void;
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  addToQueue: (song: Song) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  queue: [],
  isPlaying: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  isShuffled: false,
  repeatMode: "none",
  audioElement: null,

  setAudioElement: (audio) => set({ audioElement: audio }),

  playSong: async (song, queue) => {
    const audio = get().audioElement;
    if (!audio) return;
    try {
      const url = await getSongUrl(song);
      audio.src = url;
      audio.load();
      await audio.play();
      set({ currentSong: song, isPlaying: true, currentTime: 0, queue: queue || [song] });
    } catch (error) { console.error("Failed to play song:", error); }
  },

  togglePlay: () => {
    const audio = get().audioElement;
    if (!audio || !get().currentSong) return;
    if (get().isPlaying) { audio.pause(); set({ isPlaying: false }); }
    else { audio.play().then(() => set({ isPlaying: true })).catch(console.error); }
  },

  nextSong: () => {
    const { queue, currentSong, repeatMode, isShuffled } = get();
    if (queue.length === 0 || !currentSong) return;
    if (repeatMode === "one") { get().playSong(currentSong, queue); return; }
    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    const nextIndex = isShuffled ? Math.floor(Math.random() * queue.length) : (currentIndex + 1) % queue.length;
    if (queue[nextIndex]) get().playSong(queue[nextIndex], queue);
  },

  prevSong: () => {
    const { queue, currentSong, currentTime } = get();
    if (queue.length === 0 || !currentSong) return;
    if (currentTime > 3) { const audio = get().audioElement; if (audio) { audio.currentTime = 0; set({ currentTime: 0 }); } return; }
    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    if (queue[prevIndex]) get().playSong(queue[prevIndex], queue);
  },

  setVolume: (volume) => { const audio = get().audioElement; if (audio) audio.volume = volume; set({ volume }); },
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  toggleShuffle: () => set((state) => ({ isShuffled: !state.isShuffled })),
  cycleRepeatMode: () => { const modes: ("none" | "one" | "all")[] = ["none", "one", "all"]; const { repeatMode } = get(); set({ repeatMode: modes[(modes.indexOf(repeatMode) + 1) % modes.length] }); },
  addToQueue: (song) => set((state) => { if (state.queue.find(s => s.id === song.id)) return state; return { queue: [...state.queue, song] }; }),
}));
