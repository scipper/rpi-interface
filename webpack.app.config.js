const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const yargs = require("yargs").argv;
const LicenseWebpackPlugin = require("license-webpack-plugin").LicenseWebpackPlugin;
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

let prod = yargs.mode === "production";
let plugins = [];

if(!prod) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
}
plugins.push(new webpack.HashedModuleIdsPlugin({
  hashFunction: "sha256",
  hashDigest: "hex",
  hashDigestLength: 10
}));
plugins.push(new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(prod)
}));

let devServer = {
  contentBase: ["./dist"],
  host: "localhost",
  port: "5000",
  hot: true,
  inline: true,
  compress: true,
  open: true,
  openPage: '',
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
  }
};

const optimization = {
  splitChunks: {
    cacheGroups: {
      commons: {
        test: /node_modules/,
        name: "vendor",
        chunks: "all"
      }
    }
  }
};

if(prod) {
  plugins.unshift(new CleanWebpackPlugin());
  plugins.push(new LicenseWebpackPlugin({
    pattern: /.*/,
    unacceptablePattern: /GPL/,
    abortOnUnacceptableLicense: true,
    addBanner: true,
    perChunkOutput: false
  }));

  optimization.minimizer = [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true // set to true if you want JS source maps
    })
  ];
}

module.exports = {

  entry: {
    "app": "./src/api/main.ts"
  },

  output: {
    filename: prod ? "[name].bundle.[contenthash].js" : "[name].bundle.js",
    chunkFilename: prod ? "[id].bundle.[contenthash].js" : "[id].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
    pathinfo: true
  },

  mode: prod ? "production" : "development",

  devtool: prod ? false : "eval-source-map",

  cache: true,

  devServer,

  resolve: {
    unsafeCache: true,
    extensions: [".ts", ".js"]
  },

  optimization,

  stats: {
    children: false
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
