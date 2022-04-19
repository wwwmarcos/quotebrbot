const { bot } = require('./bot')
const { config } = require('./config')
const { setWebhook } = require('./setWebhook')
const { handler } = require('./handler')
const express = require('express')
const { setupFont } = require('./image')

const app = express()

handler(bot)
setupFont()

app.use(bot.webhookCallback('/callback'))

app.get('/setup', setWebhook)
app.get('/', (_, res) => res.send('ok'))

if (config.isDevelopment) {
  console.log('listening local')
  bot.launch()
}

app.listen(config.appPort, () => {
  console.log(`listening on ${config.appPort}`)
})
