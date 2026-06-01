import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppOtp } from "@/lib/twilio";

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;
    console.log("[send-otp] received phone:", phone);

    if (!phone || !/^\+[1-9]\d{6,14}$/.test(phone)) {
      console.log("[send-otp] invalid phone format:", phone);
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    // Rate limit: 1 OTP per phone per 60 seconds
    const recent = await prisma.phoneOtp.findFirst({
      where: {
        phone,
        createdAt: { gte: new Date(Date.now() - 60_000) },
      },
    });

    if (recent) {
      console.log("[send-otp] rate limited:", phone);
      return NextResponse.json(
        { error: "Please wait before requesting another OTP" },
        { status: 429 }
      );
    }

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60_000);
    console.log("[send-otp] generated code:", code, "for phone:", phone);

    await prisma.phoneOtp.create({ data: { phone, code, expiresAt } });
    console.log("[send-otp] OTP saved to DB");

    await sendWhatsAppOtp(phone, code);
    console.log("[send-otp] WhatsApp message sent successfully");

    return NextResponse.json({ message: "OTP sent" });
  } catch (error) {
    console.error("[send-otp] error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
