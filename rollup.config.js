import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		output: {
			name: 'engleri',
			dir: "build",
			format: 'umd'
		},
		plugins: [
			resolve(), 
            commonjs() 
		]
	},
];