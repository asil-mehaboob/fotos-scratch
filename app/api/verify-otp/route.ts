import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pickPrizeConfig, type CouponTier } from "@/lib/prizes-config";
import { sendCouponNotification } from "@/lib/wacrm";

function generateCouponCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg = Array.from({ length: 8 }, () => alphabet[Math.floor(Math.random() * 32)]).join("");
  return `FOTO${seg}`;
}

export async function POST(request: NextRequest) {
  try {
    const { phone, code, name, studioName } = await request.json();

    if (!phone || !code || !name || !studioName) {
      return NextResponse.json(
        { error: "Phone, code, name and studio name are required" },
        { status: 400 }
      );
    }

    // One coupon per phone number
    const existingEntry = await prisma.scratchEntry.findFirst({ where: { phone } });
    if (existingEntry) {
      return NextResponse.json(
        { error: "This phone number has already participated." },
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

    // Check JACKPOT cap (max 1 winner total)
    const jackpotCount = await prisma.coupon.count({ where: { tier: "JACKPOT" } });
    const excludeTiers: CouponTier[] = jackpotCount >= 1 ? ["JACKPOT"] : [];

    const prize = pickPrizeConfig(excludeTiers);

    // Create scratch entry
    const entry = await prisma.scratchEntry.create({
      data: {
        name,
        email: studioName,
        phone,
        prizeId: prize.id,
        prizeLabel: prize.label,
      },
    });

    // Create coupon for winning tiers
    let couponCode: string | null = null;
    if (prize.tier) {
      couponCode = generateCouponCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await prisma.coupon.create({
        data: {
          code: couponCode,
          tier: prize.tier as CouponTier,
          phoneNumber: phone,
          scratchEntryId: entry.id,
          expiresAt,
        },
      });

      // Notify the winner via WhatsApp — fire-and-forget so a wacrm
      // failure never blocks the coupon response reaching the user.
      void sendCouponNotification({ phone, name, prizeDetail: prize.label, couponCode });
    }

    return NextResponse.json({
      prizeId: prize.id,
      prizeLabel: prize.label,
      prizeTier: prize.tier,
      eligibilityNote: prize.eligibilityNote,
      couponCode,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
