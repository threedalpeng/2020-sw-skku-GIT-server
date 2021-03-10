
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
module.exports = {
    // configureWebpack: {
    //     plugins : [new BundleAnalyzerPlugin({
    //         analyzerPort: 199112,
    //     })]

    // },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:53344/api',
                changeOrigin: true,
                pathRewrite: {
                    "^/api": ""
                }
            }
        },
    },
    lintOnSave: false,
    outputDir: "../backend/public",
    chainWebpack(config) {
        config.plugins.delete('prefetch');
        
        // and this line 
        config.plugin('CompressionPlugin').use(CompressionPlugin);
    }

};  