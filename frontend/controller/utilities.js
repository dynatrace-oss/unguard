const path = require('path');

exports.extendURL = function (url) {
    return path.join(process.env.FRONTEND_BASE_PATH, url);
}

exports.extendRenderData = function (data, req) {
  return {
      ...data,
      AD_SERVICE_INGRESS_ADDRESS: req.protocol + '://' + req.get('host') + process.env.AD_SERVICE_BASE_PATH,
      BASE_URL: req.protocol + '://' + req.get('host') + process.env.FRONTEND_BASE_PATH,
      currentPath: req.originalUrl
  }
}
