const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy cho API thứ nhất
  app.use(
    '/api1',
    createProxyMiddleware({
      target: 'https://ecommercebe-ecommerce.up.railway.app',
      changeOrigin: true,
      pathRewrite: { '^/api1': '/api' }, // Xóa tiền tố /api1 nếu cần
    })
  );

  // Proxy cho API thứ hai
  app.use(
    '/api2',
    createProxyMiddleware({
      target: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
      changeOrigin: true,
      pathRewrite: { '^/api2': '' }, // Xóa tiền tố /api2 nếu cần
    })
  );
};
