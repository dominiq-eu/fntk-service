// Express
import Express from 'express'
import Compression from 'compression'
import BodyParser from 'body-parser'

// Node
import Url from 'url'
import Http from 'http'

import { Data } from '@fntk/types'

//
// -- Types
//

const HttpHeader = Data('HTTPHeader', {
    method: String,
    url: String,
    path: String,
    headers: Object
})

const HttpRequest = Data('HTTPRequest', {
    http: HttpHeader,
    data: Object
})

//
// -- Helper
//
const isObject = obj => obj !== null && typeof obj === 'object'
const toPromise = p => (p.then ? p : Promise.resolve(p))
const toString = response =>
    isObject(response) ? JSON.stringify(response, null, 4) : response
const isObjEmpty = obj => Boolean(Object.keys(obj).length)

// app :: ()
const app = fn =>
    Express()
        .use(Compression()) // Compression support
        .use(BodyParser.json()) // Automatic parsing of the response body
        .use(BodyParser.urlencoded({ extended: true }))
        // Catch route
        .all('*', (req, res, next) => {
            const url = Url.parse(req.url, true)
            console.log('URL:', url)
            const request = HttpRequest({
                http: HttpHeader({
                    method: req.method,
                    headers: req.headers,
                    url: req.url,
                    path: url.pathname
                }),
                data: isObjEmpty(url.query) ? url.query : req.body
            })
            console.log('Request:', request)
            const handler = r => toPromise(fn(r))
            handler(request)
                .then(toString)
                .then(response => {
                    console.log('[WebService] Response: ', response)
                    res.write(response)
                    res.end()
                })
        })

// program :: { Int, [ Route ]}
const program = fn => {
    // Configuration
    const port = 8000
    const prog = app(fn)

    Http.createServer(prog).listen(port, () => {
        console.log(`Listening on port: ${port}`)
    })
}

export default { program }
