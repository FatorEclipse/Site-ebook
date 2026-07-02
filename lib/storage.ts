import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Compatível com Cloudflare R2, AWS S3 ou qualquer storage S3-compatible.
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
  },
});

/**
 * Envia um arquivo (ex.: PDF gerado) para o bucket e retorna a URL pública.
 */
export async function put(key: string, body: Buffer, contentType: string): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.STORAGE_BUCKET!,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: "public-read",
    })
  );
  return `${process.env.STORAGE_PUBLIC_URL}/${key}`;
}
