import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";

type Track = {
  title: string;
  artist: string;
  image?: string;
  audio: string;
};

export function usePlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });
  }, []);

  const setTrack = async (track: Track) => {
    try {
      // unload sound lama
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audio },
        { shouldPlay: true }
      );

      soundRef.current = sound;
      setCurrentTrack(track);
      setIsPlaying(true);
    } catch (e) {
      console.log("AUDIO ERROR:", e);
    }
  };

  const playPause = async () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  return {
    currentTrack,
    isPlaying,
    setTrack,
    playPause,
  };
}
