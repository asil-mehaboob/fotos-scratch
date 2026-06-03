/**
 * Sends a WhatsApp coupon notification via wacrm.
 * Called after a winning coupon is created in verify-otp.
 * Fire-and-forget — a failure here must never break the coupon response.
 */
export async function sendCouponNotification({
  phone,
  name,
  prizeDetail,
  couponCode,
}: {
  phone: string
  name: string
  prizeDetail: string
  couponCode: string
}): Promise<void> {
  const url = process.env.WACRM_WEBHOOK_URL
  const apiKey = process.env.WACRM_API_KEY

  if (!url || !apiKey) {
    console.warn('[wacrm] WACRM_WEBHOOK_URL or WACRM_API_KEY not set — skipping WhatsApp notification')
    return
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      phone,
      name,
      prize_detail: prizeDetail,
      coupon_code: couponCode,
      template_name: 'prize_confirmation',
      language: 'en',
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error(`[wacrm] webhook failed ${res.status}:`, text)
  }
}
