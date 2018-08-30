/*
    HttpListener

    Listen to http events and forward them back to the app for handling.
*/

const WebService = require('./web-service')
const Request = require('../../data/request')
const { Log } = require('@fntk/utils')

const log = Log('HTTPGateway')

// Get http requests, send them to the system for processing and
// send the response after successfull handling.
module.exports = cfg => fn =>
    WebService.program(request => {
        log.debug('HTTPRequest', request)
        const req = Request({
            path: request.http.path,
            payload: request.data
        })
        log.debug('Request', req)
        return fn(req)
    })
