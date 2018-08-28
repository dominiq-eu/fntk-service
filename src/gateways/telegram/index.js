/*
    telegram.js

    Get updates from telegram.
*/

const Request = require('../../data/request')
const TeleBot = require('telebot')
const { Union, StringType } = require('@fntk/types')

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
    console.log('[Gateway] [Telegram] parseMode:', parseMode)
    ParseMode.check(parseMode)
    console.log('[Gateway] [Telegram] ParseMode:', parseMode)
    return fn => {
        const bot = new TeleBot({
            token,
            polling: {
                interval: 1000
            }
        })

        bot.on('text', msg => {
            console.log('[Gateway] [Telegram] Request: ', msg)

            const req = Request.NLP(msg.text)
            const handle = req => toPromise(fn(req))
            handle(req)
                .then(response => {
                    console.log('[Gateway] [Telegram] Response: ', response)
                    const answer = String(response.value)
                    console.log('[Gateway] [Telegram] Answer: ', answer)
                    bot.sendMessage(msg.from.id, answer, {
                        parseMode,
                        replyToMessage: msg.message_id
                    })
                })
                .catch(e => {
                    console.log('[Gateway] [Telegram] Error:', e)
                    bot.sendMessage(msg.from.id, 'Internal Error', {
                        replyToMessage: msg.message_id
                    })
                })
        })

        bot.start()
    }
}
TelegramGateway.ParseMode = ParseMode

module.exports = TelegramGateway
