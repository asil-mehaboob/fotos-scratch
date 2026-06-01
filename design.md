# Scratch Card Platform — Design Spec

> Verify this document before implementation continues.  
> Design language mirrors `fotos` (main app) and `fotos-landing`.

---

## Brand Tokens

| Token | Value | Usage |
|---|---|---|
| Primary | `#fa4f00` | CTAs, active states, accents |
| Primary dark | `#c93e00` | Button hover |
| Primary light | `#fff4f0` | Tints, backgrounds |
| Background | `#ffffff` | Page, cards |
| Surface | `#f9fafb` | Subtle off-white areas |
| Foreground | `#1f2937` | Body text |
| Muted text | `#6b7280` | Supporting copy |
| Border | `rgba(0,0,0,0.08)` | Card borders |
| Success | `#22c55e` | Checkmark, verified states |
| Gold start | `#f7d060` | Scratch card gradient |
| Gold end | `#c49010` | Scratch card gradient |

---

## Typography

**Font:** Manrope (Google Fonts, weights 300–800) — same as fotos-landing.

| Role | Size | Weight | Tracking |
|---|---|---|---|
| Label/mono | 10px | 500 | `0.15em` uppercase |
| Body sm | 14px | 400 | `−0.011em` |
| Body | 15px | 400 | `−0.011em` |
| Heading | 24px | 600 | `−0.03em` |
| Prize display | 30px | 600 | `−0.03em` |
| Prize emoji | 72px | — | — |

---

## Layout

- **Page background:** `#ffffff` with a very subtle radial tint `rgba(250,79,0,0.03)` at center
- **Card:** centered, `max-w-sm` (384px), full-height on mobile
- **Card styles:** `bg-white rounded-2xl p-8 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]`
- **Vertical centering:** `min-h-screen flex items-center justify-center`

---

## Components

### Input field
```
border border-gray-200 rounded-lg px-3 py-2.5 text-sm
focus: border-[#fa4f00] ring-2 ring-[#fa4f00]/20
placeholder: text-gray-400
```

### Country code select
```
Same styling as input, w-auto, shows flag emoji + dial code
```

### Primary button
```
bg-[#fa4f00] text-white rounded-full px-8 py-3.5 text-sm font-medium
hover: bg-[#c93e00]
disabled: opacity-50 cursor-not-allowed
transition-colors duration-150
```

### Ghost / text button
```
text-sm text-gray-400 hover:text-gray-600 transition-colors
```

### OTP input boxes (×6)
```
w-11 h-12 text-center text-lg font-semibold
border border-gray-200 rounded-lg
focus: border-[#fa4f00] ring-2 ring-[#fa4f00]/20
gap-2 between boxes
```

---

## Step-by-Step Flow

### Step 1 — Registration Form

```
┌────────────────────────────────────┐
│  EXCLUSIVE OFFER                   │  ← 10px mono, orange
│  Scratch & Win              🎁     │  ← 24px semibold
│  Enter your details to reveal...   │  ← 14px muted
│                                    │
│  Full Name                         │
│  ┌──────────────────────────────┐  │
│  │ John Doe                     │  │
│  └──────────────────────────────┘  │
│                                    │
│  Email                             │
│  ┌──────────────────────────────┐  │
│  │ john@example.com             │  │
│  └──────────────────────────────┘  │
│                                    │
│  WhatsApp Number                   │
│  ┌────────┐ ┌────────────────────┐ │
│  │🇮🇳 +91 │ │ 9876543210        │ │
│  └────────┘ └────────────────────┘ │
│                                    │
│  ╔══════════════════════════════╗  │
│  ║     Send OTP  →              ║  │  ← orange, full rounded
│  ╚══════════════════════════════╝  │
└────────────────────────────────────┘
```

**Animation on enter:** `blurIn` (opacity 0→1, blur 6px→0, translateY 20px→0, 0.7s ease)

---

### Step 2 — OTP Verification

```
┌────────────────────────────────────┐
│  ← Back                            │  ← ghost button
│                                    │
│  Verify your number                │  ← 24px semibold
│  OTP sent to +91 9876543210        │  ← 14px muted
│                                    │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐  │  ← 6 OTP boxes
│  │  │ │  │ │  │ │  │ │  │ │  │  │
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘  │
│                                    │
│  ╔══════════════════════════════╗  │
│  ║   Verify & Continue          ║  │
│  ╚══════════════════════════════╝  │
│                                    │
│         Resend in 58s              │  ← muted, countdown
└────────────────────────────────────┘
```

**Mock behavior:** Any 6 digits pass (no real API in frontend-only mode).

---

