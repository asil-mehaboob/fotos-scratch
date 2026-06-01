import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pickPrizeConfig } from "@/lib/prizes-config";

export async function POST(request: NextRequest) {
  try {
    const { phone, code, name, email } = await request.json();

    if (!phone || !code || !name || !email) {
      return NextResponse.json(
        { error: "Phone, code, name and email are required" },
        { status: 400 }
      );
    }

    // Verify OTP
    const otp = await prisma.phoneOtp.findFirst({
      where: {
        phone,
        code,
        used: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await prisma.phoneOtp.update({
      where: { id: otp.id },
      data: { used: true },
    });

    // Pick prize server-side and save entry
    const prize = pickPrizeConfig();

    await prisma.scratchEntry.create({
      data: {
        name,
        email,
        phone,
        prizeId: prize.id,
        prizeLabel: prize.label,
      },
    });

    return NextResponse.json({ prizeId: prize.id, prizeLabel: prize.label });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
