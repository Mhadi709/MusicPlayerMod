import Constants from "expo-constants";

const PEXELS_API_KEY = Constants.expoConfig?.extra?.PEXELS_API_KEY;
const VIDEO_BASE_URL = "https://api.pexels.com/videos";

/**
 * Search video dari Pexels (HD / Full HD)
 */
export const searchPexelsVideos = async (
  query: string,
  perPage: number = 10
) => {
  try {
    const res = await fetch(
      `${VIDEO_BASE_URL}/search?query=${query}&per_page=${perPage}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed fetch Pexels Video");
    }

    const json = await res.json();
    return json.videos;
  } catch (error) {
    console.log("ERR FETCH PEXELS VIDEO:", error);
    return [];
  }
};

/**
 * Get curated (video populer, kualitas tinggi)
 */
export const getPexelsCuratedVideos = async (
  perPage: number = 10
) => {
  try {
    const res = await fetch(
      `${VIDEO_BASE_URL}/popular?per_page=${perPage}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    const json = await res.json();
    return json.videos;
  } catch (error) {
    console.log("ERR CURATED VIDEO:", error);
    return [];
  }
};



