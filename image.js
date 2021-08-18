const Canvas = require('canvas')

const buildCanvas = ({ width, height, imagePath }) => {
  const canvas = Canvas.createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  const Image = Canvas.Image
  const img = new Image()

  img.src = imagePath

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  ctx.font = '30px Ariel'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'

  return { canvas, ctx }
}

const buildTextLines = ({ text, ctx, boxSizes }) => {
  const words = text.split(' ')
  const lines = []
  let currentLine = []

  while (words.length) {
    const word = words.shift()
    const nextLine = [...currentLine, word].join(' ')

    const futureText = ctx.measureText(
      nextLine,
      boxSizes.width,
      boxSizes.height
    )

    const containsSpaceOnCurrentLine = futureText.width < boxSizes.limit
    if (containsSpaceOnCurrentLine) {
      currentLine.push(word)
    } else {
      lines.push(currentLine)
      currentLine = [word]
    }
  }

  lines.push(currentLine)

  return lines
}

const applyText = ({ text, image }) => {
  const { canvas, ctx } = buildCanvas(image)

  const boxSizes = {
    width: canvas.width / 2,
    height: canvas.height / 2,
    limit: image.limit,
    lineSpace: image.lineSpace
  }

  const lines = buildTextLines({
    text,
    ctx,
    boxSizes
  })

  for (const [index, line] of lines.entries()) {
    const newLine = line.join(' ')
    const linePosition = boxSizes.height + index * boxSizes.lineSpace

    ctx.fillText(
      newLine,
      boxSizes.width,
      linePosition
    )
  }

  return canvas.createJPEGStream()
}

module.exports = {
  applyText
}
