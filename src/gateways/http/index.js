/*
    HttpListener

    Listen to http events and forward them back to the app for handling.
*/

import WebService from './web-service'
import Request from '../../data/request'

// Get http requests, send them to the system for processing and
// send the response after successfull handling.
export default cfg => fn =>
    WebService.program(request => {
        console.log('Http:', request)
        const req = Request.Request({
            path: request.http.path,
            payload: request.data
        })
        console.log('Request:', req)
        return fn(req)
    })
