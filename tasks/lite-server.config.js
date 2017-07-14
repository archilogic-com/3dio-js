// https://github.com/johnpapa/lite-server
// https://browsersync.io/docs/options/
module.exports = {
  port: 8080,
  startPath: '/examples/browser/',
  watchOptions: {
    ignored: [
      'node_modules',
      // Do not watch files in source directory: They first have to get bundled using rollup.
      // Examples then will get updated as soon as built files are ready.
      'lib'
    ]
  },
  serveStatic: ['./'], // uses index.html in directories
  server: {
    directory: true,
    // this is required to get directory listings (?bug?)
    middleware: { 1: null }
  },
  scrollRestoreTechnique: 'cookie',
  reloadDebounce: 1500
}