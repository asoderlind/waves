const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/waves.js", // Entry file for JavaScript
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "bundle.js", // Output JavaScript file
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"], // Enable ES6+ syntax
          },
        },
      },
      {
        test: /\.css$/, // Load CSS files
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Source HTML
      inject: "body", // Injects the bundle at the end of the body
    }),
  ],
  resolve: {
    extensions: [".js"],
  },
  devServer: {
    static: path.resolve(__dirname, "dist"),
    open: true, // Open browser automatically
  },
};
