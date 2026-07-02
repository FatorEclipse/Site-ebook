import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await transporter.sendMail({
    from: '"BookForge AI" <no-reply@bookforge.ai>',
    to,
    subject: "Redefinir sua senha — BookForge AI",
    html: `
      <div style="font-family: sans-serif; background:#0A0906; color:#F5F1E6; padding:32px; border-radius:12px;">
        <h2 style="color:#C9A227;">Redefinir senha</h2>
        <p>Recebemos uma solicitação para redefinir sua senha no BookForge AI.</p>
        <p><a href="${resetUrl}" style="color:#0A0906; background:#C9A227; padding:12px 24px; border-radius:999px; text-decoration:none; display:inline-block;">Criar nova senha</a></p>
        <p style="color:#9C9483; font-size:12px;">Se você não solicitou isso, ignore este email. O link expira em 1 hora.</p>
      </div>
    `,
  });
}
