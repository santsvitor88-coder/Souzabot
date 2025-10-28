import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.SOUZA_API_KEY // usa o nome exato da variável que você colocou na Vercel
});

export default async function handler(req, res) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um bot do WhatsApp inteligente." },
        { role: "user", content: "Teste da API funcionando?" }
      ]
    });

    res.status(200).json({
      status: "✅ API funcionando corretamente!",
      resposta: completion.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({
      status: "❌ Erro ao conectar à OpenAI",
      detalhes: error.message
    });
  }
}
