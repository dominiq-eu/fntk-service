/*
    Request

    Provides a data structure that represents an incoming request.
*/

import { Data, Union } from '@fntk/types'

const RequestType = Data('Request', {
    path: String,
    payload: Object
})

const NLPRequestType = Data('NLP', {
    sentence: String
})

const Request = Union('Request', {
    Request: RequestType,
    NLP: NLPRequestType
})

export default Request
