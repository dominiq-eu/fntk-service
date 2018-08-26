/*
    telegram.js

    Get updates from telegram.
*/

const Request = require('../../data/request')
const TeleBot = require('telebot')

const toPromise = p => (p.then ? p : Promise.resolve(p))

module.exports = ({ token }) => fn => {
    const bot = new TeleBot({
        token,
        polling: {
            interval: 1000
        }
    })

    bot.on('text', msg => {
        console.log('[Gateway] [Telegram] Request: ', msg)
        const req = Request.NLP(msg.text)

        toPromise(fn(msg.text))
            .then(response => {
                console.log('[Gateway] [Telegram] Response: ', response)
                bot.sendMessage(msg.from.id, response, {
                    parseMode: 'html',
                    replyToMessage: msg.message_id
                })
            })
            .catch(e => {
                console.log('[Gateway] [Telegram] Error:', e)
                bot.sendMessage(msg.from.id, response, {
                    replyToMessage: msg.message_id
                })
            })
    })

    bot.start()
}
