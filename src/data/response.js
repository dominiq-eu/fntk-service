/*
    Request

    Provides a data structure that represents an incoming request.
*/

import { Union, Result } from '@fntk/types'
import { random } from '../utils'

const Response = Union('Response', {
    Success: Result.Ok,
    Error: Result.Err,
    Random: data_list => Result.Ok(random(data_list))
})

export default Response
