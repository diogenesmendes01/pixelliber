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
      <div style="background:#0f0f10;min-height:100vh;padding:40px 20px;font-family:Arial,sans-serif;">
        <div style="max-width:520px;margin:0 auto;">
          <div style="text-align:center;margin-bottom:32px;">
            <span style="font-size:24px;font-weight:600;color:#f7f5f0;letter-spacing:-0.5px;">Pixel <span style="color:#c9a84c;">Liber</span></span>
          </div>
          <div style="background:#17171a;border-radius:16px;padding:40px;border:1px solid rgba(247,245,240,0.08);">
            <h2 style="color:#f7f5f0;font-size:22px;margin:0 0 12px;">Recuperação de senha</h2>
            <p style="color:#8f8c84;font-size:14px;line-height:1.6;margin:0 0 28px;">
              Você solicitou a redefinição de senha da sua conta Pixel Liber. Clique no botão abaixo para criar uma nova senha.
            </p>
            <a href="${resetLink}" style="display:block;text-align:center;background:#c9a84c;color:#0f0f10;padding:14px 24px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;">
              Redefinir senha
            </a>
            <p style="color:#8f8c84;font-size:12px;margin:24px 0 0;text-align:center;">
              Se você não solicitou isso, ignore este email. Sua senha permanece a mesma.<br/>
              Este link expira em 24 horas e pode ser usado apenas uma vez.
            </p>
          </div>
          <p style="text-align:center;color:#4a4843;font-size:11px;margin-top:24px;">
            © Pixel Liber · Sua biblioteca digital corporativa
          </p>
        </div>
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

export interface SendInviteEmailParams {
  to: string;
  invitedName: string;
  companyName: string;
  role: string;
  inviteLink: string;
}

export async function sendInviteEmail({
  to,
  invitedName,
  companyName,
  role,
  inviteLink,
}: SendInviteEmailParams): Promise<void> {
  const mailOptions = {
    from: process.env.SMTP_FROM ?? '"Pixel Liber" <noreply@pixelliber.com.br>',
    to,
    subject: `Você foi convidado para a Pixel Liber de ${companyName}`,
    html: `
      <div style="background:#0f0f10;min-height:100vh;padding:40px 20px;font-family:Arial,sans-serif;">
        <div style="max-width:520px;margin:0 auto;">
          <div style="text-align:center;margin-bottom:32px;">
            <span style="font-size:24px;font-weight:600;color:#f7f5f0;letter-spacing:-0.5px;">Pixel <span style="color:#c9a84c;">Liber</span></span>
          </div>
          <div style="background:#17171a;border-radius:16px;padding:40px;border:1px solid rgba(247,245,240,0.08);">
            <div style="text-transform:uppercase;letter-spacing:0.14em;font-size:11px;color:#c9a84c;margin-bottom:10px;">Convite</div>
            <h2 style="color:#f7f5f0;font-size:22px;margin:0 0 12px;">Olá, ${invitedName}</h2>
            <p style="color:#8f8c84;font-size:14px;line-height:1.6;margin:0 0 20px;">
              ${companyName} te convidou para acessar a biblioteca digital corporativa Pixel Liber como <strong style="color:#f7f5f0;">${role}</strong>. São 480+ e-books curados em finanças, marketing, mente e negócios — leitura online ou offline.
            </p>
            <a href="${inviteLink}" style="display:block;text-align:center;background:#c9a84c;color:#0f0f10;padding:14px 24px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;">
              Aceitar convite →
            </a>
            <p style="color:#8f8c84;font-size:12px;margin:24px 0 0;text-align:center;">
              Se você não esperava este convite, pode ignorar este e-mail.<br/>
              O link expira em 7 dias.
            </p>
          </div>
          <p style="text-align:center;color:#4a4843;font-size:11px;margin-top:24px;">
            © Pixel Liber · Sua biblioteca digital corporativa
          </p>
        </div>
      </div>
    `,
    text: `Convite para Pixel Liber de ${companyName}\n\nOlá ${invitedName},\n\n${companyName} te convidou como ${role}. Clique no link para aceitar e criar sua senha:\n\n${inviteLink}\n\nO link expira em 7 dias. Se não esperava este convite, ignore.`,
  };

  if (process.env.NODE_ENV !== "production") {
    console.log("\n=== [DEV] Employee Invite Email ===");
    console.log("To:", to);
    console.log("Name:", invitedName);
    console.log("Company:", companyName);
    console.log("Role:", role);
    console.log("Invite Link:", inviteLink);
    console.log("====================================\n");
    return;
  }

  await transporter.sendMail(mailOptions);
}