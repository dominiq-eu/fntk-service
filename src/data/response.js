/*
    Request

    Provides a data structure that represents an incoming request.
*/

const { Type, Union, Result } = require('@fntk/types')
const { random } = require('../utils')

const RandomOkType = Type(
    'Random',
    v => Result.Ok.is(v),
    data_list => Result.Ok(random(data_list))
)

const Response = Union('Response', {
    Success: Result.Ok,
    Error: Result.Err,
    Random: RandomOkType
})

module.exports = Response
