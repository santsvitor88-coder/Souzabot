export default function handler(req, res) {
  const key = req.headers.authorization
  if (key !== process.env.API_KEY) {
    return res.status(403).json({ error: '❌ Chave inválida ou ausente' })
  }

  res.status(200).json({ sucesso: true, mensagem: "🔓 A chave API_KEY está funcionando!" })
}
