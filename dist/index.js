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

                module.exports = App
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
                /*
    Request

    Provides a data structure that represents an incoming request.
*/

                const { Union, Result } = require('@fntk/types')
                const { random } = require('../utils')

                const Response = Union('Response', {
                    Success: Result.Ok,
                    Error: Result.Err,
                    Random: data_list => Result.Ok(random(data_list))
                })

                module.exports = Response
            },
            { '../utils': 'jWsf' }
        ],
        shZs: [
            function(require, module, exports) {
                // Express
                const Express = require('express')
                const Compression = require('compression')
                const BodyParser = require('body-parser')

                // Node
                const Url = require('url')
                const Http = require('http')

                const { Data } = require('@fntk/types')

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
                    isObject(response)
                        ? JSON.stringify(response, null, 4)
                        : response
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

                    Http.createServer(prog).listen(port, () => {
                        console.log(`Listening on port: ${port}`)
                    })
                }

                module.exports = { program }
            },
            {}
        ],
        '9ee7': [
            function(require, module, exports) {
                /*
    Request

    Provides a data structure that represents an incoming request.
*/

                const {
                    Type,
                    Data,
                    Union,
                    String,
                    Object
                } = require('@fntk/types')

                const RequestType = Data('Request', {
                    path: String,
                    payload: Object
                })

                const NLPRequestType = Type(
                    'NLP',
                    v => Object.is(v) && v.sentence && String.is(v.sentence),
                    v => ({ sentence: String(v) })
                )

                // const NLPRequestType = Data('NLP', {
                //     sentence: String
                // })

                const Request = Union('Request', {
                    Request: RequestType,
                    NLP: NLPRequestType
                })

                module.exports = Request
            },
            {}
        ],
        '9Fxe': [
            function(require, module, exports) {
                /*
    HttpListener

    Listen to http events and forward them back to the app for handling.
*/

                const WebService = require('./web-service')
                const Request = require('../../data/request')

                // Get http requests, send them to the system for processing and
                // send the response after successfull handling.
                module.exports = cfg => fn =>
                    WebService.program(request => {
                        console.log('Http:', request)
                        const req = Request.Request({
                            path: request.http.path,
                            payload: request.data
                        })
                        console.log('Request:', req)
                        return fn(req)
                    })
            },
            { './web-service': 'shZs', '../../data/request': '9ee7' }
        ],
        '8f4u': [
            function(require, module, exports) {
                /*
    telegram.js

    Get updates from telegram.
*/

                const Request = require('../../data/request')
                const TeleBot = require('telebot')

                const toPromise = p => (p.then ? p : Promise.resolve(p))

                module.exports = ({ token }) => fn => {
                    const bot = new TeleBot({
                        token,
                        polling: {
                            interval: 1000
                        }
                    })

                    bot.on('text', msg => {
                        console.log('[Gateway] [Telegram] Request: ', msg)
                        const req = Request.NLP(msg.text)

                        toPromise(fn(msg.text))
                            .then(response => {
                                console.log(
                                    '[Gateway] [Telegram] Response: ',
                                    response
                                )
                                bot.sendMessage(msg.from.id, response, {
                                    parseMode: 'html',
                                    replyToMessage: msg.message_id
                                })
                            })
                            .catch(e => {
                                console.log('[Gateway] [Telegram] Error:', e)
                                bot.sendMessage(msg.from.id, response, {
                                    replyToMessage: msg.message_id
                                })
                            })
                    })

                    bot.start()
                }
            },
            { '../../data/request': '9ee7' }
        ],
        T0sK: [
            function(require, module, exports) {
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
                module.exports = ({ path }) => {
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
            },
            {
                './data/app': '2SjF',
                './data/response': 'csfc',
                './gateways/http': '9Fxe',
                './gateways/telegram': '8f4u',
                './middleware/nlp': 'T0sK'
            }
        ]
    },
    {},
    ['Focm'],
    null
)
//# sourceMappingURL=/index.map
