const { applyText } = require('./image')
const fs = require('fs')
const path = require('path')
const sizeOf = require('image-size')

const getImagesFromDir = () => {
  const IMAGES_DIR = path.join(process.cwd(), 'assets', 'images')
  const files = fs.readdirSync(IMAGES_DIR)
  return files
}

const getCommandName = message => {
  const match = message.match(/^\/([^\s]+)\s?(.+)?/)
  return match[1]
}

const buildImagePath = fileName =>
  path.join(process.cwd(), 'assets', 'images', fileName)

const getImageInfo = commandName => {
  const imagePath = buildImagePath(commandName)
  const dimensions = sizeOf(imagePath)

  return {
    ...dimensions,
    limit: dimensions.width - 100,
    lineSpace: 40,
    imagePath
  }
}

const handler = bot => {
  const commands = getImagesFromDir()

  bot.command(commands, async ctx => {
    const text = ctx.message?.text

    if (!text) {
      return
    }

    const [, ...rest] = text.split(' ')
    const textWithoutCommand = rest.join(' ')

    const commandName = getCommandName(text)
    const image = getImageInfo(commandName)

    const imageStream = applyText({
      text: textWithoutCommand,
      image
    })

    await ctx.replyWithPhoto({
      source: imageStream
    })
  })
}

module.exports = {
  handler
}
