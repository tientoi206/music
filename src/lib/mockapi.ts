import type { Song, Album, Playlist, Favorite } from '@/types';

const mockSongs: Song[] = [
  { id: "1", title: "Hồng Nhan", artist: "Jack", thumbnail: "https://i.vietgiaitri.com/2020/2/20/hit-hong-nhan-tron-1-tuoi-dan-mang-lien-lat-lai-bai-phong-van-nghi-van-kicm-da-nham-jack-tu-2018-f3104e.jpeg", albumId: "1", url: "/musics/hongnhan.mp3" },
  { id: "2", title: "Bạc Phận", artist: "Jack", thumbnail: "https://photo-resize-zmp3.zadn.vn/w600_r1x1_jpeg/cover/4/2/5/3/425334e6f252b8c34d74d16177a5eb9d.jpg", albumId: "1", url: "/musics/bacphan.mp3" },
  { id: "3", title: "Sóng Gió", artist: "jack", thumbnail: "https://upload.wikimedia.org/wikipedia/vi/b/bb/Jack_%26_K-ICM_-_S%C3%B3ng_gi%C3%B3.png", albumId: "1", url: "/musics/songgio.mp3" },
  { id: "4", title: "Thiên Lý Ơi", artist: "Jack", thumbnail: "https://i.ytimg.com/vi/OrDB4jpA1g8/maxresdefault.jpg", albumId: "1", url: "/musics/thienlyoi.mp3" },
  { id: "5", title: "Hoa Vô Sắc", artist: "Jack", thumbnail: "https://photo-resize-zmp3.zadn.vn/w600_r1x1_jpeg/cover/6/f/f/3/6ff330930e726af162d634a749b2d4eb.jpg", albumId: "1", url: "/musics/hoavosac.mp3" },
  { id: "6", title: "Đừng Lo Anh Đợi Mà", artist: "MR. Siro", thumbnail: "https://i.ytimg.com/vi/BnWiFq0AxQc/maxresdefault.jpg", albumId: "3", url: "/musics/dungloanhdoima.mp3" },
  { id: "7", title: "Day Dứt Nỗi Đau", artist: "MR. Siro", thumbnail: "https://i.ytimg.com/vi/N4Xak1n497M/maxresdefault.jpg", albumId: "3", url: "/musics/daydutnoidau.mp3" },
  { id: "8", title: "Đi Về NHà", artist: "Đen Vâu", thumbnail: "https://i.ytimg.com/vi/vTJdVE_gjI0/maxresdefault.jpg", albumId: "2", url: "/musics/divenha.mp3" },
  { id: "9", title: "Đưa Nhau Đi Trốn", artist: "Đen Vâu", thumbnail: "https://i1.sndcdn.com/artworks-000141815077-mm8lki-t500x500.jpg", albumId: "2", url: "/musics/duanhauditron.mp3" },
  { id: "10", title: "Đom Đóm", artist: "Jack", thumbnail: "https://photo-resize-zmp3.zadn.vn/w600_r1x1_jpeg/cover/f/e/9/8/fe9875941d98fbbcb8aedc8960ccbc94.jpg", albumId: "1", url: "/musics/domdom.mp3" },
];


const mockAlbums: Album[] = [
  { id: "1", title: "Vì Tinh Tú", artist: "Jack", coverImage: "https://vietnamcopyright.vn/storage/musicans/1776843796-jack.png", releaseYear: 2026 },
  { id: "2", title: "Dìa Dia", artist: "Đen Vâu", coverImage: "https://vcdn1-vnexpress.vnecdn.net/2022/02/09/denvau-5827-1627546466-5337-1644377203.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=rpm2cgIdVzle7xKvlbBCaA", releaseYear: 2026 },
  { id: "3", title: "Nhạc Này Suy Phết", artist: "MR. Siro", coverImage: "https://yt3.googleusercontent.com/3sT1JSdygOdufCcMnHaCr-Pa7Le-kKKQq1IQPHhii8_bff-NMkSo2m4MDD5Pyak2S4m3p0aNcA=s900-c-k-c0x00ffffff-no-rj", releaseYear: 2026 },
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
