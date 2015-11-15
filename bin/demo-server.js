#!/usr/bin/env node

var http = require('http')
var path = require('path')

var beefy = require('beefy')
var log = require('npmlog')

log.level = process.env.LOG_LEVEL || 'error'

var demoPath = path.resolve(__dirname, '../demo')
var server = http.createServer(beefy({
  entries: {
    '/bundle.js': path.resolve(__dirname, '../demo/vendor.js'),
    '/smartdate-input.js': path.resolve(__dirname, '../index.js')
  },
  cwd: demoPath
}))

server.listen(8080, '0.0.0.0', function () {
  console.log('Demo server startet at http://0.0.0.0:8080')
  log.info('server', 'serving files from %s', demoPath)
})
server.on('request', function (request, response) {
  log.info('server', '%s %s', request.method, request.url, response.statusCode)
})
