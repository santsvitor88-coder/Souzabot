export default {
  name: "menubrinks",
  run: async (sock, msg, args) => {
    try {
      // Data e hora automáticas (sem moment)
      const agora = new Date()
      const data = agora.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })
      const hora = agora.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo" })

      const prefix = global.prefix || "/"
      const dono = "Sz </>"

      const menu = `
╭───🍒───────────────╮
🍒 🎀 ▸📆 Data: ${data}
🍒 🎀 ▸⌛ Hora: ${hora}
🍒 🎀 ▸🫟 Prefixo: ${prefix}
🍒 🎀 ▸🏴‍☠️ Dono: ${dono}
┃ ╰───🍒───────────────╯

│╭───🍒───────────────╮
┃ ╭──〔 BRINCADEIRAS 〕
🍒 🎀 ▸${prefix}jogodavelha
🍒 🎀 ▸${prefix}resetarvelha / rv
🍒 🎀 ▸${prefix}chance
🍒 🎀 ▸${prefix}comer
🍒 🎀 ▸${prefix}capinarlote
🍒 🎀 ▸${prefix}pgpeito
🍒 🎀 ▸${prefix}pgpau
🍒 🎀 ▸${prefix}pgbunda
🍒 🎀 ▸${prefix}morder
🍒 🎀 ▸${prefix}sentar
🍒 🎀 ▸${prefix}tirarft
🍒 🎀 ▸${prefix}estuprar
🍒 🎀 ▸${prefix}boquete
🍒 🎀 ▸${prefix}cagar
🍒 🎀 ▸${prefix}cu
🍒 🎀 ▸${prefix}abraco
🍒 🎀 ▸${prefix}lavarlouca
🍒 🎀 ▸${prefix}carinho
🍒 🎀 ▸${prefix}morte / death
🍒 🎀 ▸${prefix}ppt
🍒 🎀 ▸${prefix}nazista
🍒 🎀 ▸${prefix}gay
🍒 🎀 ▸${prefix}feio
🍒 🎀 ▸${prefix}corno
🍒 🎀 ▸${prefix}vesgo
🍒 🎀 ▸${prefix}bebado
🍒 🎀 ▸${prefix}gado
🍒 🎀 ▸${prefix}fiel
🍒 🎀 ▸${prefix}lindo / linda
🍒 🎀 ▸${prefix}gostoso / gostosa
🍒 🎀 ▸${prefix}chutar
🍒 🎀 ▸${prefix}dogolpe
🍒 🎀 ▸${prefix}casal
🍒 🎀 ▸${prefix}trisal
🍒 🎀 ▸${prefix}gozar
🍒 🎀 ▸${prefix}vcprefere
🍒 🎀 ▸${prefix}eununca
🍒 🎀 ▸${prefix}rankgay
🍒 🎀 ▸${prefix}rankcasalsin
🍒 🎀 ▸${prefix}rankfalido
🍒 🎀 ▸${prefix}rankcu
🍒 🎀 ▸${prefix}rankbct
🍒 🎀 ▸${prefix}rankgado
🍒 🎀 ▸${prefix}rankcorno
🍒 🎀 ▸${prefix}suruba
🍒 🎀 ▸${prefix}rankgostoso
🍒 🎀 ▸${prefix}rankgostosa
🍒 🎀 ▸${prefix}ranknazista
🍒 🎀 ▸${prefix}rankotaku
🍒 🎀 ▸${prefix}ranksigma
🍒 🎀 ▸${prefix}rankbeta
🍒 🎀 ▸${prefix}rankbaiano
🍒 🎀 ▸${prefix}rankbaiana
🍒 🎀 ▸${prefix}rankcarioca
🍒 🎀 ▸${prefix}ranklouco / ranklouca
🍒 🎀 ▸${prefix}ranksafado / ranksafada
🍒 🎀 ▸${prefix}rankmacaco
🍒 🎀 ▸${prefix}rankmacaca
🍒 🎀 ▸${prefix}rankputa
🍒 🎀 ▸${prefix}rankpau
┃ ╰────────────────────
┃╰───🍒───────────────╯
      `

      await sock.sendMessage(msg.key.remoteJid, { text: menu }, { quoted: msg })
    } catch (err) {
      console.error(err)
      await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Erro ao exibir o menu de brincadeiras!" }, { quoted: msg })
    }
  }
}
