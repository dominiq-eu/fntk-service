// import Immutable from 'seamless-immutable'
//
//
//

//
// -- Helper
//

const compose = (f, g) => x => f(g(x));
const throwError = e => {
  throw new TypeError(e);
};
const toObject = (obj, val) => {
  const name = val[0];
  const value = val[1];
  obj[name] = value;
  return obj;
};
const addIsFunction = (obj, typecheck) => {
  obj.is = typecheck;
  return obj;
};

//
// We don't allow null, undefined, and NaN as type values, in the hope that
// it prevents some errors. The function returns the input type if the value
// pass the null check.
//
// nullCheck :: a => a
const nullCheck = x =>
  x !== undefined && x !== null && x !== NaN
    ? x
    : throwError("Null check failed: ", x);

//
// Check if the given value is from the same type as given type. To archive
// this, we use the <type>.is() function if available and if not, we check
// weather the constructor of the type and the constructor that created the
// value are equal.
//
// typecheck :: Type -> Value -> Value
const typecheck = (name, typeObj, valuesObj) => {
  const type = nullCheck(typeObj)[name];
  const val = nullCheck(valuesObj)[name];
  const value = nullCheck(val);
  const valid = type.is
    ? type.is(value)
    : type.prototype.constructor === value.constructor;
  if (valid) {
    return value;
  } else {
    throwError("TypeCheck Failed!");
  }
};

//
// Build a constructor for a type and type check the parameter.
// TODO: Use Immutable types.
//
// makeConstructor :: { Name: Type } => ({ Name: Value } => Object)
const makeConstructor = fields => param => {
  const obj = Object.keys(fields)
    .map(name =>
      // [ Type name, Type Value ]
      [name, typecheck(name, fields, param)]
    )
    .reduce(toObject, {});
  return obj;
};

//
// Create a new type.
// The parameter 'constructors' is an object containing one or more keys.
// From this arise two different possibilities how we handle it.
//
//  One key
//      * Create a type constructor out of the given parameters and
//        return it. We're creating a simple type.
//
//  Multiple keys
//      * Create an object containing the constructors and return
//        the object. We're creating an Union type.
//
// Type :: { String: Object, ... } -> Type
function Type(constructors) {
  const c = Object.keys(constructors)
    .map(name =>
      // [ Param Name, Type ]
      [name, constructors[name]]
    )
    .map(([name, params]) =>
      // [ Param Name, Type Constructor ]
      [name, makeConstructor(params)]
    );

  return c.length === 1
    ? // Returning the type constructor.
      c[0][1]
    : // Return an union type constructor.
      c.reduce(toObject, {});
}

// Patch default types with validator functions aka. <TYPE>.is(x)
// when importing this module.
// patchDefaultTypes()

//
// -- Type checks for basic types
//

const isString = s => typeof s === "string";
const isNumber = n => typeof n === "number";
const isBoolean = b => typeof b === "boolean";
const isObject = o => typeof o === "object";
const isFunction = f => typeof f === "function";
const isArray = Array.isArray;

const defaultTypeChecks = [
  // [ Constructor, Checker ]
  [String, isString],
  [Number, isNumber],
  [Boolean, isBoolean],
  [Object, isObject],
  [Function, isFunction],
  [Array, isArray]
];

//
// Let the user choose if they want to patch types so that they
// contain a <type>.is() function. Following types will be patched:
//      * String
//      * Number
//      * Boolean
//      * Object
//      * Function
//      * Array
//
// Examples:
//      String.is("hey") -> true
//      Array.is([])     -> true
//
// patchDefaultTypes
Type.patchDefaultTypes = function() {
  defaultTypeChecks.map(([type, check]) =>
    //
    addIsFunction(type, check)
  );
};

module.exports = Type;

// const createTypeCheck = t => {
//     const validator = validators.reduce((checker, val) => {
//         const [constructor, check] = val
//         if (!checker && check(t)) {
//             // Found type -> return function for type checking
//             return compose(
//                 nullCheck,
//                 constructor
//             )
//         }
//         return checker
//     }, undefined)

//     return !validator ? throwError('TypeCheck:', t, 'failed') : validator
// }

// const TYPE = '@@type'
// const VALUES = '@@values'
// const TAGS = '@@tags'

//
// Examples of how this lib should work:
//
// const HttpHeaders = Type('HttpHeaders', {
// const HttpHeaders = Type({ HttpHeaders: {
//     contentType: String,
//     authorization: String
// }})
//
// const headers = HttpHeaders({ contentType: 'json', authorization: '' })
// console.log(headers)
//
// const Http = Type({ Http: {
//     method: String,
//     body: Object,
//     headers: HttpHeaders
// }})
//
// const http = Http({ method: '', body: '', headers: HttpHeaders({}) })
//
// const Path = Type({ Path: { name: String } })
//
// const Request = Type({
//     Path,
//     Http
// })
//
// const p = Request.Path({ name: '/reco' })
// p.case({
//     Path: p => 'Show me your path',
//     Http: h => 'Drop some request'
// })
//
