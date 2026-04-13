import { Router, router } from "expo-router";

type NavigateToNowPlayingParams = {
  id: string;
  name: string;
  artist_name: string;
  audio: string;
  image?: string | null;
  monthly_listeners?: number;
  artistDescription?: string;
};

export function navigateToNowPlaying(router: Router, item: NavigateToNowPlayingParams) {
  router.replace({
    pathname: "/(drawer)/NowPlayingScreen",
    params: {
      trackId: item.id,
      title: item.name,
      artist: item.artist_name,
      audio: item.audio, 
      image:
        item.image && item.image.trim() !== ""
          ? item.image
          : "https://via.placeholder.com/300",
    },
  });
}
