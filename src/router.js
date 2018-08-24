// import Fn from '../data/endpoint'

const Fn = (fnpath, req) => {
  const fn = path => require(`${fnpath}${path}`);
  return fn(req.path)(req.payload);
};

export default (fnpath, request) => {
  return Fn(fnpath, request);
};
