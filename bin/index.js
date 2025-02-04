#!/usr/bin/env node

const argv = require('yargs').argv
const NoCorsProxy = require('../lib')

const port = argv.p || argv.port
const host = argv.h || argv.host
const target = argv.t || argv.target
const callerHost = argv.callerHost || 'http://localhost'
const callerPort = argv.callerPort || 4200
const callerUrl = callerHost + ':' + callerPort

const proxy = new NoCorsProxy(port, host, target, callerUrl)
proxy.start()

console.info(`Proxying http://${proxy.config.host}:${proxy.config.port} to\
 => ${proxy.config.target}`)

console.info('Access-Control-Allow-Origin is set to ' + proxy.config.origin)
