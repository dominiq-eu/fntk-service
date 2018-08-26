/*
    Request

    Provides a data structure that represents an incoming request.
*/

const { Union, Result, Array } = require('@fntk/types')
const { random } = require('../utils')

const Response = Union('Response', {
    Success: Result.Ok,
    Error: Result.Err,
    Random: data_list => Result.Ok(random(Array(data_list)))
})

module.exports = Response
