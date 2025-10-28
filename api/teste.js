export default async function handler(req, res) {
  try {
    const apiKey = process.env.SOUZA_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: "❌ Chave ausente no ambiente da Vercel." });
    }

    // Teste simples pra confirmar a conexão
    return res.status(200).json({
      status: "✅ API funcionando corretamente!",
      chaveDetectada: apiKey.substring(0, 10) + "...",
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor", details: error.message });
  }
}
