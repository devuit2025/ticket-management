const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Map aliases to their folders for Metro bundler
config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    '@components': __dirname + '/src/components',
    '@screens': __dirname + '/src/screens',
    '@config': __dirname + '/src/config',
    '@context': __dirname + '/src/context',
    '@hooks': __dirname + '/src/hooks',
    '@store': __dirname + '/src/store',
    '@theme': __dirname + '/src/theme',
    '@utils': __dirname + '/src/utils',
};

module.exports = config;
