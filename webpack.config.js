const path = require('path')
const slsw = require('serverless-webpack')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
/** @type {import('webpack').Configuration} */
const config = {
	entry: slsw.lib.entries,
	output: {
		libraryTarget: 'commonjs',
		filename: '[name].js',
		path: path.join(__dirname, '.webpack'),
	},
	mode: 'development',
	target: 'node',
	module: {
		rules: [
			{
				test: /\.ts$/, // include .js files
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
				},
			},
		],
	},
	resolve: {
		extensions: ['.js', '.ts'],
		plugins: [new TsconfigPathsPlugin()],
	},
}

module.exports = config
