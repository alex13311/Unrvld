import nodemailer from "nodemailer";

// Diagnostic endpoint: open /api/lead-test in a browser to verify that the
// live site can actually send the lead email. Returns the result as JSON.
export async function GET() {
  const pass = process.env.GMAIL_APP_PASSWORD;
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;

  if (!pass) {
    return Response.json({
      ok: false,
      reason: "GMAIL_APP_PASSWORD is not set on this Vercel project",
      hasAnthropicKey,
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: "unrvldllc@gmail.com", pass },
    });
    const info = await transporter.sendMail({
      from: "UNRVLD Site <unrvldllc@gmail.com>",
      to: "unrvldllc@gmail.com",
      subject: "UNRVLD chat email test",
      text: "If you received this, chat lead emails are working from the live site.",
    });
    return Response.json({
      ok: true,
      sent: true,
      smtpResponse: info.response,
      messageId: info.messageId,
      hasAnthropicKey,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ ok: false, error: message, hasAnthropicKey });
  }
}
