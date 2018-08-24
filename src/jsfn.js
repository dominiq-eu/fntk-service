#! /usr/bin/env node
/*
    jsfn.js

    Start a service with the functions in the current directory.

        * ./functions/
        * ./middleware/
        * ./gateway/
*/

import { Service, HTTPGateway } from "./index.js";

// Create the service and add a gateway. They create requests and handle
// the sending of the response.
Service()
  .add(HTTPGateway({ port: 3000 }))
  // .add(NATSGateway)
  // .use(NLPMiddleware)
  .start();
