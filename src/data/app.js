/*
    App.js

    Provides a data structure for basic app behaivor.
*/

//
// App
//  * fn: The app logic
//  * sources: A list of functions that act as data sources and generate data
//  * layer: A list of functions that builds a pipeline and manipulate the
//           data before reaching the app logic (fn)
//
// App :: Function -> List(Function) -> List(Function) -> Nothing
const App = (fn = x => x, sources = [], layer = []) => ({
    // Here we register data sources. They can create data and feed in
    // the system.
    source: s => App(fn, sources.concat([s]), layer),

    // Here we add a layer to manipulate the data on his way trough the
    // system and before it reaches it's final processing.
    // add: l => App(x => l(f(x))),
    add: l => App(fn, sources, layer.concat([l])),

    // Add the data processing
    do: f => App(f, sources, layer),

    // Start the app
    start: () => {
        // Build the data processing pipeline using composition.
        const dataPipeline = layer
            .concat(fn)
            .reduce((f, g) => x => g(f(x)), x => x)

        // Hand the data processing pipeline to the data sources,
        // so that every source can pass new data to the app.
        sources.forEach(s => s(dataPipeline))
    }
})

module.exports = App
