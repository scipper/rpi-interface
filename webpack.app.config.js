const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const yargs = require("yargs").argv;
const LicenseWebpackPlugin = require("license-webpack-plugin").LicenseWebpackPlugin;
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const {AngularCompilerPlugin} = require("@ngtools/webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

let prod = yargs.mode === "production";
let plugins = [];

if(!prod) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.ContextReplacementPlugin(
    /\@angular(\\|\/)core(\\|\/)fesm5/,
    "@angular/core/esm5",
    {}
  ));
}
if(prod) {
  plugins.push(new MiniCssExtractPlugin({
    filename: prod ? "[name].[contenthash].css" : "[name].css",
    chunkFilename: prod ? "[id].[hash].css" : "[id].css"
  }));
}
plugins.push(new HtmlWebpackPlugin({
  filename: 'index.html',
  template: './src/app/index.html',
  chunksSortMode: 'dependency',
  favicon: "./src/assets/images/favicon.ico"
}));
plugins.push(new webpack.HashedModuleIdsPlugin({
  hashFunction: "sha256",
  hashDigest: "hex",
  hashDigestLength: 10
}));
plugins.push(new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(prod)
}));
plugins.push(new AngularCompilerPlugin({
  tsConfigPath: "./tsconfig.json",
  entryModule: "./src/app/app/app.module#AppModule",
  sourceMap: !prod
}));

let devServer = {
  contentBase: ["./dist-app"],
  host: "localhost",
  port: "5000",
  hot: true,
  inline: true,
  compress: true,
  open: true,
  openPage: "",
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
    warnings: false,
    chunks: false,
    chunkModules: false,
    entrypoints: false
  }
};

const optimization = {
  runtimeChunk: "single",
  splitChunks: {
    chunks: "all",
    maxInitialRequests: Infinity,
    minSize: 0,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name(module) {
          // get the name. E.g. node_modules/packageName/not/this/part.js
          // or node_modules/packageName
          const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

          // npm package names are URL-safe, but some servers don"t like @ symbols
          return `npm.${packageName.replace("@", "")}`;
        },
        filename: "[contenthash].bundle.js"
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
    perChunkOutput: false,
    renderLicenses: (modules) => {
      let licenseString = "Lists of " + modules.length + " third-party dependencies.\n";
      modules.forEach(function(mod) {
        licenseString += "     (" + mod.licenseId + ") " +
          mod.name + " (" + mod.packageJson._id + " " +
          "- " + mod.packageJson.homepage + ")\n";
      });
      return licenseString;
    }
  }));

  optimization.minimizer = [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: false,
      uglifyOptions: {
        output: {
          comments: false
        }
      }
    })
  ];
}

module.exports = {

  entry: {
    "styles": "./src/app/styles.scss",
    "app": "./src/app/main.ts"
  },

  output: {
    filename: prod ? "[name].bundle.[contenthash].js" : "[name].bundle.js",
    chunkFilename: prod ? "[id].bundle.[contenthash].js" : "[id].bundle.js",
    path: path.resolve(__dirname, "dist-app"),
    publicPath: "",
    pathinfo: true
  },

  mode: prod ? "production" : "development",

  devtool: prod ? false : "eval-source-map",

  cache: true,

  devServer,

  resolve: {
    unsafeCache: true,
    extensions: [".ts", ".js"],
    alias: {
      assets: path.resolve(__dirname, "src/assets"),
    }
  },

  optimization,

  stats: {
    children: false
  },

  module: {
    rules: [{
      test: /[\/\\]@angular[\/\\].+\.js$/,
      parser: {
        system: true
      }
    }, {
      test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
      loader: "@ngtools/webpack"
    }, {
      test: /\.scss/,
      use: [{
        loader: "raw-loader"
      }, {
        loader: "fast-sass-loader",
        options: {
          includePaths: [
            path.resolve(__dirname, "node_modules"),
            path.resolve(__dirname, "src"),
            path.resolve(__dirname, "src/assets/styles")
          ]
        }
      }]
    }, {
      test: /\.html$/,
      use: [{
        loader: "raw-loader"
      }]
    }, {
      test: /\.(jpe?g|gif|png|svg|ico)$/,
      use: [{
        loader: "file-loader?relativeTo=" + (path.resolve(__dirname, "src/assets")),
        options: {
          name: "[hash].[ext]"
        }
      }]
    }, {
      test: /.(woff|woff2|eot|ttf|otf)$/,
      use: [{
        loader: "file-loader",
        options: {
          name: "[hash].[ext]"
        }
      }]
    }]
  },

  plugins

};
