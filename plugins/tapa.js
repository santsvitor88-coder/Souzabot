export default {
  name: 'tapa',
  description: 'Verifica se o bot está ativo 👋',
  run: async (sock, msg) => {
    const from = msg.key.remoteJid
    await sock.sendMessage(from, { text: '🤖 O bot está ativo!' })
  }
}
