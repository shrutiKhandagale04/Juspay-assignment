const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require("path");

process.env["NODE_ENV"] = "production";

module.exports = merge([
  common,
  {
    mode: "production",
    performance:{
      hints:false,
      maxEntrypointSize: 512000,
      maxAssetSize:512000,
    },output: {
      path: path.resolve(__dirname, 'dist'), // This is the path to your build folder
      filename: 'app.js',
    },
    optimization: {
      minimize: true,
      minimizer: [
        // For webpack@5 you can use the ... syntax to extend existing minimizers (i.e. terser-webpack-plugin), uncomment the next line
        // ...,
        new CssMinimizerPlugin(),
      ],
    },
  },
]);