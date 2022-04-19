const path = require('path')
const { applyText } = require('./image')

const buildImagePath = fileName => path.join(process.cwd(), 'assets', 'images', fileName)

const will = {
  width: 448,
  height: 450,
  limit: 400,
  lineSpace: 40,
  imagePath: buildImagePath('will.jpg')
}

const obama = {
  width: 512,
  height: 512,
  limit: 500,
  lineSpace: 40,
  imagePath: buildImagePath('obama.png')
}

const images = [
  { command: 'obama', image: obama },
  { command: 'will', image: will }
]

const handler = bot => {
  const commands = images.map(
    image => image.command
  )

  bot.command(commands, async ctx => {
    const text = ctx.message?.text

    if (!text) {
      return
    }

    const command = images.find(
      ({ command }) => text.includes(command)
    )

    const [, ...rest] = text.split(' ')
    const textWithoutCommand = rest.join(' ')

    const imageStream = applyText({
      text: textWithoutCommand,
      image: command.image
    })

    await ctx.replyWithPhoto({
      source: imageStream
    })
  })
}

module.exports = {
  handler
}
