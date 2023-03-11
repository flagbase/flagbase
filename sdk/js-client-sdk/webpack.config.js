const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.ts", // entry point of our project

  module: {
    rules: [

      // use ts-loader to transpile .ts files
      {
        test: /\.ts/,
        use: "ts-loader",
        exclude: /node_modules/,
      },

    ],
  },

  resolve: {
    extensions: [".ts"],
  },

  output: {
    // empty the output directory on every build
    clean: true,

    // the dir of output bundle
    path: path.resolve(__dirname, "dist"),

    // output bundle name
    filename: "index.js",

    globalObject: "this",

    library: {
      // your lib name if imported with the <script> tag
      // for this library it will be available as `window.char_series`
      name: "char_series", 

      // the module type
      type: "umd",

      export: "default",
    },
  },
};
