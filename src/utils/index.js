const randomBetween = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min

const random = (list = []) => {
    if (list.length > 0) {
        const index = randomBetween(0, list.length - 1)
        return list[index]
    }
    return randomBetween(0, 100)
}

const Pipe = x => ({
    andThen: fn => (x.then ? Pipe(x.then(fn)) : Pipe(fn(x))),
    value: () => x
})

const Let = vars => ({
    In: f => f(vars)
})

module.exports = {
    Pipe,
    Let,
    random,
    randomBetween
}
