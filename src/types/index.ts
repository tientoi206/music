export interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  albumId: string;
  url?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  releaseYear: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  userId: string;
  songIds: string[];
  songs?: Song[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Favorite {
  id: string;
  userId: string;
  songId: string;
}
