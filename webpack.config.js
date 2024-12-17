import path from  'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export default {
  entry: {
    godot_scene_reader: {
      import: './src/godot-scene-reader/index.ts',
      library: { type: "module" }
    }
  },
  externals: {
    'fzstd': 'fzstd'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{loader: 'ts-loader', options: {
          configFile : 'tsconfig.webpack.json'
        }}],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: true
  },
  experiments: {
    outputModule: true,
  },
  output: {
    module: true,
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, 'dist'),
  }
};