var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: "./js/app.js",
	output: {
		path: path.resolve(`${__dirname}/../assets/js`),
		filename: "bundle.js",
		publicPath: "assets"
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				loader: "babel-loader",
				query: {
					presets: ["env", "stage-0"]
				}
			},
			{
				test: /\.json$/,
				exclude: /(node_modules)/,
				loader: "json-loader"
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader!postcss-loader'
			},
			{
				test: /\.scss$/,
				loader: 'style-loader!css-loader!postcss-loader!sass-loader'
			}
		]
	}
}
