import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss'

export default [
  {
    input: 'src/scripts/entrypoints/vm-sections.ts',
    output: {
      dir: 'assets/',
      format: 'iife',
    },
    plugins: [
      nodeResolve(),
      babel({ babelHelpers: 'bundled' }),
      typescript()
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
      commonjs(),
      scss({
        // TODO - don't hardcode styleguide.css
        output: 'assets/styleguide.css' 
      }),
    ]
  }
];