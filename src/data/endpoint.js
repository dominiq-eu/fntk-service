// const Fs = require('fs')

// const Module = dir => {
//     const cfg = require(`${dir}/package.json`)
//     const type = parseType(cfg.type)
//     const file = cfg.main
//     const pkg = require(`${dir}/${file}`)
//     return { type, pkg }
// }

// const parseType = t => {
//     const type = String(t).toLowerCase()
//     switch (type) {
//         case 'http' | 'nlp':
//             return type

//         default:
//             return 'http'
//     }
// }

// module.exports = Module

// opaque type Request = {
//     type: string,
//     payload: mixed
// }
// opaque type Response = {
//     ok: boolean,
//     payload: mixed
// }
//
// opaque type Function = {
//     path: string,
//     nlp: string[],
//     handler: Request => Response
// }

const load = path => require(`../modules/endpoints/${path}`);
const call = (request, fn) => fn(request.data);

export default {
  load,
  call
};
