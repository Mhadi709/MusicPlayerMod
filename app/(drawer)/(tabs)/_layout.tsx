import React from "react";
import { Slot } from "expo-router";
import MiniNavbar from "../../../components/MiniNavbar";
import MiniPlayer from "@/components/MiniPlayer";

export default function TabLayout() {
  return (
    <>
      {/* Tempat menampilkan isi halaman */}
      <Slot />

      {/* Navbar tetap muncul di bawah */}
      <MiniNavbar />

        <MiniPlayer />
    </>
  );
}
