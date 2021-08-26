function extendURL (url) {
    return process.env.FRONTEND_BASE_PATH + url;
}

module.exports = {
  extendURL
};