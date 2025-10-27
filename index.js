/*
 * 🧠 Souza-BOT Base com suporte a plugins
 * Conexão via Baileys + carregamento automático de plugins
 */

import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from "@whiskeysockets/baileys"
import pino from "pino"
import qrcode from "qrcode-terminal"
import fs from "fs"
import path from "path"

async function iniciarBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth')
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: true,
    browser: ['SouzaBot', 'Chrome', '10.0']
  })

  // 📩 Escuta todas as mensagens recebidas
sock.ev.on('messages.upsert', async (m) => {
  const msg = m.messages[0]
  if (!msg.message || msg.key.fromMe) return

  const from = msg.key.remoteJid
  const body = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
  
  console.log(`💬 Mensagem recebida de ${from}: ${body}`)
    
  // Prefixo padrão
  const prefix = '/'
  if (!body.startsWith(prefix)) return

  // Separa comando e argumentos
  const args = body.slice(prefix.length).trim().split(/ +/)
  const comando = args.shift().toLowerCase()

  // Executa plugins carregados dinamicamente
  try {
    const pluginsPath = path.join(process.cwd(), 'plugins')
    const pluginFiles = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js'))

    for (const file of pluginFiles) {
      const plugin = await import(path.join(pluginsPath, file))
      if (plugin.default && plugin.default.name === comando) {
        await plugin.default.run(sock, msg, args)
        break
      }
    }
  } catch (err) {
    console.error('Erro ao executar comando:', err)
  }
})
    
  // 🔄 Atualiza sessão automaticamente
  sock.ev.on('creds.update', saveCreds)

  // 🟢 Conexão e QR
  sock.ev.on('connection.update', update => {
    const { connection, qr } = update
    if (qr) qrcode.generate(qr, { small: true })
    if (connection === 'open') console.log('✅ Souza-BOT conectado com sucesso!')
    if (connection === 'close') console.log('⚠️ Conexão encerrada. Reinicie se necessário.')
  })

  // 🔌 Carregamento automático de plugins
  const pluginsPath = path.join(process.cwd(), 'plugins')
  if (!fs.existsSync(pluginsPath)) fs.mkdirSync(pluginsPath)
  const pluginFiles = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js'))

  for (const file of pluginFiles) {
    try {
      const plugin = await import(path.join(pluginsPath, file))
      if (plugin.default && plugin.default.run) {
        console.log(`✅ Plugin carregado: ${file}`)
      } else {
        console.log(`⚠️ Plugin ${file} não exporta uma função válida`)
      }
    } catch (err) {
      console.error(`❌ Erro ao carregar plugin ${file}:`, err)
    }
  }

  console.log(`🔰 Total de plugins: ${pluginFiles.length}`)
}

iniciarBot()

import { DisconnectReason } from "@whiskeysockets/baileys"

async function conectar() {
  await iniciarBot().catch(async err => {
    console.error('Erro ao iniciar bot:', err)
    if (err?.output?.statusCode !== DisconnectReason.loggedOut) {
      console.log('🔄 Tentando reconectar...')
      setTimeout(conectar, 5000)
    } else {
      console.log('❌ Sessão expirada, escaneie o QR novamente.')
    }
  })
}

conectar()
