import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.ts',
		output: {
			name: 'engleri',
			dir: "build",
			format: 'umd'
		},
		plugins: [
			resolve(), 
			typescript(),
            commonjs(),
		]
	},
];