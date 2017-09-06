'use strict';

// Modules
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function makeWebpackConfig(options) {
    /**
     * Environment type
     * BUILD is for generating minified builds
     * TEST is for generating test builds
     */
    var BUILD = !!options.BUILD;
    var TEST = !!options.TEST;

    /**
     * Config
     */
    var config = {};

    /**
     * Entry
     */
    if (TEST) {
        config.entry = {}
    } else {
        config.entry = {
            app: './src/app.js'
        }
    }

    /**
     * Output
     */
    if (TEST) {
        config.output = {}
    } else {
        config.output = {
            // Absolute output directory
            path: __dirname + '/public',

            // Output path from the view of the page
            // Uses webpack-dev-server in development
            publicPath: BUILD ? '/' : 'http://localhost:8080/',

            // Filename for entry points
            // Only adds hash in build mode
            filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

            // Filename for non-entry points
            // Only adds hash in build mode
            chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
        }
    }

    /**
     * Devtool
     */
    if (TEST) {
        config.devtool = 'inline-source-map';
    } else if (BUILD) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval-source-map';
    }

    /**
     * Loaders
     */

        // Initialize module
    config.module = {
        rules: [{
            // JS LOADER
            // Transpile .js files using babel-loader
            // Compiles ES6 and ES7 into ES5 code
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/
        }, {
            // ASSET LOADER
            // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
            // Rename the file using the asset hash
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            use: 'file-loader'
        }, {
            // HTML LOADER
            // Allow loading html through js
            test: /\.html$/,
            use: 'raw-loader'
        },
		{
		  // CSS LOADER
		  // Allow loading css through js
		  test: /\.css$/,
		  use: TEST ? 'null-loader' : ExtractTextPlugin.extract({
			fallback: 'style-loader',
			use: [
			  {loader: 'css-loader', query: {sourceMap: true}},
			  {loader: 'postcss-loader'}
			],
		  })
		}]
    };

    /**
     * PostCSS
     * Add vendor prefixes to your css
     */
    config.postcss = [
        autoprefixer({
            browsers: ['last 2 version']
        })
    ];

    /**
     * Plugins
     */
    config.plugins = [
        // Extract css files
        // Disabled when in test mode or not in build mode
        new ExtractTextPlugin('[name].[hash].css', {
            disable: !BUILD || TEST
        }),

        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ];

    // Skip rendering index.html in test mode
    if (!TEST) {
        config.plugins.push(
            new HtmlWebpackPlugin({
                template: './src/index.html',
                inject: 'body',
                minify: BUILD
            })
        )
    }

    // Add build specific plugins
    if (BUILD) {
        config.plugins.push(
            new webpack.NoErrorsPlugin(),

            new webpack.optimize.DedupePlugin(),

            new webpack.optimize.UglifyJsPlugin()
        )
    }

    /**
     * Dev server configuration
     */
    config.devServer = {
        contentBase: './public',
        stats: {
            modules: false,
            cached: false,
            colors: true,
            chunk: false
        }
    };

    return config;
};