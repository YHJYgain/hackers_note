const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        host: "localhost",
        port: "8126", // vue 程序端口换成 8126，避免与 SpringBoot 项目端口 8125 冲突
        https: false,
        open: true,
        /* 下面配置跨域代理 */
        proxy: {
            "/api": { 
                // 假设所有以'/api'开头的请求都需要使用代理
                target: "http://localhost:8125", // 代理的目标路径（后台）
                changeOrigin: true, // 支持跨域
                pathRewrite: {
                    "^/api": "", // 重写路径: 去掉请求路径中开头的'/api'
                },
            },
        },
    },
})
