const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('Setting up proxy middleware');
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request:', req.url);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Received response from target:', proxyRes.statusCode);
      },
    })
  );
};