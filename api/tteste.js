import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // ou SOUZA_API_KEY, se for o nome que você usou
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
      erro: error.message
    });
  }
}
