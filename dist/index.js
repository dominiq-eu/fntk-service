parcelRequire = (function(e, r, n, t) {
    var i = 'function' == typeof parcelRequire && parcelRequire,
        o = 'function' == typeof require && require
    function u(n, t) {
        if (!r[n]) {
            if (!e[n]) {
                var f = 'function' == typeof parcelRequire && parcelRequire
                if (!t && f) return f(n, !0)
                if (i) return i(n, !0)
                if (o && 'string' == typeof n) return o(n)
                var c = new Error("Cannot find module '" + n + "'")
                throw ((c.code = 'MODULE_NOT_FOUND'), c)
            }
            p.resolve = function(r) {
                return e[n][1][r] || r
            }
            var l = (r[n] = new u.Module(n))
            e[n][0].call(l.exports, p, l, l.exports, this)
        }
        return r[n].exports
        function p(e) {
            return u(p.resolve(e))
        }
    }
    ;(u.isParcelRequire = !0),
        (u.Module = function(e) {
            ;(this.id = e), (this.bundle = u), (this.exports = {})
        }),
        (u.modules = e),
        (u.cache = r),
        (u.parent = i),
        (u.register = function(r, n) {
            e[r] = [
                function(e, r) {
                    r.exports = n
                },
                {}
            ]
        })
    for (var f = 0; f < n.length; f++) u(n[f])
    if (n.length) {
        var c = u(n[n.length - 1])
        'object' == typeof exports && 'undefined' != typeof module
            ? (module.exports = c)
            : 'function' == typeof define && define.amd
                ? define(function() {
                      return c
                  })
                : t && (this[t] = c)
    }
    return u
})(
    {
        '2SjF': [
            function(require, module, exports) {
                const c = (o = c => c, t = [], a = []) => ({
                    source: d => c(o, t.concat([d]), a),
                    add: d => c(o, t, a.concat([d])),
                    do: o => c(o, t, a),
                    start: () => {
                        const c = a
                            .concat(o)
                            .reduce((c, o) => t => o(c(t)), c => c)
                        t.forEach(o => o(c))
                    }
                })
                module.exports = c
            },
            {}
        ],
        '9ee7': [
            function(require, module, exports) {
                const {
                        Type: e,
                        Data: t,
                        Union: n,
                        String: s,
                        Object: a
                    } = require('@fntk/types'),
                    c = t('Request', { path: s, payload: a }),
                    i = e(
                        'NLP',
                        e => a.is(e) && e.sentence && s.is(e.sentence),
                        e => ({ sentence: s(e) })
                    ),
                    o = n('Request', { Request: c, NLP: i })
                module.exports = o
            },
            {}
        ],
        jWsf: [
            function(require, module, exports) {
                'use strict'
                Object.defineProperty(exports, '__esModule', { value: !0 })
                const e = (exports.randomBetween = (e, t) =>
                        Math.floor(Math.random() * (t - e + 1)) + e),
                    t = (exports.random = (t = []) => {
                        if (t.length > 0) {
                            return t[e(0, t.length - 1)]
                        }
                        return e(0, 100)
                    })
            },
            {}
        ],
        csfc: [
            function(require, module, exports) {
                const { Type: e, Union: r, Result: s } = require('@fntk/types'),
                    { random: o } = require('../utils'),
                    n = e('Random', e => s.Ok.is(e), e => s.Ok(o(e))),
                    t = r('Response', {
                        Success: s.Ok,
                        Error: s.Err,
                        Random: n
                    })
                module.exports = t
            },
            { '../utils': 'jWsf' }
        ],
        shZs: [
            function(require, module, exports) {
                const e = require('express'),
                    r = require('compression'),
                    t = require('body-parser'),
                    o = require('url'),
                    s = require('http'),
                    { Data: n } = require('@fntk/types'),
                    l = n('HTTPHeader', {
                        method: String,
                        url: String,
                        path: String,
                        headers: Object
                    }),
                    u = n('HTTPRequest', { http: l, data: Object }),
                    a = e => null !== e && 'object' == typeof e,
                    i = e => (e.then ? e : Promise.resolve(e)),
                    d = e => (a(e) ? JSON.stringify(e, null, 4) : e),
                    c = e => Boolean(Object.keys(e).length),
                    h = s =>
                        e()
                            .use(r())
                            .use(t.json())
                            .use(t.urlencoded({ extended: !0 }))
                            .all('*', (e, r, t) => {
                                const n = o.parse(e.url, !0)
                                console.log('URL:', n)
                                const a = u({
                                    http: l({
                                        method: e.method,
                                        headers: e.headers,
                                        url: e.url,
                                        path: n.pathname
                                    }),
                                    data: c(n.query) ? n.query : e.body
                                })
                                console.log('Request:', a)
                                ;(e => i(s(e)))(a)
                                    .then(d)
                                    .then(e => {
                                        console.log(
                                            '[WebService] Response: ',
                                            e
                                        ),
                                            r.write(e),
                                            r.end()
                                    })
                            }),
                    p = e => {
                        const r = h(e)
                        s.createServer(r).listen(8e3, () => {
                            console.log('Listening on port: 8000')
                        })
                    }
                module.exports = { program: p }
            },
            {}
        ],
        '9Fxe': [
            function(require, module, exports) {
                const e = require('./web-service'),
                    t = require('../../data/request')
                module.exports = o => o =>
                    e.program(e => {
                        console.log('Http:', e)
                        const r = t.Request({
                            path: e.http.path,
                            payload: e.data
                        })
                        return console.log('Request:', r), o(r)
                    })
            },
            { './web-service': 'shZs', '../../data/request': '9ee7' }
        ],
        '8f4u': [
            function(require, module, exports) {
                const e = require('../../data/request'),
                    o = require('telebot'),
                    s = e => (e.then ? e : Promise.resolve(e))
                module.exports = ({ token: r, parseMode: t = 'text' }) => a => {
                    const l = new o({ token: r, polling: { interval: 1e3 } })
                    l.on('text', o => {
                        console.log('[Gateway] [Telegram] Request: ', o)
                        ;(e => s(a(e)))(e.NLP(o.text))
                            .then(e => {
                                console.log(
                                    '[Gateway] [Telegram] Response: ',
                                    e
                                )
                                const s = String(e.value)
                                console.log('[Gateway] [Telegram] Answer: ', s),
                                    l.sendMessage(o.from.id, s, {
                                        parseMode: t,
                                        replyToMessage: o.message_id
                                    })
                            })
                            .catch(e => {
                                console.log('[Gateway] [Telegram] Error:', e),
                                    l.sendMessage(o.from.id, 'Internal Error', {
                                        replyToMessage: o.message_id
                                    })
                            })
                    }),
                        l.start()
                }
            },
            { '../../data/request': '9ee7' }
        ],
        T0sK: [
            function(require, module, exports) {
                const e = require('snowball'),
                    t = require('natural'),
                    n = require('nlp-toolkit'),
                    r = require('stopwords-iso'),
                    o = require('fs'),
                    s = require('../data/request'),
                    a = require('../data/response'),
                    i = { de: 'German', en: 'English' },
                    l = { lang: 'de', functions: [] },
                    c = e => t => (console.log(e, t), t),
                    u = e =>
                        o
                            .readdirSync(e)
                            .map(t => `${e}/${t}`)
                            .filter(e => o.statSync(e).isDirectory())
                            .reduce((e, t) => e.concat(t).concat(u(t)), []),
                    p = e =>
                        u(e).reduce((t, n) => {
                            try {
                                const r = require(`${n}/function.json`)
                                ;(r.sentences.de || r.sentences.en) &&
                                    t.push({
                                        path: n.replace(e, ''),
                                        sentences: r.sentences
                                    })
                            } catch (e) {}
                            return t
                        }, []),
                    d = (e, t) =>
                        e
                            .split(' ')
                            .filter(e => !r[t].includes(e))
                            .join(' ')
                            .trim(),
                    g = t => {
                        if (t.length > 5) {
                            const n = new e(i[l.lang]),
                                r = d(t.toLowerCase().trim(), l.lang)
                            return n.setCurrent(r), n.stem(), n.getCurrent()
                        }
                        return t.toLowerCase()
                    },
                    h = e => {
                        const t = n.tokenizer(e),
                            r = n.stemmer(t, { lang: l.lang })
                        return d(r.join(' ').trim(), l.lang)
                    },
                    f = (e, n, r) => {
                        const o = e(r.toLowerCase().trim()),
                            s = e(n.toLowerCase().trim())
                        return [t.JaroWinklerDistance(o, s), o]
                    },
                    m = (e, t, n) =>
                        n
                            .map(n => f(e, t, n))
                            .sort(([e, t], [n, r]) => n - e)
                            .filter(([e, t]) => e >= 0.75)
                            .map(([e, t]) => ({ value: e, txt: t })),
                    q = (e, t) => {
                        const n = m(g, e, t.sentences.de)[0]
                        return void 0 !== (n && n.value) ? n.value : 0
                    },
                    w = e => t =>
                        e
                            .reduce(
                                (e, n) =>
                                    e.concat([
                                        {
                                            propability: q(t, n),
                                            sentences: n.sentences,
                                            path: n.path
                                        }
                                    ]),
                                []
                            )
                            .filter(e => e.propability > 0)
                            .sort((e, t) => t.propability - e.propability)
                module.exports = ({ path: e }) => {
                    console.log('[Middleware] [NLP] Path:', e),
                        (l.functions = p(e)),
                        console.log('GetNlpFunctions:', l.functions)
                    const t = w(l.functions)
                    return (
                        console.log('getMatch:', t),
                        e => {
                            if (
                                (console.log('[Middleware] [NLP] ReqRes:', e),
                                s.NLP.is(e))
                            ) {
                                console.log('[Middleware] [NLP] Request:', e)
                                const n = e.sentence,
                                    r = t(n)
                                if (
                                    (console.log('MatchTable:', r),
                                    r.length > 0)
                                ) {
                                    const e = r[0].path,
                                        t = s.Request({
                                            path: e,
                                            payload: { sentence: n }
                                        })
                                    return (
                                        console.log(
                                            '[Middleware] [NLP] Generated Request:',
                                            t
                                        ),
                                        t
                                    )
                                }
                            }
                            return e
                        }
                    )
                }
            },
            { '../data/request': '9ee7', '../data/response': 'csfc' }
        ],
        Focm: [
            function(require, module, exports) {
                global.include = e => require(`${__dirname}/${e}`)
                const e = require('./data/app'),
                    r = require('./data/request'),
                    t = require('./data/response'),
                    a = require('./gateways/http'),
                    o = require('./gateways/telegram'),
                    u = require('./middleware/nlp'),
                    n = require('path'),
                    s = n.resolve(process.cwd()) + '/functions',
                    i = 3e3,
                    d = (e, r) => {
                        return require(r)(e.payload)
                    },
                    l = ({ path: e }) => a => {
                        if (!r.Request.is(a)) return t.Error('Invalid request.')
                        {
                            const r = `${e}${a.path}`
                            try {
                                return (
                                    console.log('Load Function: Path: ', r),
                                    console.log('Load Function: Request: ', a),
                                    d(a, r)
                                )
                            } catch (e) {
                                return (
                                    console.log('Load Function: Error: ', e),
                                    t.Error("Can't find " + r)
                                )
                            }
                        }
                    },
                    p = e()
                        .source(a({ port: 3e3 }))
                        .add(u({ path: s }))
                        .do(l({ path: s }))
                module.exports = {
                    Service: p,
                    App: e,
                    Router: l,
                    Request: r,
                    Response: t,
                    HTTPGateway: a,
                    TelegramGateway: o,
                    NLPMiddleware: u
                }
            },
            {
                './data/app': '2SjF',
                './data/request': '9ee7',
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
