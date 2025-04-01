const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  
  const { transformer, resolver } = config;
  
  // Add svg to assetExts to ensure they get bundled
  config.resolver.assetExts = resolver.assetExts.filter(ext => ext !== 'svg');
  
  // Add svg to sourceExts to allow importing them as React components
  config.resolver.sourceExts = [...resolver.sourceExts, 'svg'];
  
  // Use react-native-svg-transformer to transform SVG files
  config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
  
  return config;
})();
