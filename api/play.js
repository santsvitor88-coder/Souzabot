export default async function handler(req, res) {
  try {
    const { apikey, query } = req.query;

    // 🔒 Validação da chave
    if (apikey !== 'Souzapzzy') {
      return res.status(403).json({ error: '❌ Chave inválida ou ausente' });
    }

    if (!query) {
      return res.status(400).json({ error: '❌ Informe o nome da música ou link!' });
    }

    // 🔍 Usa API pública de música (sem precisar de ytdl-core)
    const url = `https://api.akuari.my.id/downloader/youtube2?link=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.audio) {
      return res.status(404).json({ error: '⚠️ Música não encontrada' });
    }

    // ✅ Retorna dados prontos para o bot
    return res.status(200).json({
      status: true,
      title: data.title,
      thumbnail: data.thumbnail,
      audio: data.audio,
      by: 'SouzaBOT'
    });

  } catch (err) {
    console.error('Erro no endpoint /api/play:', err);
    return res.status(500).json({ error: '💥 Erro interno na API' });
  }
}
