// TODO: Modify node search path for modules
// See:
// https://gist.github.com/branneman/8048520
global.include = path => require(`${__dirname}/${path}`)

//
// -- Imports --
//
const App = require('./data/app')
const Response = require('./data/response')
const HTTPGateway = require('./gateways/http')
const TelegramGateway = require('./gateways/telegram')
const NLPMiddleware = require('./middleware/nlp')
const Path = require('path')

//
// -- Config --
//
const path = Path.resolve(process.cwd()) + '/functions'
const port = 3000

//
// -- Logic --
//
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

//
// -- Exports --
//
module.exports = {
    Service,
    App,
    Router,
    HTTPGateway,
    TelegramGateway,
    NLPMiddleware
}
