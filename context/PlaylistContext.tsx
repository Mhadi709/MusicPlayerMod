import React, { createContext, useContext, useState, useCallback } from "react";
import { getUserPlaylistsApi } from "@/services/auth.api";
import { getMusicList } from "@/services/music.api";

const coverCache: Record<string, string[]> = {};

interface PlaylistContextType {
  playlists: any[];
  playlistCovers: Record<string, string[]>;
  loadPlaylists: (userId: string) => Promise<void>;
  refreshPlaylists: (userId: string) => Promise<void>;
  isLoading: boolean;
}

const PlaylistContext = createContext<PlaylistContextType>({
  playlists: [],
  playlistCovers: {},
  loadPlaylists: async () => {},
  refreshPlaylists: async () => {},
  isLoading: false,
});

export function PlaylistProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [playlistCovers, setPlaylistCovers] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchCoversForPlaylists = async (playlistList: any[]) => {
    const playlistsWithTracks = playlistList.filter((p) => p.track_ids?.length > 0);
    if (playlistsWithTracks.length === 0) return;

    try {
      const allTracks = await getMusicList(100);
      const trackMap: Record<string, string> = {};
      allTracks.forEach((t: any) => {
        if (t.image && t.image.trim() !== "") {
          trackMap[String(t.id)] = t.image;
        }
      });

      const newCovers: Record<string, string[]> = {};
      playlistsWithTracks.forEach((playlist) => {
        const covers = (playlist.track_ids || [])
          .slice(0, 4)
          .map((id: string) => trackMap[id] || "https://via.placeholder.com/300")
          .filter(Boolean);
        newCovers[playlist.id] = covers;
        coverCache[playlist.id] = covers;
      });

      setPlaylistCovers((prev) => ({ ...prev, ...newCovers }));
    } catch (e) {
      console.log("Error fetch covers:", e);
    }
  };

  const loadPlaylists = useCallback(async (userId: string) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const data = await getUserPlaylistsApi(userId);
      setPlaylists(data);
      await fetchCoversForPlaylists(data);
    } catch (e) {
      console.log("Error load playlists:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshPlaylists = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      const data = await getUserPlaylistsApi(userId);
      setPlaylists(data);
      await fetchCoversForPlaylists(data);
    } catch (e) {
      console.log("Error refresh playlists:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <PlaylistContext.Provider
      value={{ playlists, playlistCovers, loadPlaylists, refreshPlaylists, isLoading }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export const usePlaylist = () => useContext(PlaylistContext);