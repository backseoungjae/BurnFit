module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
          '@app': './src/app',
          '@screens': './src/screens',
          '@components': './src/components',
          '@features': './src/features',
          '@navigation': './src/navigation',
          '@assets': './src/assets',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@store': './src/store',
          '@types': './src/types',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
