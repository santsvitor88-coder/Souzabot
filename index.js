/*
 * 🧠 Souza-BOT Base com suporte a plugins
 * 🔌 Conexão via Baileys + carregamento automático de plugins
 */

// 🔑 Chave fixa do SouzaBOT
const souzakey = 'Souzapzzy' // ← coloque sua chave aqui
global.souzakey = souzakey

// 🧩 Teste de chave no topo do Index.js
console.log('===============================')
console.log('🟢 Iniciando SouzaBOT...')
console.log('🔑 Verificando chave...')
console.log('Chave atual:', souzakey || '❌ Nenhuma chave detectada!')
console.log('===============================')

import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from "@whiskeysockets/baileys"
import pino from "pino"
import qrcode from "qrcode-terminal"
import fs from "fs"
import path from "path"
import { DONOS } from "./dono/donos.js"


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
    
    // 🚫 Bloqueia mensagens privadas (só responde em grupos uma única vez)
const chatId = msg.key.remoteJid
const isGroup = chatId.endsWith('@g.us')

// Caminho do arquivo que guarda quem já foi avisado
const avisosPath = './avisos.json'

// Se o arquivo não existir, cria um vazio
if (!fs.existsSync(avisosPath)) {
  fs.writeFileSync(avisosPath, JSON.stringify([]))
}

// Carrega lista de quem já foi avisado
let avisos = JSON.parse(fs.readFileSync(avisosPath))

if (!isGroup) {
  // Se ainda não foi avisado, envia e registra
  if (!avisos.includes(chatId)) {
    await sock.sendMessage(chatId, { 
      text: '❌ Eu não respondo mensagens no privado. Use-me em um grupo!' 
    })
    avisos.push(chatId)
    fs.writeFileSync(avisosPath, JSON.stringify(avisos, null, 2))
  }
  return
}
    
    // 🔹 Captura número e corpo da mensagem
const from = msg.key.remoteJid
const body = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
let numeroRemetente = msg.key.participant || msg.key.remoteJid

// 🔧 Função para limpar e padronizar número ou LID
function limparNumero(jid) {
  if (!jid) return ""

  // Se for LID, mantém ele (ex: 120363403381125311@lid → 120363403381125311)
  if (jid.includes("@lid")) {
    return jid.replace("@lid", "")
  }

  // Remove sufixos do WhatsApp padrão
  let num = jid.replace(/@s\.whatsapp\.net|@c\.us|@g\.us/g, "")
  num = num.replace(/\D/g, "")

  // Se não tiver DDI, adiciona
  if (!num.startsWith("55")) num = "55" + num
  return num
}

numeroRemetente = limparNumero(numeroRemetente)

// 🔍 Verifica se é dono
const ehDono = DONOS.includes(numeroRemetente)
msg.ehDono = ehDono
msg.numero = numeroRemetente

console.log(`📞 Número detectado: ${numeroRemetente} | Dono: ${ehDono}`)
console.log(`💬 Mensagem recebida de ${from}: ${body}`)

    
  // 📌 Carrega prefixo do arquivo ou usa padrão
let prefix = '!'
try {
  const dadosPrefixo = JSON.parse(fs.readFileSync('./prefixo.json', 'utf8'))
  if (dadosPrefixo && dadosPrefixo.prefixo) prefix = dadosPrefixo.prefixo
} catch {
  prefix = '!'
}

 // 🎭 Modo Brincadeira (BN)
const bnPath = './bn.json'
if (!fs.existsSync(bnPath)) {
  fs.writeFileSync(bnPath, JSON.stringify({ ativo: false }, null, 2))
}
let bn = JSON.parse(fs.readFileSync(bnPath, 'utf8'))

if (body.startsWith(prefix + 'bn')) {
  const args = body.split(' ')[1]
  const sender = msg.key.participant || msg.key.remoteJid
  const groupMetadata = isGroup ? await sock.groupMetadata(from) : {}
  const admins = groupMetadata.participants
    ?.filter(p => p.admin === 'admin' || p.admin === 'superadmin')
    .map(p => p.id) || []
  const isAdmin = admins.includes(sender)

  if (!isAdmin) {
    await sock.sendMessage(from, { text: '🚫 Apenas administradores podem usar este comando.' })
    return
  }

  if (!args) {
    const status = bn.ativo ? '✅ ativado' : '🚫 desativado'
    await sock.sendMessage(from, { text: `🎭 O modo brincadeira está *${status}*!\nUse ${prefix}bn on para ativar ou ${prefix}bn off para desativar.` })
    return
  }

  if (args.toLowerCase() === 'on') {
    bn.ativo = true
    fs.writeFileSync(bnPath, JSON.stringify(bn, null, 2))
    await sock.sendMessage(from, { text: '✅ Modo brincadeira *ativado com sucesso!*' })
    return
  }

  if (args.toLowerCase() === 'off') {
    bn.ativo = false
    fs.writeFileSync(bnPath, JSON.stringify(bn, null, 2))
    await sock.sendMessage(from, { text: '🚫 Modo brincadeira *desativado com sucesso!*' })
    return
  }
}
 
 // 🖼️ Comando de foto de menu — dentro do index.js
