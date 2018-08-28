/*
    Request

    Provides a data structure that represents an incoming request.
*/

const { Type, Union, Result } = require('@fntk/types')
const { random } = require('../utils')

const RandomOkType = Result.Ok.derive(val_list => random(val_list))

const Response = Union('Response', {
    Success: Result.Ok,
    Error: Result.Err,
    Random: RandomOkType
})

module.exports = Response
