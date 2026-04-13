import { useState, useEffect, useMemo } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { loginWithGoogleApi } from "../services/auth.api"; 
import { useAuthContext } from "@/context/AuthContext";
import { usePlayer } from "@/context/PlayerContext";
import * as SecureStore from 'expo-secure-store';

const ACCOUNTS_KEY = "user_accounts_list";

export function useAuth() {
  const { user, setUser, setAccounts, loading, setLoading } = useAuthContext();
  const { stopAndClear } = usePlayer();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB, 
      offlineAccess: true,
    });
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.type === 'success' && response.data.idToken) {
        // 1. Panggil API Backend
        const result = await loginWithGoogleApi(response.data.idToken);

        // 2. SIMPAN KE STORAGE HP (Agar Persistent)
        // Kita gunakan fungsi syncUser yang sudah diperbaiki di bawah
        await syncUser(result.user, result.user.id || result.userId);
        
        return result; 
      }
    } catch (error: any) {
      throw error; 
    } finally {
      setLoading(false);
    }
  };
 const isProfileIncomplete = useMemo(() => {
    if (!user) return false;
    return !user.full_name || !user.phone || !user.gender || !user.date_of_birth;
  }, [user]);

  // 2. FUNGSI SYNC (Update State & Memori HP)
  const syncUser = async (userData: any, id: string) => {
    const newUser = { ...userData, id: id, isActive: true };
    setUser(newUser); // Update UI

    const savedData = await SecureStore.getItemAsync(ACCOUNTS_KEY);
    let allAccounts = savedData ? JSON.parse(savedData) : [];
    
    // Matikan status aktif akun lain, tambahkan akun baru
    allAccounts = allAccounts.map((acc: any) => ({ ...acc, isActive: false }));
    const filtered = allAccounts.filter((acc: any) => acc.id !== id);
    const updatedList = [...filtered, newUser];

    await SecureStore.setItemAsync(ACCOUNTS_KEY, JSON.stringify(updatedList));
    if (setAccounts) setAccounts(updatedList);
  };

  // 3. FUNGSI HAPUS TOTAL (Untuk Hapus Akun)
  const removeAccountFromStorage = async (id: string) => {
    const savedData = await SecureStore.getItemAsync(ACCOUNTS_KEY);
    if (savedData) {
      const allAccounts = JSON.parse(savedData);
      const filtered = allAccounts.filter((acc: any) => acc.id !== id);
      await SecureStore.setItemAsync(ACCOUNTS_KEY, JSON.stringify(filtered));
      if (setAccounts) setAccounts(filtered);
    }
    setUser(null);
  };

  const logout = async () => {
    try {
      if (stopAndClear) await stopAndClear();
      await GoogleSignin.signOut().catch(() => {});
      // Ubah status saja, jangan hapus daftar (untuk Switch Account)
      const savedData = await SecureStore.getItemAsync(ACCOUNTS_KEY);
      if (savedData) {
        const updated = JSON.parse(savedData).map((a: any) => ({ ...a, isActive: false }));
        await SecureStore.setItemAsync(ACCOUNTS_KEY, JSON.stringify(updated));
        if (setAccounts) setAccounts(updated);
      }
      setUser(null);
    } catch (e) { console.log(e); }
  };

  return { user, loading, isProfileIncomplete, syncUser, logout, removeAccountFromStorage,loginWithGoogle };
}