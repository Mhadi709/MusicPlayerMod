// services/taddy.ts

const TADDY_API_URL = "https://api.taddy.org/graphql";
const USER_ID = process.env.EXPO_PUBLIC_TADDY_USER_ID!;
const API_KEY = process.env.EXPO_PUBLIC_TADDY_API_KEY!;

export async function searchPodcasts(term: string) {
  try {
    const query = `
      query Search($term: String!) {
        search(term: $term, filterForTypes: [PODCASTSERIES, PODCASTEPISODE]) {
          searchId
          podcastSeries {
            uuid
            name
            description
            imageUrl
            # Series tidak punya audioUrl / duration
          }
          podcastEpisodes {
            uuid
            name
            description
            audioUrl  
            imageUrl
            duration  
          }
        }
      }
    `;

    const response = await fetch(TADDY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-USER-ID": USER_ID,
        "X-API-KEY": API_KEY,
      },
      body: JSON.stringify({
        query,
        variables: { term },
      }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error("GraphQL Error:", json.errors);
      throw new Error(json.errors[0].message);
    }

    return json.data.search;
  } catch (error) {
    console.error("Taddy error:", error);
    throw error;
  }
}

export async function getPodcastDetail(uuid: string) {
  const query = `
    query GetPodcast($uuid: ID!) {
      series: getPodcastSeries(uuid: $uuid) {
        uuid
        name
        description
        imageUrl
        episodes {
          uuid
          name
          description
          audioUrl
        }
      }
      episode: getPodcastEpisode(uuid: $uuid) {
        uuid 
        podcastSeries {
          uuid
          name
          description
          imageUrl
          episodes {
            uuid
            name
            description
            audioUrl
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(TADDY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-USER-ID": USER_ID,
        "X-API-KEY": API_KEY,
      },
      body: JSON.stringify({ query, variables: { uuid } }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error("GraphQL Syntax Error:", json.errors[0].message);
      return null;
    }

    // 1. Jika ID tersebut milik Series
    if (json.data?.series) {
      return json.data.series;
    }

    // 2. Jika ID tersebut milik Episode, ambil data Series induknya
    if (json.data?.episode?.podcastSeries) {
      return json.data.episode.podcastSeries;
    }

    return null;
  } catch (error) {
    console.error("Network Error Taddy:", error);
    throw error;
  }
}