const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: `${baseurl.baseBack}`,
      changeOrigin: true,
    })
  );
};
