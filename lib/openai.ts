import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface EbookOptions {
  idioma: string;
  tema: string;
  paginas: number;
  publico: string;
  tom: string;
  estilo: string;
  imagens: boolean;
  graficos: boolean;
  capa: boolean;
  indice: boolean;
  referencias: boolean;
}

export interface EbookChapter {
  titulo: string;
  subtitulos: { titulo: string; conteudo: string }[];
}

export interface EbookContent {
  titulo: string;
  subtitulo: string;
  indice: string[];
  capitulos: EbookChapter[];
  conclusao: string;
  faq: { pergunta: string; resposta: string }[];
  cta: string;
  referencias: string[];
}

const SYSTEM_PROMPT = `Você é um escritor e editor profissional de eBooks.
Gere conteúdo estruturado, completo e coerente a partir do briefing do usuário.
Responda SEMPRE em JSON válido, sem markdown, seguindo exatamente o schema fornecido.`;

/**
 * Gera a estrutura completa do eBook em uma única chamada estruturada.
 * Em produção, isso pode ser dividido em múltiplas chamadas (índice → capítulos
 * em paralelo → conclusão/FAQ/CTA) para eBooks mais longos, evitando limites
 * de tokens de saída e permitindo streaming de progresso real para a UI.
 */
export async function generateEbookContent(
  prompt: string,
  options: EbookOptions
): Promise<EbookContent> {
  const schemaInstructions = `
Schema JSON esperado:
{
  "titulo": string,
  "subtitulo": string,
  "indice": string[],
  "capitulos": [
    { "titulo": string, "subtitulos": [ { "titulo": string, "conteudo": string } ] }
  ],
  "conclusao": string,
  "faq": [ { "pergunta": string, "resposta": string } ],
  "cta": string,
  "referencias": string[]
}`;

  const userPrompt = `
Briefing do usuário: """${prompt}"""

Configurações:
- Idioma: ${options.idioma}
- Tema visual: ${options.tema}
- Número de páginas alvo: ${options.paginas}
- Público-alvo: ${options.publico}
- Tom da escrita: ${options.tom}
- Estilo: ${options.estilo}
- Incluir referências: ${options.referencias ? "sim" : "não"}

Gere um eBook completo e coerente com capítulos, subtítulos desenvolvidos,
conclusão, FAQ (mínimo 5 perguntas) e uma chamada para ação (CTA) final.
${schemaInstructions}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("A IA não retornou conteúdo.");

  return JSON.parse(raw) as EbookContent;
}

/**
 * Gera a imagem de capa do eBook via DALL·E, com estilo derivado do tema escolhido.
 */
export async function generateCoverImage(titulo: string, tema: string): Promise<string> {
  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: `Capa de eBook profissional para o livro "${titulo}". Estilo visual: ${tema}. Tipografia elegante, composição minimalista, sem texto renderizado incorreto, alta qualidade editorial.`,
    size: "1024x1792",
    n: 1,
  });

  const url = image.data[0]?.url;
  if (!url) throw new Error("Falha ao gerar a capa.");
  return url;
}
