import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';

export default {
  input: 'src/scripts/entrypoints/vm-sections.js',
  output: {
    dir: 'assets/',
    format: 'iife',
  },
  plugins: [
    nodeResolve(),
    babel({ babelHelpers: 'bundled' })
  ]
};