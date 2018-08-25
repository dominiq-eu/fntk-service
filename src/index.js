// TODO: Modify node search path for modules
// See:
// https://gist.github.com/branneman/8048520
// global.include = path => require(`${__dirname}/${path}`)

// Import the app structure
import App from './data/app'
import Response from './data/response'
import HTTPGateway from './gateways/http'
import NLPMiddleware from './middleware/nlp'

// const path = `${__dirname}/../modules/functions`
const path = `${__dirname}/functions`
const port = 3000

const loadFunction = (req, fnpath) => {
    const fn = path => require(`${fnpath}${path}`)
    return fn(req.path)(req.payload)
}

const Router = request => {
    try {
        return loadFunction(request, FunctionsPath)
    } catch (e) {
        return Response.Error(e)
    }
}

const Service = App()
    // Add data sources
    .source(HTTPGateway({ port }))
    // Add data manipulation pipeline steps
    .add(NLPMiddleware({ path }))
    // Add data processing
    .do(Router)

console.log('Service:', Service)

export default {
    Service,
    App,
    Router,
    HTTPGateway,
    NLPMiddleware
}
