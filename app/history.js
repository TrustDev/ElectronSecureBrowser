
let historyExtension = null

module.exports = {
  setExtension,
  search
}

function setExtension (extension) {
  historyExtension = extension
}

async function search (query = '') {
  const { webContents } = historyExtension.backgroundPage

  return webContents.executeJavaScript(`
    (async () => {
      let result = []
      for await(let item of searchHistory(${JSON.stringify(query)}, -1)) {
        result.push(item)
      }
      return result
    })()
  `)
}
