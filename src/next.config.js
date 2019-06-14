/* eslint-disable */
const withLess = require('@zeit/next-less');
const withOffline = require('next-offline');
const lessToJS = require('less-vars-to-js');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const fs = require('fs');
const path = require('path');

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8')
);

module.exports = withOffline(
  withLess({
    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: themeVariables // make your antd custom effective
    },
    env: {
      THEME_VARIABLES: themeVariables
    },
    webpack: (config, { isServer }) => {
      if (isServer) {
        const antStyles = /antd\/.*?\/style.*?/;
        const origExternals = [...config.externals];
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback();
            if (typeof origExternals[0] === 'function') {
              origExternals[0](context, request, callback);
            } else {
              callback();
            }
          },
          ...(typeof origExternals[0] === 'function' ? [] : origExternals)
        ];

        config.module.rules.unshift({
          test: antStyles,
          use: 'null-loader'
        });
      }

      if (process.env.NODE_ENV === 'production') {
        config.plugins = config.plugins.filter(
          plugin => plugin.constructor.name !== 'UglifyJsPlugin'
        );

        config.plugins.push(
          new TerserPlugin({
            parallel: true,
            terserOptions: {
              ecma: 6
            }
          })
        );

        config.plugins.push(new OptimizeCSSAssetsPlugin());
      }
      return config;
    }
  })
);
