// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const ACCOUNTS_KEY = "user_accounts_list";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAppReady, setIsAppReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadStoredAccounts(); }, []);

const loadStoredAccounts = async () => {
    try {
      const saved = await SecureStore.getItemAsync(ACCOUNTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setAccounts(parsed);
        // Cari akun yang aktif
        const active = parsed.find((acc: any) => acc.isActive === true);
        setUser(active || null);
      }
    } catch (e) {
      console.log("Error Storage:", e);
    } finally {
      setIsAppReady(true); 
    }
  };

  // 2. Fungsi Login / Tambah Akun Baru
const syncUser = async (userData: any, userId: string) => {
  const newAccount = { ...userData, id: userId, isActive: true };

  // 1. Ambil daftar akun yang sudah tersimpan di HP sebelumnya
  const saved = await SecureStore.getItemAsync(ACCOUNTS_KEY);
  let list = saved ? JSON.parse(saved) : [];

  // 2. Filter agar tidak ada ID ganda, lalu masukkan akun baru ke daftar
  list = list.filter((acc: any) => acc.id !== userId);
  const updatedList = [...list, newAccount];

  // 3. Simpan kembali daftar lengkap ke memori HP
  await SecureStore.setItemAsync(ACCOUNTS_KEY, JSON.stringify(updatedList));

  // 4. Update state aktif
  setAccounts(updatedList);
  setUser(newAccount);
};

  // 3. Fungsi Pindah Akun (Switch)
  const switchAccount = async (userId: string) => {
    const updated = accounts.map(acc => ({
      ...acc,
      isActive: acc.id === userId
    }));
    const newActive = updated.find(acc => acc.id === userId);
    
    setAccounts(updated);
    setUser(newActive);
    await SecureStore.setItemAsync(ACCOUNTS_KEY, JSON.stringify(updated));
  };

  // 4. Logout (Hanya menghapus satu akun atau semua)
  const logout = async () => {
    const remaining = accounts.filter(acc => acc.id !== user.id);
    if (remaining.length > 0) {
      remaining[0].isActive = true; // Set akun lain jadi aktif
      setAccounts(remaining);
      setUser(remaining[0]);
      await SecureStore.setItemAsync(ACCOUNTS_KEY, JSON.stringify(remaining));
    } else {
      setAccounts([]);
      setUser(null);
      await SecureStore.deleteItemAsync(ACCOUNTS_KEY);
    }
  };

  return (
    <AuthContext.Provider value={{ user, accounts, syncUser, switchAccount, setAccounts, setUser,setLoading, logout, isAppReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);