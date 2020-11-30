const webpack = require('webpack');
const { resolve } = require('path');

const { name, version } = require('../package.json')
const { library } = require('./library');
const WebpackBar = require('webpackbar')
const getClientEnvironment = require('./envs/index')
const nonCssModuleRegex = /\.(less|css)$/;
const cssModuleRegex = /\.module\.(less|css)$/;

function envInjector (mode) {
  const env = getClientEnvironment('/', mode)
  return new webpack.DefinePlugin(env.stringified)
}

const getStyleLoader = enableCssModule => {
  const moduleOption = enableCssModule ? {
    modules: true,
    localIdentName: '[local]___[hash:base64:5]',
  } : {}

  return ([
    {
      loader: 'style-loader',
      options: { injectType: 'singletonStyleTag' }
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        ...moduleOption,
      }
    },
    {
      loader: 'less-loader',
      options: {
        sourceMap: true,
        javascriptEnabled: true,
        ...moduleOption,
      },
    },
  ]
  )
}

const base = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  output: {
    library,
    libraryTarget: 'umd',
    filename: '[name].js',
    path: resolve(__dirname, '../lib')
  },
  module: {
    rules: [
      {
        test: /\.(jsx|tsx|js|ts)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              cacheDirectory: true,
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
              plugins: [
                // ["import", {
                //   "libraryName": "antd",
                //   "libraryDirectory": "es",
                //   "style": true,
                // }],
                ["@babel/proposal-decorators", { "legacy": true }],
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-async-generator-functions',
                "@babel/plugin-proposal-optional-chaining",
                ['@babel/plugin-transform-runtime', {
                  'regenerator': true,
                  'helpers': false
                }],
              ]
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              quiet: true,
              failOnError: false,
              fix: true
            }
          }
        ]
      },
      {
        oneOf: [
          {
            test: nonCssModuleRegex,
            exclude: cssModuleRegex,
            use: getStyleLoader(false)
          },
          {
            test: cssModuleRegex,
            use: getStyleLoader(true)
          }
        ]
      }
    ],
  },

  plugins: [
    new webpack.BannerPlugin({banner: `${name}@${version}`}),
    envInjector(process.env.NODE_ENV || 'development'),
    new WebpackBar({
      name
    })
  ],
}

module.exports = base
