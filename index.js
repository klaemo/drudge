var path = require('path')
var fs = require('fs')
var http = require('http')
var tinylr = require('tiny-lr')
var chokidar = require('chokidar')
var st = require('st')

var defaults = {
  passthrough: false,
  index: 'index.html',
  port: 3000,
  lrPort: 35729,
  dir: path.resolve(process.cwd(), 'public')
}

module.exports = function (options) {
  var debug = require('debug')
  var opts = {}
  
  Object.keys(defaults).forEach(function (key) {
    if (!(key in options)) {
      opts[key] = defaults[key]
    } else {
      opts[key] = options[key]
    }
  })

  opts.dir = path.resolve(process.cwd(), opts.dir)

  var log = debug('drudge')
  var logChange = debug('drudge:change')
  var logReq = debug('drudge:req')

  var watcher = chokidar.watch(opts.dir, { ignoreInitial: true, persistent: true })

  log('Watching %s', opts.dir)
  watcher
    .on('error', function (error) {
      log('Error', error)
    })
    .on('change', triggerReload)
    .on('add', triggerReload)

  function triggerReload (filepath) {
    var fileName = path.basename(filepath)
    logChange(fileName)
    tinylr.changed(fileName)
  }

  var lrServer = tinylr()
  lrServer.listen(opts.lrPort, function() {
    log('LiveReload listening on http://localhost:%s', opts.lrPort)
  })

  var mount = st({
    path: opts.dir,
    url: '/',
    passthrough: opts.passthrough,
    index: opts.index,
    cache: false
  })

  var httpServer = http.createServer(function (req, res) {
    logReq('%s - %s', req.method, req.url)
    mount(req, res, function() {
      res.setHeader('content-type', 'text/html')
      fs.createReadStream(path.join(opts.dir, 'index.html')).pipe(res)
    })
  }).listen(opts.port, function () {
    log('HTTP Server listening on http://localhost:%s', opts.port)
  })

  return {
    watcher: watcher,
    lrServer: lrServer,
    httpServer: httpServer
  }
}