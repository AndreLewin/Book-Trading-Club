require('dotenv').load();

module.exports = {
    entry: {
        app: './client/index.jsx'
    },
    output: {
        filename: 'assets/[name].js',
        publicPath: `http://localhost:${process.env.PORT}/`,
        path: '/'
    },
    devServer: {
        historyApiFallback: true,
        contentBase: './',
        hot: true,
        port: process.env.PORT,
    },
    module: {
        rules: [
            {
              test: /\.(js|jsx)$/,
              loaders: 'babel-loader',
              exclude: /node_modules/,
              query: {
                presets: ['react', 'stage-0']
              }
            },
            {test: /\.css$/, use: ['style-loader', 'css-loader']},
            {test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"]},
            {test: /\.(png|jpg|gif)$/, use: ["file-loader"]},
        ]
    }
};

/*

        hot: true,
        inline: true,
        watchOptions: {
            ignored: ['node_modules/', 'test/', 'server/', 'test/', 'public/'],
        },
 */