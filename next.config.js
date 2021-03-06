const resolve = require('resolve');
const withCSS = require('@zeit/next-css');

module.exports = withCSS({
  publicRuntimeConfig: {
    spacesAccessKey: process.env.SPACES_ACCESS_KEY,
    spacesSecretKey: process.env.SPACES_SECRET_KEY,
  },
  cssModules: false,

  webpack (config, options) {
    const { dir, isServer } = options;

    config.externals = [];

    if (isServer) {
      config.externals.push((context, request, callback) => {
        resolve(request, { basedir: dir, preserveSymlinks: true }, (err, res) => {
          if (err) {
            return callback()
          }

          // Next.js by default adds every module from node_modules to
          // externals on the server build. This brings some undesirable
          // behaviors because we can't use modules that require CSS files like
          // `former-kit-skin-pagarme`.
          //
          // The lines below blacklist webpack itself (that cannot be put on
          // externals) and `former-kit-skin-pagarme`.
          if (
            res.match(/node_modules[/\\].*\.js/)
            && !res.match(/node_modules[/\\]webpack/)
            && !res.match(/node_modules[/\\]@digituz[/\\]react-components/)
          ) {
            return callback(null, `commonjs ${request}`)
          }

          callback()
        })
      })
    }

    return config
  },
});
