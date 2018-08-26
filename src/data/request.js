/*
    Request

    Provides a data structure that represents an incoming request.
*/

const { Type, Data, Union, String, Object } = require('@fntk/types')

const RequestType = Data('Request', {
    path: String,
    payload: Object
})

const NLPRequestType = Type(
    'NLP',
    v => Object.is(v) && v.sentence && String.is(v.sentence),
    v => ({ sentence: String(v) })
)

const Request = Union('Request', {
    Request: RequestType,
    NLP: NLPRequestType
})

module.exports = Request
