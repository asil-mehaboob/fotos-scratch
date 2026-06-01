import twilio from "twilio";

let _client: ReturnType<typeof twilio> | null = null;

function getClient() {
  if (!_client) {
    _client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );
  }
  return _client;
}

export async function sendWhatsAppOtp(toPhone: string, code: string): Promise<void> {
  const from = `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`;
  const to   = `whatsapp:${toPhone}`;
  const contentSid = process.env.TWILIO_WHATSAPP_OTP_TEMPLATE_SID;

  let msg;
  if (contentSid) {
    msg = await getClient().messages.create({
      from,
      to,
      contentSid,
      contentVariables: JSON.stringify({ "1": code }),
    });
  } else {
    msg = await getClient().messages.create({
      from,
      to,
      body: `${code} is your verification code. Do not share this with anyone.`,
    });
  }

  console.log("[twilio] OTP sent — SID:", msg.sid, "status:", msg.status);
}
