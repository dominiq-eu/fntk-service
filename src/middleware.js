/*
    Middleware.js

    Provides a data structure to implement a middleware.
*/

// A list of gateways, that renerate requests and handle responses.
const gateways = [];

// The app logic
const Middleware = (g = x => x) => ({
  //
  add: f => {
    gateways.push(f);
    return Middleware(g);
  },

  use: f => Middleware(x => f(g(x))),
  run: f => {
    // Specify how the request flows through the system.
    //
    // g()  The registered middlewares for processing resquest and
    //      response.
    //
    // f()  The function to transform a request to a response.
    //
    // So g(f(g(req))) means:
    //
    // 1. Take the request and let the middlewares process it
    // 2. Transform the request to a response
    // 3. Let the middlewares process the response

    const flow = req => g(f(g(req)));
    // const flow = pipe(
    //     g,
    //     f,
    //     g
    // )

    // Hand the program flow to the registered gateways,
    // so that every gateway can pass new (received) requests
    // to the app flow.
    gateways.map(gateway => gateway(flow));
  }
});

export default Middleware;
