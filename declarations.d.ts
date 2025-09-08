// declarations.d.ts

// Ini akan memberitahu TypeScript cara menangani berbagai jenis file gambar
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';

// Ini adalah deklarasi yang paling penting untuk masalah Anda saat ini
declare module '*.mp4' {
  const value: any;
  export default value;
}
declare module "*.svg" {
  import React from 'react';
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}