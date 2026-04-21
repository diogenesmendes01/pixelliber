import type { Transporter } from "nodemailer";

/**
 * In development, we just log the email to console.
 * In production, configure SMTP credentials via environment variables.
 */
function createMailTransporter(): Transporter {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodemailer = require("nodemailer") as typeof import("nodemailer");

  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT ?? 587) === 465,
      auth: {
        user: process.env.SMTP_USER ?? "",
        pass: process.env.SMTP_PASS ?? "",
      },
    });
  }
  // Development: log to console
  return nodemailer.createTransport({ jsonTransport: true });
}

const transporter = createMailTransporter();

export interface SendResetEmailParams {
  to: string;
  resetLink: string;
}

export async function sendResetEmail({ to, resetLink }: SendResetEmailParams): Promise<void> {
  const mailOptions = {
    from: process.env.SMTP_FROM ?? '"Pixel Liber" <noreply@pixelliber.com.br>',
    to,
    subject: "Recuperação de Senha — Pixel Liber",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Recuperação de Senha</h2>
        <p>Você solicitou a recuperação de senha da sua conta Pixel Liber.</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <p>
          <a href="${resetLink}" style="display: inline-block; background: #6c63ff; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
            Redefinir Senha
          </a>
        </p>
        <p>Se você não solicitou essa recuperação, ignore este email.</p>
        <p style="color: #888; font-size: 12px;">Este link expira em 24 horas e pode ser usado apenas uma vez.</p>
      </div>
    `,
    text: `Recuperação de Senha — Pixel Liber\n\nClique no link para redefinir sua senha: ${resetLink}\n\nSe você não solicitou, ignore este email. Este link expira em 24h.`,
  };

  if (process.env.NODE_ENV !== "production") {
    console.log("\n=== [DEV] Password Reset Email ===");
    console.log("To:", to);
    console.log("Reset Link:", resetLink);
    console.log("===================================\n");
    return;
  }

  await transporter.sendMail(mailOptions);
}