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
}

// State :: State
const State = {
    lang: 'de',
    functions: []
}

//
// -- Utils
//

// trace :: String => a => a
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
    const stemmed = NlpToolkit.stemmer(token, { lang: State.lang })
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
    const match = getMatch(StemmSnowball, text, fn.sentences.de)[0]
    return (match && match.value) !== undefined ? match.value : 0
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
                console.log('[Middleware] [NLP] Request:', Request)
                // 1. Request with nlp body
                const sentence = reqRes.payload.sentence
                if (sentence) {
                    const matchTable = getMatch(String(sentence))
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
