module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:53344/api',
                changeOrigin: true,
                pathRewrite: {
                    "^/api": ""
                }
            }
        }
    },
    lintOnSave: false,
    outputDir: "../backend/public"
};