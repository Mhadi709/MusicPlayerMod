import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { Audio, AVPlaybackStatus, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";

export interface Track {
  title: string;
  artist: string;
  image: string;
  audio: string;
}

interface PlayerContextType {
  sound: Audio.Sound | null;
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  showMiniPlayer: boolean;
  setTrack: (track: Track) => Promise<void>;
  playPause: () => Promise<void>;
  seekTo: (time: number) => Promise<void>;
  handleNext: () => Promise<void>;
  handlePrev: () => Promise<void>;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  isShuffle: boolean;
  repeatMode: "off" | "one" | "all";
  setShowMiniPlayer: (v: boolean) => void;
  stopAndClear: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const currentUrlRef = useRef<string>("");
  const isChangingRef = useRef(false);
  
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off");
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const onStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      setDuration((status.durationMillis ?? 0) / 1000);
      setIsPlaying(status.isPlaying);
    }
  };

  const stopAndClear = async () => {
    try {
      isChangingRef.current = false;
      currentUrlRef.current = "";
      
      if (soundRef.current) {
        try { await soundRef.current.stopAsync(); } catch (e) {}
        try { await soundRef.current.unloadAsync(); } catch (e) {}
        soundRef.current = null;
      }
      
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
      setCurrentTrack(null);
      
      console.log("✅ Cleared");
    } catch (error) {
      console.error("❌ Clear error:", error);
    }
  };
  const setTrack = async (track: Track) => {
    if (!track.audio || track.audio === "undefined" || isChangingRef.current) return;
    if (currentUrlRef.current === track.audio && soundRef.current) return;

    isChangingRef.current = true;
    
   try {
    if (soundRef.current) {
      const oldSound = soundRef.current;
      soundRef.current = null;
      await oldSound.unloadAsync().catch(() => {});
    }


      // 2. Beri jeda agar OS Android membersihkan RAM audio sebelumnya
      await new Promise(r => setTimeout(r, 300));

    const { sound } = await Audio.Sound.createAsync(
      { uri: track.audio },
      { shouldPlay: true },
      onStatusUpdate
    );

      soundRef.current = sound;
      currentUrlRef.current = track.audio;
      setCurrentTrack(track);
      setShowMiniPlayer(true);

    } catch (error) {
      console.error(" Audio Engine Fail:", error);
      currentUrlRef.current = "";
    } finally {
      isChangingRef.current = false;
    }
  };

  const playPause = async () => {
    if (!soundRef.current) {
      console.warn("⚠️ No sound");
      return;
    }

    try {
      const status = await soundRef.current.getStatusAsync();
      if (!status.isLoaded) return;

      if (status.isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
    } catch (error) {
      console.error("❌ Play/Pause error:", error);
    }
  };

  const seekTo = async (sec: number) => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.setPositionAsync(sec * 1000);
    } catch (error) {
      console.error("❌ Seek error:", error);
    }
  };

  const handleNext = async () => { console.log("⏭️ Next"); };
  const handlePrev = async () => { console.log("⏮️ Prev"); };
  const toggleShuffle = () => setIsShuffle(v => !v);
  const toggleRepeat = () => {
    setRepeatMode(prev => prev === "off" ? "all" : prev === "all" ? "one" : "off");
  };

  return (
    <PlayerContext.Provider
      value={{
        sound: soundRef.current,
        showMiniPlayer,
        currentTrack,
        isPlaying,
        position,
        duration,
        setTrack,
        playPause,
        seekTo,
        handleNext,
        handlePrev,
        toggleShuffle,
        toggleRepeat,
        isShuffle,
        repeatMode,
        setShowMiniPlayer,
        stopAndClear,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within PlayerProvider");
  return context;
};