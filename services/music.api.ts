import { Track } from "@/app/(drawer)/(tabs)/homepage";
import { Album } from "@/app/(drawer)/albumplaylist";

export const JAMENDO_API = process.env.EXPO_PUBLIC_JAMENDO_API!;
export const JAMENDO_CLIENT_ID = process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID!;


/**
 * GET list lagu dengan informasi artis, album, cover, dll
 */
export async function getMusicList(limit = 20): Promise<Track[]> {
  const url = `${JAMENDO_API}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&include=musicinfo&audioformat=mp32`;

  const res = await fetch(url);
  const json = await res.json();

  return json.results.map((track: any) => ({
    id: track.id,
    name: track.name,
    artist_name: track.artist_name,

    audio: track.audio || track.audiodownload || "", 
    image:
      track.image ||
      track.album_image ||
      "https://usercontent.jamendo.com?type=album&id=0&width=300",

    duration: track.duration,
    genre: track.musicinfo?.genre ?? [],
  }));
}



export async function getArtistImage(artistId: string) {
  const url = `${JAMENDO_API}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&artist_id=${artistId}&limit=1`;

  const res = await fetch(url);
  const data = await res.json();

  // Jika artis tidak punya image → ambil album cover track pertamanya
  return data.results[0]?.album_image || null;
}


export async function getArtistsWithImage(limit = 20) {
  const artists = await getArtistsList(limit);

  const enrichedArtists = await Promise.all(
    artists.map(async (artist: { image: any; id: string; }) => {
      const image = artist.image;

      let finalImage = image;

      // Jika image kosong → pakai album cover track pertama
      if (!finalImage) {
        finalImage = await getArtistImage(artist.id);
      }

      // Fallback terakhir
      if (!finalImage) {
        finalImage = "https://via.placeholder.com/200";
      }

      return {
        ...artist,
        finalImage,
      };
    })
  );

  return enrichedArtists;
}


/**
 * GET detail 1 lagu berdasarkan ID
 */
export async function getTrackDetail(trackId: string) {
  const url = `${JAMENDO_API}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=jsonpretty&id=${trackId}&include=musicinfo+stats`;

  const res = await fetch(url);
  const data = await res.json();
   const track = data.results[0];

    return {
    ...track,
    monthly_listeners: track.stats?.play_count_total || Math.floor(Math.random() * 500000) + 10000
  };
}

export async function getArtistsList(limit = 20) {
  try {
    const url = `${process.env.EXPO_PUBLIC_JAMENDO_API}/artists/?client_id=${process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID}&limit=${limit}&format=json`;

    const res = await fetch(url);
    const text = await res.text();

    if (!text.startsWith("{")) {
      throw new Error("Response is not JSON");
    }

    const json = JSON.parse(text);
    return json.results;
  } catch (e) {
    console.error("ERR FETCH ARTIST:", e);
    return [];
  }
}

/**
 * GET daftar artis
 */
export async function getArtists(limit = 20) {
  const url = `${JAMENDO_API}/artists/?client_id=${JAMENDO_CLIENT_ID}&format=jsonpretty&limit=${limit}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.results;
}

/**
 * GET SEARCH
 */

export async function searchMusicJamendo(query: string, limit = 20) {
  if (!query) return [];

  const url = `${process.env.EXPO_PUBLIC_JAMENDO_API}/tracks/?client_id=${process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID}&format=json&limit=${limit}&namesearch=${encodeURIComponent(
    query
  )}`;

  const res = await fetch(url);
  const json = await res.json();

  return json.results.map((item: any) => ({
  id: item.id,
  title: item.name,
  artist: item.artist_name,
  audioUrl: item.audio || item.audiodownload || "",
  image: {
    uri: item.album_image || "https://via.placeholder.com/100",
  },
}));

}

/**
 * GET SONGS
 */

export const searchMusicJamendo1 = async (query: string) => {
  const CLIENT_ID = process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID;

  const res = await fetch(
    `https://api.jamendo.com/v3.0/tracks?client_id=${CLIENT_ID}&format=json&limit=10&search=${query}&include=musicinfo`
  );

  const json = await res.json();
  return json;
};

/**
 * GET ALBUM
 */

// services/music.api.ts
export async function getAlbumList(limit = 30) {
  try {
    const url = `${JAMENDO_API}/albums/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&imagesize=300`;

    console.log("FETCH:", url);

    const res = await fetch(url);
    const json = await res.json();

    console.log("RAW JAMENDO:", json);

    // HANDLE ERROR DARI JAMENDO
    if (json.headers?.status === "failed") {
      console.error("JAMENDO ERROR:", json.headers.error_message);
      return [];
    }

    if (!json.results || json.results.length === 0) {
      return [];
    }

    return json.results.map((album: any) => ({
      id: album.id,
      title: album.name,         
      artist: album.artist_name, 
      image:
        album.image ||
        album.image_medium ||
        album.image_small ||
        "https://via.placeholder.com/300",
    }));
  } catch (error) {
    console.error("GET ALBUM ERROR:", error);
    return [];
  }
}
// GANTI fungsi getTracksByAlbum di music.api.ts
export async function getTracksByAlbum(albumId: string) {
  try {
    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=50&album_id=${albumId}&audioformat=mp32`;
    const res = await fetch(url);
    const json = await res.json();

    return json.results
      .filter((track: any) => track.audio || track.preview)
      .map((track: any) => ({
        id: track.id,
        title: track.name,
        artist: track.artist_name,
        audio: track.audio ?? track.preview, 
        duration: track.duration,
      }));
  } catch (error) {
    return [];
  }
}





