/* eslint-disable no-param-reassign */
const path = require('path');
const { getPaths, edit } = require('@rescripts/utilities');
const themeVariables = require('./src/config/theme/variables.json');

module.exports = (config) => {
  config.resolve.alias['@layouts'] = path.join(__dirname, './src/layouts');
  config.resolve.alias['@components'] = path.join(__dirname, './src/components');
  config.resolve.alias['@config'] = path.join(__dirname, './src/config');
  config.resolve.alias['@views'] = path.join(__dirname, './src/views');
  config.resolve.alias['@providers'] = path.join(__dirname, './src/providers');

  // Removes warning from pdfjs
  config.module.rules[0].parser.requireEnsure = true;

  const styleLoaders = getPaths(
    // Styleloaders are in config.module.rules inside an object only containing the "oneOf" prop
    (inQuestion) => inQuestion && !!inQuestion.oneOf,
    config
  );

  edit(
    (section) => {
      const loaders = section.oneOf;
      // New style loaders should be added near the end of loaders, but before file-loader
      const fileLoaderIndex = loaders.findIndex(
        ({ loader }) => loader && loader.includes('file-loader')
      );
      const lessLoader = {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: {
                  'primary-color': themeVariables.colors.primary,
                  'link-color': themeVariables.colors.primary,
                  'border-radius-base': themeVariables.radius,
                },
              },
            },
          },
        ],
      };
      loaders.splice(fileLoaderIndex, 0, lessLoader);
      return section;
    },
    styleLoaders,
    config
  );

  return config;
};
