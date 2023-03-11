const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.ts", // entry point of our project

  module: {
    rules: [
      {
        test: /\.worker\.(js|ts)$/,
        loader: 'worker-loader',  
        options: {
          inline: 'no-fallback'
        }
      },
      {
        test: /\.ts/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: [".js", ".ts"],
  },

  output: {
    // empty the output directory on every build
    clean: true,
    // the dir of output bundle
    path: path.resolve(__dirname, "dist"),
    // output bundle name
    filename: "index.js",
    // globalObject: "this",
    library: {
      // your lib name if imported with the <script> tag
      name: "FlagbaseClient", 
      type: "umd",
      export: "default",
    },
  },
};
