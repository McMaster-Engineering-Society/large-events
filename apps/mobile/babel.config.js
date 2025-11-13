module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for React Navigation - must be last
      'react-native-reanimated/plugin',
    ],
  };
};
