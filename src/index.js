// TODO: Modify node search path for modules
// See:
// https://gist.github.com/branneman/8048520
// global.include = path => require(`${__dirname}/${path}`)

// Import the app structure
import App from './data/app'
import Response from './data/response'
import HTTPGateway from './gateways/http'
import NLPMiddleware from './middleware/nlp'

import Path from 'path'

const path = Path.resolve(process.cwd()) + '/functions'
const port = 3000

const loadFunction = (req, basePath) => {
    const fn = path => require(`${basePath}${path}`)
    return fn(req.path)(req.payload)
}

const Router = ({ path }) => request => {
    try {
        console.log('Load Function: Path: ', path)
        console.log('Load Function: Request: ', request)
        return loadFunction(request, path)
    } catch (e) {
        console.log('Load Function: Error: ', e)
        return Response.Error(e)
    }
}

const Service = App()
    // Add data sources
    .source(HTTPGateway({ port }))
    // Add data manipulation pipeline steps
    .add(NLPMiddleware({ path }))
    // Add data processing
    .do(Router({ path }))

export default {
    Service,
    App,
    Router,
    HTTPGateway,
    NLPMiddleware
}
