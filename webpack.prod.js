import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import common from './webpack.common.js';
import { baseCss } from './webpack.ayudas.js';

export default merge(common, {
  mode: 'production',
  target: ['es5', 'browserslist'],
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [MiniCssExtractPlugin.loader, ...baseCss],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!datos/**'],
    }),
    new MiniCssExtractPlugin(),
  ],
});
