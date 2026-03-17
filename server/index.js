import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json());

app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/gerar-post", async (req, res) => {
  const { tema, formato, tom, especialidade, obs } = req.body;

  if (!tema || !formato || !tom) {
    return res
      .status(400)
      .json({ erro: "Campos obrigatórios: tema, formato, tom" });
  }

  try {
    const response = await client.chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free",
      messages: [
        {
          role: "user",
          content: `Você é especialista em marketing de conteúdo para psicólogos no Instagram.

Tema: ${tema}
Formato: ${formato}
Tom: ${tom}
${especialidade ? `Abordagem: ${especialidade}` : ""}
${obs ? `Observação: ${obs}` : ""}

Crie um post completo, pronto para postar. Use linguagem humanizada, emojis discretos e 5 a 8 hashtags no final. Máximo 2200 caracteres.`,
        },
      ],
    });

    const postGerado = response.choices[0].message.content;
    res.json({ post: postGerado });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao gerar post" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
