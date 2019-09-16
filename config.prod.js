module.exports = {
  proxy: {
    enabled: true,
    path:'/api',
    target: 'http://localhost:8080',
    changeOrigin: true
  }
};
