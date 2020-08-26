
const fs = require('fs-extra')
const path = require('path')
const { resolve } = require('path')

const FAV_FILE = resolve(__dirname, 'favIcons.json')

async function saveFavicon (src, icon) {
    let favicons = await getFavicon();
    favicons[src] = icon;    
    await fs.writeJson(FAV_FILE, favicons);
}

async function getFavicon() {
    try {
        const iconJson = JSON.parse(await fs.readFile(FAV_FILE, 'utf-8'));
        return iconJson;
    } catch (e) {
        return {};
    }
}

module.exports = {
  saveFavicon,
  getFavicon
}
