const fs = require('fs')
const path = require('path')
const dono = '554188517499' // número do dono

module.exports = {
  name: 'setprefix',
  run: async (sock, msg, args) => {
    const from = msg.key.remoteJid
    const sender = msg.key.participant || msg.key.remoteJid
    if (!sender.includes(dono)) {
      await sock.sendMessage(from, { text: '❌ Apenas o dono pode mudar o prefixo!' })
      return
    }

    if (!args[0]) {
      await sock.sendMessage(from, { text: '⚙️ Use: setprefix <novo_prefixo>' })
      return
    }

    const novoPrefixo = args[0]
    const prefixoPath = path.join(__dirname, 'prefixo.json')
    fs.writeFileSync(prefixoPath, JSON.stringify({ prefix: novoPrefixo }, null, 2))
    await sock.sendMessage(from, { text: `✅ Prefixo alterado para: ${novoPrefixo}` })
  }
}