if (body.startsWith(prefix + 'fotomenu')) {
  const sender = msg.key.participant || msg.key.remoteJid

  // 🔒 Apenas dono pode usar
  if (!msg.ehDono) {
    await sock.sendMessage(from, { text: '❌ Apenas o dono do bot pode usar este comando.' })
    return
  }

  // 🔹 Lê o nome informado ou o link
  const args = body.trim().split(' ')
  const input = args[1]?.toLowerCase()

  if (!input) {
    await sock.sendMessage(from, {
      text: `📸 Use o comando assim:\n\n➡️ *${prefix}fotomenu menu* (mandando uma imagem)\n➡️ *${prefix}fotomenu https://link.com/foto.jpg* (usando link direto)`
    })
    return
  }

  // 📂 Cria a pasta se não existir
  const pasta = './media'
  if (!fs.existsSync(pasta)) {
    fs.mkdirSync(pasta, { recursive: true })
    await sock.sendMessage(from, { text: '📁 Pasta "media" criada com sucesso pelo Souza-BOT!' })
  }

  // 🌐 Caso seja um link direto (http ou https)
  if (input.startsWith('http://') || input.startsWith('https://')) {
    try {
      const res = await fetch(input)
      if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
      const buffer = Buffer.from(await res.arrayBuffer())

      // Salva a imagem
      const caminhoPrincipal = path.join(pasta, 'menu.jpg')
      fs.writeFileSync(caminhoPrincipal, buffer)

      const menus = ['menuadm', 'menubrinks', 'menudono']
      for (const menu of menus) {
        const caminho = path.join(pasta, `${menu}.jpg`)
        fs.writeFileSync(caminho, buffer)
      }

      await sock.sendMessage(from, { text: '✅ Foto de menu baixada com sucesso via link!' })
      return
    } catch (err) {
      await sock.sendMessage(from, { text: `❌ Erro ao baixar imagem do link: ${err.message}` })
      return
    }
  }

  // 📷 Caso o usuário envie uma imagem
  let imagem = null
  if (msg.message?.imageMessage) {
    imagem = { message: msg.message }
  } else if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
    imagem = { message: msg.message.extendedTextMessage.contextInfo.quotedMessage }
  }

  if (!imagem) {
    await sock.sendMessage(from, {
      text: `⚠️ Envie uma imagem junto com o comando ${prefix}fotomenu <nome> ou responda a uma imagem.`
    })
    return
  }

  const buffer = await sock.downloadMediaMessage(imagem.message)

  const caminhoPrincipal = path.join(pasta, `${input}.jpg`)
  fs.writeFileSync(caminhoPrincipal, buffer)

  const menus = ['menuadm', 'menubrinks', 'menudono']
  for (const menu of menus) {
    const caminho = path.join(pasta, `${menu}.jpg`)
    fs.writeFileSync(caminho, buffer)
  }

  await sock.sendMessage(from, {
    text: `✅ Foto "${input}.jpg" salva com sucesso!\n🖼️ Aplicada aos menus ADM, Brinks e Dono.`
  })
  return
}
    
 
if (!body.startsWith(prefix)) return

  // Separa comando e argumentos
  const args = body.slice(prefix.length).trim().split(/ +/)
  const comando = args.shift().toLowerCase()
  
  // 🔎 Verifica se o comando existe em qualquer pasta do bot
function listarArquivosJs(dir) {
  let resultados = []
  if (!fs.existsSync(dir)) return resultados

  const arquivos = fs.readdirSync(dir)
  for (const arquivo of arquivos) {
    const caminho = path.join(dir, arquivo)
    const stat = fs.statSync(caminho)
    if (stat.isDirectory()) {
      resultados = resultados.concat(listarArquivosJs(caminho))
    } else if (arquivo.endsWith('.js')) {
      resultados.push(arquivo.replace('.js', '').toLowerCase())
    }
  }
  return resultados
}

// 📂 Busca todos os comandos existentes em todas as pastas
const comandosExistentes = listarArquivosJs(process.cwd())

// 🚫 Se o comando digitado não existir, envia aviso
if (!comandosExistentes.includes(comando)) {
  await sock.sendMessage(from, { 
    text: `❌ O comando *${comando}* não existe.\n📋 Use *${prefix}menu* para ver os comandos disponíveis.`
  })
  return
}
    
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

          
