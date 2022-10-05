module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // 修改为你的Django服务器地址
        changOrigin: true,
      }
    }
  }
}
