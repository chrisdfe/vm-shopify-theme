import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import scss from 'rollup-plugin-scss'

import postcss from "postcss";
import autoprefixer from "autoprefixer";

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
      typescript(),
      terser()
    ]
  },
  {
    input: 'src/styles/styles.js',
    output: {
      dir: 'assets/',
    },
    plugins: [
      scss({
        output: true,

        // Filename to write all styles to
        output: 'assets/styles.css',

        processor: () => postcss([autoprefixer()]),

        watch: ['src/styles/']
      })
    ]
  },
  {
    input: "src/scripts/entrypoints/styleguide.tsx",
    output: {
      dir: 'assets/',
      format: 'cjs',
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      replace({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        preventAssignment: true
      }),
      babel({
        exclude: "node_modules/**",
        babelHelpers: 'bundled'
      }),
      typescript({
        allowSyntheticDefaultImports: true,
      }),
      scss({
        // TODO - don't hardcode styleguide.css
        output: 'assets/styleguide.css'
      }),
    ]
  }
];