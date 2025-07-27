// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Catatan penting: Plugin Reanimated harus selalu menjadi yang terakhir.
      "react-native-reanimated/plugin",
    ],
  };
};