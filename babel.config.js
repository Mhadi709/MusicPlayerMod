module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // hanya gunakan satu plugin Reanimated!
      // jangan tambahkan react-native-worklets secara manual
      'react-native-reanimated/plugin',

      // jika kamu menggunakan expo-router
      require.resolve('expo-router/babel'),
    ],
  };
};
