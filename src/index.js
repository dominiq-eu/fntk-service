// TODO: Modify node search path for modules
// See:
// https://gist.github.com/branneman/8048520
global.include = path => require(`${__dirname}/${path}`);

// Import the app structure
import Middleware from "./middleware";
import HttpGateway from "./gateways/http";
import Router from "./router";
import NlpLayer from "./middleware/nlp";

// import Request from './data/request'

const path = `${__dirname}/../modules/functions`;
// const nlpRouter = NlpRouter(path)

const App = Middleware();
App
  // Define how we receive and send data
  .add(HttpGateway())
  // .add(NatsGateway())
  // .add(TelegramGateway())

  // Define how we process the incoming data
  .use(NlpLayer(path))
  // .use(BeuthAuthentication)

  // Decide to which function we want to route the request to
  .run(request => {
    // Get path for nlp Requests.
    console.log("[Gateway] Request: ", request);
    try {
      return Router(path, request);
    } catch (e) {
      return {
        ok: false,
        payload: e
      };
    }
    // return request.case({
    //     Path: () => Router(path, request),
    //     NLP: () => nlpRouter(request)
    // })
  });
