import ytdl from "ytdl-core"
import yts from "yt-search"

export default async function handler(req, res) {
  const { q } = req.query
  const key = req.headers.authorization

  // 🔐 Proteção com sua chave
  if (key !== "botdosouza") {
    return res.status(403).json({ error: "❌ Chave inválida ou ausente" })
  }

  // 🧐 Verifica se foi enviado o nome da música
  if (!q) {
    return res.status(400).json({ error: "❌ Você precisa informar o nome da música!" })
  }

  try {
    // 🔍 Busca no YouTube
    const search = await yts(q)
    const video = search.videos[0]
    if (!video) return res.status(404).json({ error: "❌ Nenhum vídeo encontrado." })

    // 🎵 Gera o link de áudio
    const info = await ytdl.getInfo(video.url)
    const format = ytdl.chooseFormat(info.formats, { filter: "audioonly" })

    res.status(200).json({
      sucesso: true,
      titulo: video.title,
      url: format.url,
      canal: video.author.name,
      duracao: video.timestamp,
      thumbnail: video.thumbnail
    })
  } catch (err) {
    console.error("Erro na rota /api/play:", err)
    res.status(500).json({ error: "⚠️ Erro interno ao processar a música." })
  }
      }
