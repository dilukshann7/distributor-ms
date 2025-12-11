const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const babelLoader = require("babel-loader");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: argv.mode || "development",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProduction ? "bundle.[contenthash].js" : "bundle.js",
      assetModuleFilename: "assets/[name][hash][ext]",
      clean: true,
      publicPath: "/",
    },
    devtool: isProduction ? "source-map" : "eval-source-map",
    performance: {
      hints: isProduction ? "warning" : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    devServer: {
      static: { directory: path.resolve(__dirname, "dist") },
      port: 8080,
      open: false,
      hot: true,
      compress: true,
      historyApiFallback: true,
      proxy: [
        {
          context: ["/api"],
          target: "http://localhost:3000",
          changeOrigin: true,
        },
      ],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: "> 0.25%, not dead",
                    useBuiltIns: "usage",
                    corejs: 3,
                  },
                ],
              ],
              plugins: [
                ["@babel/plugin-proposal-decorators", { version: "2023-05" }],
                ["@babel/plugin-proposal-class-properties"],
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                sourceMap: isProduction,
              },
            },
            "postcss-loader",
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset/resource",
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024,
            },
          },
        },
      ],
    },
    optimization: {
      minimize: isProduction,
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
          },
          lit: {
            test: /[\\/]node_modules[\\/]lit[\\/]/,
            name: "lit",
            priority: 20,
          },
        },
      },
      runtimeChunk: "single",
    },
    plugins: [
      new htmlWebpackPlugin({
        title: "Distributor Management System",
        filename: "index.html",
        template: "./src/index.html",
        minify: isProduction
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            }
          : false,
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? "styles.[contenthash].css" : "styles.css",
      }),
    ],
  };
};
