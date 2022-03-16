import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import { baseCss } from './webpack.ayudas.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'web',
  devServer: {
    static: resolve(__dirname, 'dist'),
    devMiddleware: {
      index: true,
      mimeTypes: { phtml: 'text/html' },
      publicPath: '/dist',
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
});