### Step 3 — Success (animated tick)

```
┌────────────────────────────────────┐
│                                    │
│         ╭──────────╮              │
│         │    ✓     │              │  ← SVG: circle draws, then checkmark
│         ╰──────────╯              │     green stroke-dashoffset animation
│                                    │
│         You're in!                 │  ← fades in at 0.8s
│    Get ready to scratch...         │  ← fades in at 1.0s
│                                    │
└────────────────────────────────────┘
```

**Animations:**
- Card: `slideUp` (translateY 120px→0, spring-like cubic-bezier, 0.6s)
- Circle: `stroke-dashoffset` 226→0 over 0.7s (starts at 0.2s)
- Checkmark: `stroke-dashoffset` 50→0 over 0.4s (starts at 0.8s)
- Text: `fadeIn` with delay

**Auto-advance:** After 2.5s → moves to Scratch step

---

### Step 4 — Scratch Card

```
┌────────────────────────────────────┐
│  YOUR CARD IS READY                │  ← 10px mono, orange
│  Scratch to reveal                 │  ← 24px semibold
│                                    │
│  ┌──────────────────────────────┐  │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │  ← gold canvas overlay
│  │ ░░░ ✦ Scratch here ✦ ░░░ │  │  ← scratched away by user
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  └──────────────────────────────┘  │  ← 320×200px
│                                    │
│     ☝️ Use finger or cursor        │  ← 12px muted hint
└────────────────────────────────────┘
```

**Scratch card details:**
- Canvas: 320×200, `cursor-crosshair`
- Overlay: gold gradient (`#f7d060` → `#c49010`) + crosshatch pattern
- Erase radius: 28px circles via `destination-out` composite
- Auto-complete: when >55% scratched, canvas fades out (0.6s)

**Hidden prize underneath:**
- Warm gradient background (`amber-50` to `orange-50`)
- Prize emoji (48px) + prize label (18px semibold)

---

### Step 5 — Prize Reveal

```
    🎊 🎉 confetti raining down 🎊 🎉

┌────────────────────────────────────┐
│                                    │
│              🎁                    │  ← 72px emoji, scale-in
│                                    │
│           YOU WON                  │  ← 10px mono, orange
│        ₹500 Voucher                │  ← 30px semibold
│   Congratulations, John! 🎉       │  ← 14px muted
│                                    │
│  ╔══════════════════════════════╗  │
│  ║    Claim Your Prize          ║  │  ← orange CTA
│  ╚══════════════════════════════╝  │
│                                    │
│           Play Again               │  ← ghost, resets flow
└────────────────────────────────────┘
```

**Animations:**
- Card content: `scaleIn` (scale 0.5→1, opacity 0→1, 0.5s spring)
- Confetti: 30 pieces, CSS `confettiFall` (translateY + rotate, 2–3.5s, staggered delays)
- Confetti colors: orange `#fa4f00`, gold `#f5c842`, green `#22c55e`, blue `#3b82f6`, pink `#ec4899`

---

## Prizes Config (`lib/prizes.ts`)

```ts
{ label: "₹500 Voucher",        emoji: "🎁",  probability: 0.05 }
{ label: "₹100 Voucher",        emoji: "💳",  probability: 0.15 }
{ label: "10% Off",             emoji: "🏷️",  probability: 0.30 }
{ label: "Free Shipping",       emoji: "🚚",  probability: 0.25 }
{ label: "Better Luck Next Time", emoji: "🍀", probability: 0.25 }
```

Prize is picked with weighted random on signup, stored in state for the session.

---

## Animation Keyframes Summary

| Name | Effect | Duration |
|---|---|---|
| `blurIn` | opacity+blur+translateY enter | 0.7s ease |
| `slideUp` | translateY 120px→0 | 0.6s cubic-bezier(.34,1.56,.64,1) |
| `fadeIn` | opacity 0→1 | 0.4s ease |
| `scaleIn` | scale(.5)→scale(1) + opacity | 0.5s cubic-bezier(.34,1.56,.64,1) |
| `drawCircle` | stroke-dashoffset 226→0 | 0.7s ease |
| `drawCheck` | stroke-dashoffset 50→0 | 0.4s ease |
| `confettiFall` | translateY(−20px)→translateY(110vh) + rotate | 2–3.5s ease |

---

## Mobile Behavior

- Card fills `w-full max-w-sm` — comfortable on 375px viewport
- OTP boxes: `w-10 h-11` (slightly smaller on very small screens)
- Scratch card: `width: 100%` on mobile, `height: auto` (canvas scales via CSS)
- Confetti: `fixed inset-0 pointer-events-none` — safe on all sizes
