#!/usr/bin/env node

var program = require('commander')
var drudge = require('./')

program
  .version(require('./package.json').version)
  .option('-d, --dir [DIRECTORY]', 'Serve the contents of DIRECTORY (default=cwd)')
  .option('-i, --index [INDEX]', 'Use the specified INDEX filename as the result when a directory is requested (default=index.html)')
  .option('-p, --port [PORT]', 'Listen on PORT (default=3000)', parseInt)
  .option('-t, --passthrough', 'Return INDEX for missing files instead of 404')
  .option('-q, --quiet', 'Turn off logging')
  .parse(process.argv)

process.env.DEBUG = process.env.DEBUG || 'drudge,drudge:change'

if (program.quiet) process.env.DEBUG = false

var servers = drudge(program)

process.on('SIGINT', function () {
  servers.lrServer.close()
  servers.httpServer.close()
  servers.watcher.close()
})

process.on('uncaughtException', function (err) {
  console.error(err)
  process.exit(1)
})

