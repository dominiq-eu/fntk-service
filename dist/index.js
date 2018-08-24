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
  var previousRequire = typeof parcelRequire === "function" && parcelRequire;
  var nodeRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof parcelRequire === "function" && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === "string") {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = "MODULE_NOT_FOUND";
        throw err;
      }

      localRequire.resolve = resolve;

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {}
    ];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === "function" && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})(
  {
    "middleware.js": [
      function(require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        /*
    Middleware.js

    Provides a data structure to implement a middleware.
*/

        // A list of gateways, that renerate requests and handle responses.
        const gateways = [];

        // The app logic
        const Middleware = (g = x => x) => ({
          //
          add: f => {
            gateways.push(f);
            return Middleware(g);
          },

          use: f => Middleware(x => f(g(x))),
          run: f => {
            // Specify how the request flows through the system.
            //
            // g()  The registered middlewares for processing resquest and
            //      response.
            //
            // f()  The function to transform a request to a response.
            //
            // So g(f(g(req))) means:
            //
            // 1. Take the request and let the middlewares process it
            // 2. Transform the request to a response
            // 3. Let the middlewares process the response

            const flow = req => g(f(g(req)));
            // const flow = pipe(
            //     g,
            //     f,
            //     g
            // )

            // Hand the program flow to the registered gateways,
            // so that every gateway can pass new (received) requests
            // to the app flow.
            gateways.map(gateway => gateway(flow));
          }
        });

        exports.default = Middleware;
      },
      {}
    ],
    "gateways/http/index.js": [
      function(require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var _webService = require("./web-service");

        var _webService2 = _interopRequireDefault(_webService);

        var _request = require("../../data/request");

        var _request2 = _interopRequireDefault(_request);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        // const Request = include('data/request')

        // Get http requests, send them to the system for processing and
        // send the response after successfull handling.
        /*
    HttpListener

    Listen to http events and forward them back to the app for handling.
*/

        exports.default = cfg => fn =>
          _webService2.default.program(request => {
            console.log("Http:", request);
            const req = _request2.default.Request(
              request.http.path,
              request.data
            );
            console.log("Request:", req);
            return fn(req);
          });
      },
      {}
    ],
    "router.js": [
      function(require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        // import Fn from '../data/endpoint'

        const Fn = (fnpath, req) => {
          const fn = path => require(`${fnpath}${path}`);
          return fn(req.path)(req.payload);
        };

        exports.default = (fnpath, request) => {
          return Fn(fnpath, request);
        };
      },
      {}
    ],
    "middleware/nlp.js": [
      function(require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        /*
    Route sentences to modules using nlp technics.
*/

        // const Franc = require('franc') // Language detection
        // const Tokenizer = require('./stem/tokenizer')
        const Snowball = require("snowball");
        const Natural = require("natural"); // sentence similarity
        const NlpToolkit = require("nlp-toolkit");
        const StopwordsIso = require("stopwords-iso");
        const Fs = require("fs");

        const Request = require("../data/request").default;

        // Languages :: Languages
        const Language = {
          de: "German",
          en: "English"

          // State :: State
        };
        const State = {
          lang: "de",
          functions: []

          //
          // -- Utils
          //

          // trace :: String => a => a
        };
        const trace = msg => a => {
          console.log(msg, a);
          return a;
        };

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
            );

        // getNlpFunctions :: String => NlpFunction[]
        const getNlpFunctions = dir =>
          getSubDirs(dir).reduce((ret, path) => {
            try {
              const cfg = require(`${path}/function.json`);
              // const fn = require(`${path}/index.js`)
              if (cfg.sentences.de || cfg.sentences.en) {
                // ret.push({ fn, sentences: cfg.sentences })
                ret.push({
                  path: path.replace(dir, ""),
                  sentences: cfg.sentences
                });
              }
            } catch (e) {
              // Not found, or something else..
              // console.error('NLPFunction:', e)
            }
            return ret;
          }, []);

        // cleanStopwords :: String => Language => String
        const cleanStopwords = (text, lang) =>
          text
            // split sentence to an array of words
            .split(" ")
            // Filter all stopwords
            .filter(w => !StopwordsIso[lang].includes(w))
            // create string again
            .join(" ")
            .trim();

        // StemmSnowball :: String -> String
        const StemmSnowball = text => {
          if (text.length > 5) {
            const stemmer = new Snowball(Language[State.lang]);
            const cleanedText = cleanStopwords(
              text.toLowerCase().trim(),
              State.lang
            );
            stemmer.setCurrent(cleanedText);
            stemmer.stem();
            return stemmer.getCurrent();
          } else {
            return text.toLowerCase();
          }
        };

        // Normalize :: String -> String
        const Normalize = text => {
          const token = NlpToolkit.tokenizer(text);
          const stemmed = NlpToolkit.stemmer(token, { lang: State.lang });
          return cleanStopwords(stemmed.join(" ").trim(), State.lang);
        };

        // Normalize :: (String => String) -> String -> String -> { val: Number, msg: String }
        const calcSimilarity = (stemmer, withStr, matchStr) => {
          const s1 = stemmer(matchStr.toLowerCase().trim());
          const s2 = stemmer(withStr.toLowerCase().trim());
          const value = Natural.JaroWinklerDistance(s1, s2);

          return [value, s1];
        };

        const getMatch = (stemmer, text, sentences) =>
          sentences
            .map(s => calcSimilarity(stemmer, text, s))
            .sort(([val_a, s_a], [val_b, s_b]) => val_b - val_a)
            // .map(trace('#'))
            .filter(([val, sentence]) => val >= 0.75)
            .map(([value, txt]) => ({
              value,
              txt
            }));

        // getPropability :: String -> FnStruct -> Number
        const getPropability = (text, fn) => {
          const match = getMatch(StemmSnowball, text, fn.sentences.de)[0];
          return (match && match.value) !== undefined ? match.value : 0;
        };

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
            .sort((a, b) => b.propability - a.propability);

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

        exports.default = path => {
          // Load nlp functions
          State.functions = getNlpFunctions(path);
          const getMatch = getMatches(State.functions);
          return reqRes => {
            console.log("[Middleware] [NLP] path:", path);
            console.log("[Middleware] [NLP] ReqRes:", reqRes);

            if (!reqRes.case) {
              return reqRes;
            }

            return reqRes.case({
              Request: () => {
                console.log("[Middleware] [NLP] Request:", Request);
                // 1. Request with nlp body
                const sentence = reqRes.payload.sentence;
                if (sentence) {
                  const matchTable = getMatch(String(sentence));
                  if (matchTable.length > 0) {
                    const match = matchTable[0];
                    return Request.NLP(match.path, sentence);
                  }
                }
                // 2. NLP Request
                return reqRes;
              },
              Response: () => reqRes
            });

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
          };
        };

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
      {}
    ],
    "index.js": [
      function(require, module, exports) {
        "use strict";

        var _middleware = require("./middleware");

        var _middleware2 = _interopRequireDefault(_middleware);

        var _http = require("./gateways/http");

        var _http2 = _interopRequireDefault(_http);

        var _router = require("./router");

        var _router2 = _interopRequireDefault(_router);

        var _nlp = require("./middleware/nlp");

        var _nlp2 = _interopRequireDefault(_nlp);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        // TODO: Modify node search path for modules
        // See:
        // https://gist.github.com/branneman/8048520
        global.include = path => require(`${__dirname}/${path}`);

        // Import the app structure

        // import Request from './data/request'

        const path = `${__dirname}/../modules/functions`;
        // const nlpRouter = NlpRouter(path)

        const App = (0, _middleware2.default)();
        App
          // Define how we receive and send data
          .add((0, _http2.default)())
          // .add(NatsGateway())
          // .add(TelegramGateway())

          // Define how we process the incoming data
          .use((0, _nlp2.default)(path))
          // .use(BeuthAuthentication)

          // Decide to which function we want to route the request to
          .run(request => {
            // Get path for nlp Requests.
            console.log("[Gateway] Request: ", request);
            try {
              return (0, _router2.default)(path, request);
            } catch (e) {
              return {
                ok: false,
                payload: e
              };
            }
            // return request.case({
            //     Path: () => Router(path, request),
            //     NLP: () => nlpRouter(request)
            // })
          });
      },
      {
        "./middleware": "middleware.js",
        "./gateways/http": "gateways/http/index.js",
        "./router": "router.js",
        "./middleware/nlp": "middleware/nlp.js"
      }
    ]
  },
  {},
  ["index.js"],
  null
);
//# sourceMappingURL=/index.map
