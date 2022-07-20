import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { merge } from 'webpack-merge';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import common from './webpack.common.js';
import { baseCss } from './webpack.ayudas.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'web',
  devServer: {
    static: resolve(__dirname, 'publico'),
    devMiddleware: {
      index: true,
      mimeTypes: { phtml: 'text/html' },
      publicPath: '/publico',
      serverSideRender: true,
      writeToDisk: true,
    },
    client: {
      logging: 'error',
    },
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: 'style-loader',
          },
          ...baseCss,
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!datos/**'],
    }),
  ],
});
