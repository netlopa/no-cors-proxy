const http = require('http')
const url = require('url');
const httpProxy = require('http-proxy')

class NoCorsProxy {
    constructor(port, host, target, overrideOrigin) {
        this.config = {
            port:  port || 3000,
            host: host || 'localhost',
            target: target || 'http://localhost',
            origin: overrideOrigin || '*'
        }
        //console.log('instantiated ' + JSON.stringify(this.config))
        this.config.targetHost = url.parse(this.config.target).hostname;
        this.proxy = httpProxy.createProxyServer({})
    }

    start() {
        let self = this;

        this.proxy.on('proxyReq', (proxyReq, req, res, options) => {
            proxyReq.setHeader('Host', this.config.targetHost)
        })

        this.proxy.on('proxyRes', function (proxyRes, req, res) {

            res.setHeader('Access-Control-Allow-Origin', self.config.origin)
            res.setHeader('Access-Control-Allow-Credentials', 'true')
        })

        const server = http.createServer((req, res) => {
            
            if(req.method === 'OPTIONS') {

                console.log('received options call with ', req.headers['access-control-request-method'])

                res.setHeader('Access-Control-Allow-Origin', self.config.origin)
                res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers']) 
                res.setHeader('Access-Control-Allow-Credentials', 'true')
                res.setHeader('Access-Control-Allow-Methods', req.headers['access-control-request-method'])
                res.end()
                return
            }

            this.proxy.web(req, res, {
                target: this.config.target,
                secure: false
            })
        })

        server.listen(this.config.port, this.config.host)
    }
}

module.exports = NoCorsProxy
