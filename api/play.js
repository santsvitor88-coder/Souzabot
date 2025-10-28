import ytdl from "ytdl-core";
import ytSearch from "yt-search";

export default async function handler(req, res) {
  try {
    const { query, apikey } = req.query;

    // 🔑 Verificação da chave
    const keyValida = "Souzapzzy";
    if (apikey !== keyValida)
      return res.status(401).json({ status: false, msg: "❌ Chave inválida!" });

    if (!query)
      return res.status(400).json({ status: false, msg: "❌ Nenhuma música informada." });

    // 🎯 Trata links curtos e busca por nome
    let videoUrl;
    if (query.includes("youtube.com") || query.includes("youtu.be")) {
      videoUrl = query
        .replace("shorts/", "watch?v=")
        .replace("youtu.be/", "youtube.com/watch?v=");
    } else {
      const result = await ytSearch(query);
      if (!result.videos.length)
        return res.status(404).json({ status: false, msg: "❌ Nenhum vídeo encontrado." });
      videoUrl = result.videos[0].url;
    }

    // 📜 Obtém informações do vídeo
    const info = await ytdl.getInfo(videoUrl);
    const title = info.videoDetails.title;

    // 🎵 Pega link direto do áudio
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });

    if (!audioFormat || !audioFormat.url)
      return res.status(500).json({ status: false, msg: "❌ Falha ao obter áudio." });

    return res.status(200).json({
      status: true,
      title,
      audio: audioFormat.url,
      url: videoUrl,
    });
  } catch (e) {
    console.error("Erro na API:", e);
    return res.status(500).json({
      status: false,
      msg: "⚠️ Erro interno no servidor.",
      erro: e.message,
    });
  }
}
