const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/colectivos",
    createProxyMiddleware({
      target: "https://apitransporte.buenosaires.gob.ar",
      changeOrigin: true,
    })
  );
};
