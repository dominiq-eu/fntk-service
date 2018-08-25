// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function(modules, cache, entry, globalName) {
    // Save the require from previous bundle to this closure if any
    var previousRequire = typeof parcelRequire === 'function' && parcelRequire
    var nodeRequire = typeof require === 'function' && require

    function newRequire(name, jumped) {
        if (!cache[name]) {
            if (!modules[name]) {
                // if we cannot find the module within our internal map or
                // cache jump to the current global require ie. the last bundle
                // that was added to the page.
                var currentRequire =
                    typeof parcelRequire === 'function' && parcelRequire
                if (!jumped && currentRequire) {
                    return currentRequire(name, true)
                }

                // If there are other bundles on this page the require from the
                // previous one is saved to 'previousRequire'. Repeat this as
                // many times as there are bundles until the module is found or
                // we exhaust the require chain.
                if (previousRequire) {
                    return previousRequire(name, true)
                }

                // Try the node require function if it exists.
                if (nodeRequire && typeof name === 'string') {
                    return nodeRequire(name)
                }

                var err = new Error("Cannot find module '" + name + "'")
                err.code = 'MODULE_NOT_FOUND'
                throw err
            }

            localRequire.resolve = resolve

            var module = (cache[name] = new newRequire.Module(name))

            modules[name][0].call(
                module.exports,
                localRequire,
                module,
                module.exports,
                this
            )
        }

        return cache[name].exports

        function localRequire(x) {
            return newRequire(localRequire.resolve(x))
        }

        function resolve(x) {
            return modules[name][1][x] || x
        }
    }

    function Module(moduleName) {
        this.id = moduleName
        this.bundle = newRequire
        this.exports = {}
    }

    newRequire.isParcelRequire = true
    newRequire.Module = Module
    newRequire.modules = modules
    newRequire.cache = cache
    newRequire.parent = previousRequire
    newRequire.register = function(id, exports) {
        modules[id] = [
            function(require, module) {
                module.exports = exports
            },
            {}
        ]
    }

    for (var i = 0; i < entry.length; i++) {
        newRequire(entry[i])
    }

    if (entry.length) {
        // Expose entry point to Node, AMD or browser globals
        // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
        var mainExports = newRequire(entry[entry.length - 1])

        // CommonJS
        if (typeof exports === 'object' && typeof module !== 'undefined') {
            module.exports = mainExports

            // RequireJS
        } else if (typeof define === 'function' && define.amd) {
            define(function() {
                return mainExports
            })

            // <script>
        } else if (globalName) {
            this[globalName] = mainExports
        }
    }

    // Override the current require with this new one
    return newRequire
})(
    {
        '2SjF': [
            function(require, module, exports) {
                'use strict'

                Object.defineProperty(exports, '__esModule', {
                    value: true
                })
                /*
    App.js

    Provides a data structure for basic app behaivor.
*/

                //
                // App
                //  * fn: The app logic
                //  * sources: A list of functions that act as data sources and generate data
                //  * layer: A list of functions that builds a pipeline and manipulate the
                //           data before reaching the app logic (fn)
                //
                // App :: Function -> List(Function) -> List(Function) -> Nothing
                const App = (fn = x => x, sources = [], layer = []) => ({
                    // Here we register data sources. They can create data and feed in
                    // the system.
                    source: s => App(fn, sources.concat([s]), layer),

                    // Here we add a layer to manipulate the data on his way trough the
                    // system and before it reaches it's final processing.
                    // add: l => App(x => l(f(x))),
                    add: l => App(fn, sources, layer.concat([l])),

                    // Add the data processing
                    do: f => App(f, sources, layer),

                    // Start the app
                    start: () => {
                        // Build the data processing pipeline using composition.
                        const dataPipeline = layer
                            .concat(fn)
                            .reduce((f, g) => x => g(f(x)), x => x)

                        // Hand the data processing pipeline to the data sources,
                        // so that every source can pass new data to the app.
                        sources.forEach(s => s(dataPipeline))
                    }
                })

                exports.default = App
            },
            {}
        ],
        jWsf: [
            function(require, module, exports) {
                'use strict'

                Object.defineProperty(exports, '__esModule', {
                    value: true
                })
                const randomBetween = (exports.randomBetween = (min, max) =>
                    Math.floor(Math.random() * (max - min + 1)) + min)

                const random = (exports.random = (list = []) => {
                    if (list.length > 0) {
                        const index = randomBetween(0, list.length - 1)
                        return list[index]
                    } else {
                        return randomBetween(0, 100)
                    }
                })
            },
            {}
        ],
        csfc: [
            function(require, module, exports) {
                'use strict'

                Object.defineProperty(exports, '__esModule', {
                    value: true
                })

                var _types = require('@fntk/types')

                var _utils = require('../utils')

                /*
    Request

    Provides a data structure that represents an incoming request.
*/

                const Response = (0, _types.Union)('Response', {
                    Success: _types.Result.Ok,
                    Error: _types.Result.Err,
                    Random: data_list =>
                        _types.Result.Ok((0, _utils.random)(data_list))
                })

                exports.default = Response
            },
            { '../utils': 'jWsf' }
        ],
        shZs: [
            function(require, module, exports) {
                'use strict'

                Object.defineProperty(exports, '__esModule', {
                    value: true
                })

                var _express = require('express')

                var _express2 = _interopRequireDefault(_express)

                var _compression = require('compression')

                var _compression2 = _interopRequireDefault(_compression)

                var _bodyParser = require('body-parser')

                var _bodyParser2 = _interopRequireDefault(_bodyParser)

                var _url = require('url')

                var _url2 = _interopRequireDefault(_url)

                var _http = require('http')

                var _http2 = _interopRequireDefault(_http)

                var _types = require('@fntk/types')

                function _interopRequireDefault(obj) {
                    return obj && obj.__esModule ? obj : { default: obj }
                }

                //
                // -- Types
                //

                // Express
                const HttpHeader = (0, _types.Data)('HTTPHeader', {
                    method: String,
                    url: String,
                    path: String,
                    headers: Object
                })

                // Node

                const HttpRequest = (0, _types.Data)('HTTPRequest', {
                    http: HttpHeader,
                    data: Object
                })

                //
                // -- Helper
                //
                const isObject = obj => obj !== null && typeof obj === 'object'
                const toPromise = p => (p.then ? p : Promise.resolve(p))
                const toString = response =>
                    isObject(response)
                        ? JSON.stringify(response, null, 4)
                        : response
                const isObjEmpty = obj => Boolean(Object.keys(obj).length)

                // app :: ()
                const app = fn =>
                    (0, _express2.default)()
                        .use((0, _compression2.default)()) // Compression support
                        .use(_bodyParser2.default.json()) // Automatic parsing of the response body
                        .use(
                            _bodyParser2.default.urlencoded({ extended: true })
                        )
                        // Catch route
                        .all('*', (req, res, next) => {
                            const url = _url2.default.parse(req.url, true)
                            console.log('URL:', url)
                            const request = HttpRequest({
                                http: HttpHeader({
                                    method: req.method,
                                    headers: req.headers,
                                    url: req.url,
                                    path: url.pathname
                                }),
                                data: isObjEmpty(url.query)
                                    ? url.query
                                    : req.body
                            })
                            console.log('Request:', request)
                            const handler = r => toPromise(fn(r))
                            handler(request)
                                .then(toString)
                                .then(response => {
                                    console.log(
                                        '[WebService] Response: ',
                                        response
                                    )
                                    res.write(response)
                                    res.end()
                                })
                        })

                // program :: { Int, [ Route ]}
                const program = fn => {
                    // Configuration
                    const port = 8000
                    const prog = app(fn)

                    _http2.default.createServer(prog).listen(port, () => {
                        console.log(`Listening on port: ${port}`)
                    })
                }

                exports.default = { program }
            },
            {}
        ],
        '9ee7': [
            function(require, module, exports) {
                'use strict'

                Object.defineProperty(exports, '__esModule', {
                    value: true
                })

                var _types = require('@fntk/types')

                const RequestType = (0, _types.Data)('Request', {
                    path: String,
                    payload: Object
                }) /*
        Request
    
        Provides a data structure that represents an incoming request.
    */

                const NLPRequestType = (0, _types.Data)('NLP', {
                    sentence: String
                })

                const Request = (0, _types.Union)('Request', {
                    Request: RequestType,
                    NLP: NLPRequestType
                })

                exports.default = Request
            },
            {}
        ],
        '9Fxe': [
            function(require, module, exports) {
                'use strict'

                Object.defineProperty(exports, '__esModule', {
                    value: true
                })

                var _webService = require('./web-service')

                var _webService2 = _interopRequireDefault(_webService)

                var _request = require('../../data/request')

                var _request2 = _interopRequireDefault(_request)

                function _interopRequireDefault(obj) {
                    return obj && obj.__esModule ? obj : { default: obj }
                }

                // Get http requests, send them to the system for processing and
                // send the response after successfull handling.
                /*
    HttpListener

    Listen to http events and forward them back to the app for handling.
*/

                exports.default = cfg => fn =>
                    _webService2.default.program(request => {
                        console.log('Http:', request)
                        const req = _request2.default.Request({
                            path: request.http.path,
                            payload: request.data
                        })
                        console.log('Request:', req)
                        return fn(req)
                    })
            },
            { './web-service': 'shZs', '../../data/request': '9ee7' }
        ],
        T0sK: [
            function(require, module, exports) {
                'use strict'

                Object.defineProperty(exports, '__esModule', {
                    value: true
                })
                /*
    Route sentences to modules using nlp technics.
*/

                // const Franc = require('franc') // Language detection
                // const Tokenizer = require('./stem/tokenizer')
                const Snowball = require('snowball')
                const Natural = require('natural') // sentence similarity
                const NlpToolkit = require('nlp-toolkit')
                const StopwordsIso = require('stopwords-iso')
                const Fs = require('fs')

                const Request = require('../data/request').default

                // Languages :: Languages
                const Language = {
                    de: 'German',
                    en: 'English'

                    // State :: State
                }
                const State = {
                    lang: 'de',
                    functions: []

                    //
                    // -- Utils
                    //

                    // trace :: String => a => a
                }
                const trace = msg => a => {
                    console.log(msg, a)
                    return a
                }

                // getSubDirs :: String => String[]
                const getSubDirs = dir =>
                    Fs.readdirSync(dir)
                        // Convert the filename to a full path, filter out all
                        // directories and look recursively for more nested dirs.
                        .map(file => `${dir}/${file}`)
                        .filter(file => Fs.statSync(file).isDirectory())
                        .reduce(
                            (ret, d) =>
                                ret
                                    // Add found dirs to return value and look for
                                    // more nested dirs.
                                    .concat(d)
                                    .concat(getSubDirs(d)),
                            []
                        )

                // getNlpFunctions :: String => NlpFunction[]
                const getNlpFunctions = dir =>
                    getSubDirs(dir).reduce((ret, path) => {
                        try {
                            const cfg = require(`${path}/function.json`)
                            // const fn = require(`${path}/index.js`)
                            if (cfg.sentences.de || cfg.sentences.en) {
                                // ret.push({ fn, sentences: cfg.sentences })
                                ret.push({
                                    path: path.replace(dir, ''),
                                    sentences: cfg.sentences
                                })
                            }
                        } catch (e) {
                            // Not found, or something else..
                            // console.error('NLPFunction:', e)
                        }
                        return ret
                    }, [])

                // cleanStopwords :: String => Language => String
                const cleanStopwords = (text, lang) =>
                    text
                        // split sentence to an array of words
                        .split(' ')
                        // Filter all stopwords
                        .filter(w => !StopwordsIso[lang].includes(w))
                        // create string again
                        .join(' ')
                        .trim()

                // StemmSnowball :: String -> String
                const StemmSnowball = text => {
                    if (text.length > 5) {
                        const stemmer = new Snowball(Language[State.lang])
                        const cleanedText = cleanStopwords(
                            text.toLowerCase().trim(),
                            State.lang
                        )
                        stemmer.setCurrent(cleanedText)
                        stemmer.stem()
                        return stemmer.getCurrent()
                    } else {
                        return text.toLowerCase()
                    }
                }

                // Normalize :: String -> String
                const Normalize = text => {
                    const token = NlpToolkit.tokenizer(text)
                    const stemmed = NlpToolkit.stemmer(token, {
                        lang: State.lang
                    })
                    return cleanStopwords(stemmed.join(' ').trim(), State.lang)
                }

                // Normalize :: (String => String) -> String -> String -> { val: Number, msg: String }
                const calcSimilarity = (stemmer, withStr, matchStr) => {
                    const s1 = stemmer(matchStr.toLowerCase().trim())
                    const s2 = stemmer(withStr.toLowerCase().trim())
                    const value = Natural.JaroWinklerDistance(s1, s2)

                    return [value, s1]
                }

                const getMatch = (stemmer, text, sentences) =>
                    sentences
                        .map(s => calcSimilarity(stemmer, text, s))
                        .sort(([val_a, s_a], [val_b, s_b]) => val_b - val_a)
                        // .map(trace('#'))
                        .filter(([val, sentence]) => val >= 0.75)
                        .map(([value, txt]) => ({
                            value,
                            txt
                        }))

                // getPropability :: String -> FnStruct -> Number
                const getPropability = (text, fn) => {
                    const match = getMatch(
                        StemmSnowball,
                        text,
                        fn.sentences.de
                    )[0]
                    return (match && match.value) !== undefined
                        ? match.value
                        : 0
                }

                // getMatches :: fn[] -> fn
                const getMatches = functions => line =>
                    // {
                    // const matchTable = functions
                    functions
                        .reduce(
                            (ret, fn) =>
                                ret.concat([
                                    {
                                        propability: getPropability(line, fn),
                                        // fn: fn.fn,
                                        sentences: fn.sentences,
                                        path: fn.path
                                    }
                                ]),
                            []
                        )
                        .filter(fn => fn.propability > 0)
                        .sort((a, b) => b.propability - a.propability)

                // if (matchTable.length > 0) {
                //     const fn = matchTable[0]
                //     return fn
                // } else {
                //     return
                // }
                // }

                //
                // const toPathRequest = functions => request => {}

                // default :: Path => NlpRequest => Request

                exports.default = ({ path }) => {
                    // Load nlp functions
                    State.functions = getNlpFunctions(path)
                    const getMatch = getMatches(State.functions)
                    return reqRes => {
                        console.log('[Middleware] [NLP] path:', path)
                        console.log('[Middleware] [NLP] ReqRes:', reqRes)

                        if (!reqRes.case) {
                            return reqRes
                        }

                        return reqRes.case({
                            Request: () => {
                                console.log(
                                    '[Middleware] [NLP] Request:',
                                    Request
                                )
                                // 1. Request with nlp body
                                const sentence = reqRes.payload.sentence
                                if (sentence) {
                                    const matchTable = getMatch(
                                        String(sentence)
                                    )
                                    if (matchTable.length > 0) {
                                        const match = matchTable[0]
                                        return Request.NLP(match.path, sentence)
                                    }
                                }
                                // 2. NLP Request
                                return reqRes
                            },
                            Response: () => reqRes
                        })

                        // const fn = findMatch(functions)
                        // if (fn) {
                        //     return fn(req.data)
                        // }
                        // return {
                        //     ok: false,
                        //     payload: {
                        //         error: 'nlp',
                        //         data: request
                        //     }
                        // }
                    }
                }

                //
                // -- Cmdline interface
                //
                //
                // const Readline = require('readline')
                // const input = Readline.createInterface(process.stdin, process.stdout)
                //
                // console.log('Loading..')
                // State.functions = getNlpFunctions('../../modules/functions')
                //
                // console.log('Test against:\n')
                // State.functions
                //     // print sentences
                //     .map(f => f.sentences)
                //     .map(trace('Function:\n'))
                //
                // input.setPrompt('\n\n> ')
                // input.prompt()
                // input
                //     .on('line', line => {
                //         if (line == 'exit') {
                //             input.close()
                //         }
                //         console.log('')
                //
                //         const stemmer = [/*StemmPorter2,*/ StemmSnowball, Normalize]
                //         const matchTable = State.functions
                //             .reduce(
                //                 (ret, fn) =>
                //                     ret.concat([
                //                         {
                //                             propability: getPropability(line, fn),
                //                             fn: fn.fn,
                //                             sentences: fn.sentences
                //                         }
                //                     ]),
                //                 []
                //             )
                //             .filter(fn => fn.propability > 0)
                //             .sort((a, b) => b.propability - a.propability)
                //         console.log('MatchTable:\n', matchTable)
                //
                //         if (matchTable.length > 0) {
                //             const fn = matchTable[0]
                //             fn.fn(line)
                //         } else {
                //             console.log('No Match!')
                //         }
                //         input.prompt()
                //     })
                //     .on('close', () => {
                //         process.exit(0)
                //     })
                //
            },
            { '../data/request': '9ee7' }
        ],
        Focm: [
            function(require, module, exports) {
                'use strict'

                Object.defineProperty(exports, '__esModule', {
                    value: true
                })

                var _app = require('./data/app')

                var _app2 = _interopRequireDefault(_app)

                var _response = require('./data/response')

                var _response2 = _interopRequireDefault(_response)

                var _http = require('./gateways/http')

                var _http2 = _interopRequireDefault(_http)

                var _nlp = require('./middleware/nlp')

                var _nlp2 = _interopRequireDefault(_nlp)

                var _path = require('path')

                var _path2 = _interopRequireDefault(_path)

                function _interopRequireDefault(obj) {
                    return obj && obj.__esModule ? obj : { default: obj }
                }

                const path =
                    _path2.default.resolve(process.cwd()) + '/functions' // TODO: Modify node search path for modules
                // See:
                // https://gist.github.com/branneman/8048520
                // global.include = path => require(`${__dirname}/${path}`)

                // Import the app structure

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
                        return _response2.default.Error(e)
                    }
                }

                const Service = (0, _app2.default)()
                    // Add data sources
                    .source((0, _http2.default)({ port }))
                    // Add data manipulation pipeline steps
                    .add((0, _nlp2.default)({ path }))
                    // Add data processing
                    .do(Router({ path }))

                exports.default = {
                    Service,
                    App: _app2.default,
                    Router,
                    HTTPGateway: _http2.default,
                    NLPMiddleware: _nlp2.default
                }
            },
            {
                './data/app': '2SjF',
                './data/response': 'csfc',
                './gateways/http': '9Fxe',
                './middleware/nlp': 'T0sK'
            }
        ]
    },
    {},
    ['Focm'],
    null
)
//# sourceMappingURL=/index.map
