import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/scripts/entrypoints/vm-sections.js',
    output: {
      dir: 'assets/',
      format: 'iife',
    },
    plugins: [
      nodeResolve(),
      babel({ babelHelpers: 'bundled' })
    ]
  },
  {
    input: "src/scripts/entrypoints/styleguide.js",
    output: {
      dir: 'assets/',
      format: 'cjs',
    },
    plugins: [
      babel({
        exclude: "node_modules/**",
        babelHelpers: 'bundled'
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        preventAssignment: true
      }),
      // resolve(),
      nodeResolve(),
      commonjs()
    ]
  }
];