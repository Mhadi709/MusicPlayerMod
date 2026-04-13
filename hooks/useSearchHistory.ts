import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "search_history";
const MAX_HISTORY = 10;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  // Load history saat pertama kali
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch (e) {}
  };

  const addHistory = async (query: string) => {
    if (!query.trim()) return;
    const cleaned = query.trim();
    const updated = [
      cleaned,
      ...history.filter(h => h !== cleaned) // hapus duplikat
    ].slice(0, MAX_HISTORY);
    
    setHistory(updated);
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const removeHistory = async (query: string) => {
    const updated = history.filter(h => h !== query);
    setHistory(updated);
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const clearHistory = async () => {
    setHistory([]);
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (e) {}
  };

  return { history, addHistory, removeHistory, clearHistory };
}