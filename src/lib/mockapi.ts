import type { Song, Album, Playlist, Favorite } from '@/types';

const mockSongs: Song[] = [
  { id: "1", title: "Hồng Nhan", artist: "Jack", thumbnail: "https://photo-resize-zmp3.zadn.vn/w600_r1x1_jpeg/cover/d/b/1/1/db11f9bb085242d06f298939da35a094.jpg", albumId: "1", url: "/musics/hongnhan.mp3" },
  { id: "2", title: "Bạc Phận", artist: "Jack", thumbnail: "https://via.placeholder.com/48/1a1a2e/1DB954?text=WFY", albumId: "1", url: "/musics/bacphan.mp3" },
  { id: "3", title: "Sóng Gió", artist: "jack", thumbnail: "https://via.placeholder.com/48/1a1a2e/1DB954?text=EL", albumId: "2", url: "/musics/songgio.mp3" },
  { id: "4", title: "Thiên Lý Ơi", artist: "Jack", thumbnail: "https://via.placeholder.com/48/1a1a2e/1DB954?text=CT", albumId: "2", url: "/musics/thienlyoi.mp3" },
  { id: "5", title: "Anh Nho Ra", artist: "Vu.", thumbnail: "https://via.placeholder.com/48/1a1a2e/1DB954?text=ANR", albumId: "3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { id: "6", title: "Bat Tinh Yeu Len", artist: "Hoa Minzy, Tang Duy Tan", thumbnail: "https://via.placeholder.com/48/1a1a2e/1DB954?text=BTYL", albumId: "3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
  { id: "7", title: "Cat Doi Noi Sau", artist: "Tang Duy Tan", thumbnail: "https://via.placeholder.com/48/1a1a2e/1DB954?text=CDNS", albumId: "1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
  { id: "8", title: "Anh Sao Va Bau Troi", artist: "T.R.I", thumbnail: "https://via.placeholder.com/48/1a1a2e/1DB954?text=AS", albumId: "1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  { id: "9", title: "Hai Trieu Nam", artist: "Den x Bien", thumbnail: "https://via.placeholder.com/48/1a1a2e/1DB954?text=HTN", albumId: "2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
  { id: "10", title: "Chiu Thuong Chiu Kho", artist: "Bich Phuong", thumbnail: "https://via.placeholder.com/48/1a1a2e/1DB954?text=CTCK", albumId: "3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
];

const mockAlbums: Album[] = [
  { id: "1", title: "Nhac Hot Thang 5", artist: "Nhieu nghe si", coverImage: "https://via.placeholder.com/300x180/1a1a2e/1DB954?text=Album+1", releaseYear: 2024 },
  { id: "2", title: "V-Pop Hay Nhat", artist: "Nhieu nghe si", coverImage: "https://via.placeholder.com/300x180/1a1a2e/1DB954?text=Album+2", releaseYear: 2024 },
  { id: "3", title: "Nhac Tre Cuoi Tuan", artist: "Nhieu nghe si", coverImage: "https://via.placeholder.com/300x180/1a1a2e/1DB954?text=Album+3", releaseYear: 2024 },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const songApi = {
  getAll: async (): Promise<Song[]> => { await delay(300); return [...mockSongs]; },
  getById: async (id: string): Promise<Song | undefined> => { await delay(200); return mockSongs.find(s => s.id === id); },
  search: async (keyword: string): Promise<Song[]> => { await delay(300); const kw = keyword.toLowerCase(); return mockSongs.filter(s => s.title.toLowerCase().includes(kw) || s.artist.toLowerCase().includes(kw)); },
};

export const albumApi = {
  getAll: async (): Promise<Album[]> => { await delay(300); return [...mockAlbums]; },
  getById: async (id: string): Promise<Album | undefined> => { await delay(200); return mockAlbums.find(a => a.id === id); },
};

let mockPlaylists: Playlist[] = [
  { id: "p1", name: "Nhac Yeu Thich", description: "Cac bai hat yeu thich cua toi", coverImage: mockAlbums[0].coverImage, userId: "u1", songIds: ["1", "2", "3"] },
  { id: "p2", name: "Top 2024", description: "Nhung bai hit nam 2024", coverImage: mockAlbums[1].coverImage, userId: "u1", songIds: ["4", "5", "6"] },
];

export const playlistApi = {
  getAll: async (): Promise<Playlist[]> => { await delay(300); return mockPlaylists.map(p => ({ ...p, songs: p.songIds.map(id => mockSongs.find(s => s.id === id)!).filter(Boolean) })); },
  getById: async (id: string): Promise<Playlist | undefined> => { await delay(200); const p = mockPlaylists.find(p => p.id === id); if (p) return { ...p, songs: p.songIds.map(id => mockSongs.find(s => s.id === id)!).filter(Boolean) }; },
  create: async (data: Omit<Playlist, "id">): Promise<Playlist> => { await delay(200); const np: Playlist = { ...data, id: "p" + Date.now() }; mockPlaylists.push(np); return np; },
  addSong: async (playlistId: string, songId: string): Promise<void> => { await delay(100); const pl = mockPlaylists.find(p => p.id === playlistId); if (pl && !pl.songIds.includes(songId)) pl.songIds.push(songId); },
  delete: async (id: string): Promise<void> => { await delay(100); mockPlaylists = mockPlaylists.filter(p => p.id !== id); },
};

let mockFavorites: Favorite[] = [{ id: "f1", userId: "u1", songId: "1" }, { id: "f2", userId: "u1", songId: "5" }];

export const favoriteApi = {
  getAll: async (userId: string = "u1"): Promise<Song[]> => { await delay(300); const ids = mockFavorites.filter(f => f.userId === userId).map(f => f.songId); return mockSongs.filter(s => ids.includes(s.id)); },
  toggle: async (userId: string, songId: string): Promise<boolean> => { await delay(100); const e = mockFavorites.find(f => f.userId === userId && f.songId === songId); if (e) { mockFavorites = mockFavorites.filter(f => f.id !== e.id); return false; } else { mockFavorites.push({ id: "f" + Date.now(), userId, songId }); return true; } },
};
