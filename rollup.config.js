const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const external = require('rollup-plugin-peer-deps-external');
const babel = require("@rollup/plugin-babel");
const replace = require("@rollup/plugin-replace");

module.exports = [
  {
    input: "src/index.tsx",
    output: {
      file: "dist/bundle.js",
      format: "es",
      sourcemap: "inline",
    },
    plugins: [
      replace({
        preventAssignment: true,
		    'process.env.NODE_ENV': JSON.stringify( 'production' )
      }),
      external(),
      resolve(),
      babel({ 
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        presets: ["react", "env", "stage-0"]
      }),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
];
