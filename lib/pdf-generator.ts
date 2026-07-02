import {
  Document,
  Page,
  Text,
  View,
  Image,
  Link,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { EbookContent } from "./openai";

// Tipografia editorial: serif para títulos, sans para corpo de texto —
// mesma lógica de hierarquia usada na interface (Fraunces/Inter).
Font.register({
  family: "Fraunces",
  fonts: [
    { src: "https://fonts.gstatic.com/s/fraunces/v31/6NUM8FafI9CXVUpX6BR8yqW6.ttf" },
  ],
});
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.ttf" },
  ],
});

const GOLD = "#C9A227";
const INK = "#0A0906";

const styles = StyleSheet.create({
  cover: {
    backgroundColor: INK,
    padding: 0,
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  coverOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 48,
  },
  coverTitle: {
    fontFamily: "Fraunces",
    fontSize: 32,
    color: "#F5F1E6",
    marginBottom: 8,
  },
  coverSubtitle: {
    fontFamily: "Inter",
    fontSize: 14,
    color: GOLD,
  },
  page: {
    paddingTop: 56,
    paddingBottom: 64,
    paddingHorizontal: 56, // margens profissionais
    fontFamily: "Inter",
    fontSize: 11,
    color: "#1B1810",
    lineHeight: 1.6,
  },
  header: {
    position: "absolute",
    top: 24,
    left: 56,
    right: 56,
    fontSize: 9,
    color: "#9C9483",
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    color: "#9C9483",
    borderTopWidth: 0.5,
    borderTopColor: "#D8D2C0",
    paddingTop: 8,
  },
  chapterTitle: {
    fontFamily: "Fraunces",
    fontSize: 22,
    color: INK,
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: GOLD,
    paddingBottom: 8,
  },
  subTitle: {
    fontFamily: "Fraunces",
    fontSize: 14,
    color: INK,
    marginTop: 16,
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 10,
    textAlign: "justify",
  },
  tocTitle: {
    fontFamily: "Fraunces",
    fontSize: 26,
    marginBottom: 24,
  },
  tocItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 12,
    marginBottom: 10,
    color: "#1B1810",
  },
  faqQuestion: {
    fontFamily: "Fraunces",
    fontSize: 13,
    marginTop: 12,
    color: INK,
  },
});

function Header({ titulo }: { titulo: string }) {
  return (
    <Text style={styles.header} fixed>
      {titulo}
    </Text>
  );
}

function Footer() {
  return (
    <View style={styles.footer} fixed>
      <Text>BookForge AI</Text>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}

/**
 * Monta o documento PDF completo: capa, índice, capítulos, conclusão, FAQ,
 * CTA e referências — com cabeçalho, rodapé e numeração em todas as páginas
 * de conteúdo (a capa fica isenta, como em um livro editorial real).
 */
export function EbookPDF({
  content,
  coverImageUrl,
}: {
  content: EbookContent;
  coverImageUrl?: string;
}) {
  return (
    <Document title={content.titulo} author="BookForge AI">
      {/* CAPA */}
      <Page size="A4" style={styles.cover}>
        {coverImageUrl && <Image src={coverImageUrl} style={styles.coverImage} />}
        <View style={styles.coverOverlay}>
          <Text style={styles.coverTitle}>{content.titulo}</Text>
          <Text style={styles.coverSubtitle}>{content.subtitulo}</Text>
        </View>
      </Page>

      {/* ÍNDICE */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.tocTitle}>Índice</Text>
        {content.indice.map((item, i) => (
          <View key={i} style={styles.tocItem}>
            <Text>{item}</Text>
            <Text>{String(i + 3).padStart(2, "0")}</Text>
          </View>
        ))}
        <Footer />
      </Page>

      {/* CAPÍTULOS */}
      {content.capitulos.map((cap, i) => (
        <Page key={i} size="A4" style={styles.page} wrap>
          <Header titulo={content.titulo} />
          <Text style={styles.chapterTitle}>{cap.titulo}</Text>
          {cap.subtitulos.map((sub, j) => (
            <View key={j}>
              <Text style={styles.subTitle}>{sub.titulo}</Text>
              <Text style={styles.paragraph}>{sub.conteudo}</Text>
            </View>
          ))}
          <Footer />
        </Page>
      ))}

      {/* CONCLUSÃO + FAQ + CTA */}
      <Page size="A4" style={styles.page} wrap>
        <Header titulo={content.titulo} />
        <Text style={styles.chapterTitle}>Conclusão</Text>
        <Text style={styles.paragraph}>{content.conclusao}</Text>

        <Text style={[styles.chapterTitle, { marginTop: 24 }]}>Perguntas frequentes</Text>
        {content.faq.map((f, i) => (
          <View key={i}>
            <Text style={styles.faqQuestion}>{f.pergunta}</Text>
            <Text style={styles.paragraph}>{f.resposta}</Text>
          </View>
        ))}

        <View style={{ marginTop: 24, padding: 16, backgroundColor: "#F1E3B0" }}>
          <Text style={{ fontFamily: "Fraunces", fontSize: 13 }}>{content.cta}</Text>
        </View>

        {content.referencias.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <Text style={styles.subTitle}>Referências</Text>
            {content.referencias.map((ref, i) => (
              <Link key={i} src={ref} style={{ fontSize: 9, color: GOLD, marginBottom: 4 }}>
                <Text>{ref}</Text>
              </Link>
            ))}
          </View>
        )}
        <Footer />
      </Page>
    </Document>
  );
}

export async function renderEbookToPdfBuffer(
  content: EbookContent,
  coverImageUrl?: string
): Promise<Buffer> {
  return renderToBuffer(EbookPDF({ content, coverImageUrl }));
}
