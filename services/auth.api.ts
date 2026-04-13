// services/auth.api.ts
import axios from "axios";

const API_BASE_URL = "https://aksestodatabase.up.railway.app/api"; 

// hooks/useAuth.ts atau register.tsx
console.log("SENDING TO URL:", `${API_BASE_URL}/auth/google`);
export async function loginWithGoogleApi(idToken: string) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/google`, {
      idToken,
    });
    return res.data; 
  } catch (error) {
    throw error;
  }
}

export async function loginWithEmail(email: string, password: string) {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });

  return res.data;
}

export async function registerEmail(
  email: string,
  password: string,
  fullName: string,
  dateOfBirth: string
) {
  const res = await axios.post(
    `${API_BASE_URL}/users/register`,
    {
      email,
      password,
      full_name: fullName,
      date_of_birth: dateOfBirth,
    }
  );
  return res.data;
}

export async function loginWithPhoneApi(idToken: string) {
  const res = await axios.post(`${API_BASE_URL}/auth/phone`, { idToken });
  return res.data;
}

export interface Artist {
  id?: string;
  name: string;
  image?: string;
}

export async function addArtistApi(artistData: Artist) {
  const res = await axios.post(`${API_BASE_URL}/artists`, artistData);
  return res.data;
}


// services/auth.api.ts
export async function saveUserArtistsApi(userId: string, artistIds: string[]) {
  try {
    const res = await axios.post(`${API_BASE_URL}/users/artists`, {
      userId,
      artistIds,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}


export async function updateUserProfileApi(userId: string, data: any) {
  try {
    const res = await axios.put(`${API_BASE_URL}/users/${userId}`, data);
    return res.data; // Mengembalikan { user } terbaru
  } catch (error) {
    throw error;
  }
}
//Get All user
export async function getAllUsersApi() {
  try {
    const res = await axios.get(`${API_BASE_URL}/users`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function createPlaylistApi(userId: string, name: string, p0: string) {
  const res = await axios.post(`${API_BASE_URL}/playlists`, { userId, name });
  return res.data;
}

// Tambah Lagu/Podcast ke Playlist
export async function addTrackToPlaylistApi(playlistId: string, trackId: string) {
  const res = await axios.post(`${API_BASE_URL}/playlists/add`, { playlistId, trackId });
  return res.data;
}

// Ambil Daftar Playlist
export async function getUserPlaylistsApi(userId: string) {
  const res = await axios.get(`${API_BASE_URL}/playlists?userId=${userId}`);
  return res.data;
}

export async function updatePlaylistNameApi(playlistId: string, newName: string) {
  const res = await axios.put(`${API_BASE_URL}/playlists/${playlistId}`, { name: newName });
  return res.data;
}
//like fungsion
export async function toggleFavoriteApi(payload: {
  userId: string;
  songId: string;
  title: string;
  artist: string;
  image: string;
  audio: string;
}) {
  try {
    const res = await axios.post(`${API_BASE_URL}/favorites`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
}

//bookmark funsion
export async function toggleBookmarkApi(payload: {
  userId: string;
  itemId: string;
  title: string;
  artist: string;
  image: string;
  type: "music" | "podcast"; 
}) {
  try {
    const res = await axios.post(`${API_BASE_URL}/bookmarks`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getBookmarksApi(userId: string) {
  try {
    const res = await axios.get(`${API_BASE_URL}/bookmarks?userId=${userId}`);
    return res.data; 
  } catch (error) {
    throw error;
  }
}

export async function deleteUserApi(userId: string) {
  const res = await axios.delete(`${API_BASE_URL}/users/${userId}`);
  return res.data;
}