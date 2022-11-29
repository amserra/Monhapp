module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        "allowUndefined": false,
      }],
      // Reanimated plugin has to be listed last.
      'react-native-reanimated/plugin',
    ]
  };
};
