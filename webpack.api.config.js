const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const webpack = require("webpack");
const yargs = require("yargs").argv;
const LicenseWebpackPlugin = require("license-webpack-plugin").LicenseWebpackPlugin;
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const nodemonPlugin = require("nodemon-webpack-plugin");

let prod = yargs.mode === "production";
let plugins = [];

if(!prod) {
  plugins.push(new nodemonPlugin());
}
plugins.push(new webpack.HashedModuleIdsPlugin({
  hashFunction: "sha256",
  hashDigest: "hex",
  hashDigestLength: 10
}));
plugins.push(new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(prod)
}));

if(prod) {
  plugins.unshift(new CleanWebpackPlugin());
  plugins.push(new LicenseWebpackPlugin({
    pattern: /.*/,
    unacceptablePattern: /GPL/,
    abortOnUnacceptableLicense: true,
    addBanner: true,
    perChunkOutput: false
  }));
}

module.exports = {

  entry: {
    api: "./src/api/main.ts"
  },

  output: {
    filename: prod ? "[name].bundle.[contenthash].js" : "[name].bundle.js",
    chunkFilename: prod ? "[id].bundle.[contenthash].js" : "[id].bundle.js",
    path: path.resolve(__dirname, "dist-api")
  },

  mode: prod ? "production" : "development",

  devtool: prod ? false : "eval-source-map",

  cache: true,

  watch: !prod,

  stats: {
    assets: false,
    colors: true,
    errors: true,
    errorDetails: true,
    exclude: [/node_modules/],
    hash: true,
    modules: false,
    performance: true,
    reasons: true,
    timings: true,
    warnings: false
  },

  target: "node",

  resolve: {
    unsafeCache: true,
    extensions: [".ts", ".js"]
  },

  module: {
    rules: [{
      test: /\.ts|\.js?$/,
      exclude: /node_modules/,
      use: [{
        loader: "ts-loader"
      }]
    }]
  },

  plugins

};
