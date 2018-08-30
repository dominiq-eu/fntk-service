/*
    telegram.js

    Get updates from telegram.
*/

const Request = require('../../data/request')
const TeleBot = require('telebot')
const { Union, StringType } = require('@fntk/types')
const { Log } = require('@fntk/utils')

const log = Log('TelegramGateway')

//
// -- Helper --
//
const toPromise = p => (p.then ? p : Promise.resolve(p))

//
// -- Types --
//

const ParseMode = Union('TelegramParseMode', {
    Text: StringType.of('Text'),
    Markdown: StringType.of('Markdown'),
    HTML: StringType.of('HTML')
})

// On token:
// https://core.telegram.org/bots/api#authorizing-your-bot
//
// On parseMode:
// https://core.telegram.org/bots/api#formatting-options
//
const TelegramGateway = function({ token, parseMode = ParseMode.Text() }) {
    log.debug('parseMode', parseMode)
    ParseMode.check(parseMode)
    log.debug('ParseMode', parseMode)
    return fn => {
        const bot = new TeleBot({
            token,
            polling: {
                interval: 1000
            }
        })

        // eslint-disable-next-line fp/no-unused-expression
        bot.on('text', msg => {
            log.debug('Request', msg)

            const handle = req => toPromise(fn(req))
            const req = Request.NLP(msg.text)
            return handle(req)
                .then(response => {
                    log.debug('Response', response)
                    const answer = String(response.value)
                    log.debug('Answer', answer)
                    return bot.sendMessage(msg.from.id, answer, {
                        parseMode,
                        replyToMessage: msg.message_id
                    })
                })
                .catch(e => {
                    log.debug('Error', e)
                    return bot.sendMessage(msg.from.id, 'Internal Error', {
                        replyToMessage: msg.message_id
                    })
                })
        })

        return bot.start()
    }
}
TelegramGateway.ParseMode = ParseMode

module.exports = TelegramGateway
