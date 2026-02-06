import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type Body = {
  name?: string;
  email?: string;
  message?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = (req.body ?? {}) as Body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Validación básica
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) return res.status(400).json({ error: "Invalid email" });

  if (message.length > 5000) {
    return res.status(400).json({ error: "Message too long" });
  }

  try {
    await resend.emails.send({
      from: "Embedded <onboarding@resend.dev>", // ideal: tu dominio verificado en Resend
      to: [process.env.CONTACT_TO_EMAIL!], // tu correo destino
      replyTo: email,
      subject: `Nuevo mensaje de ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Email failed" });
  }
}
