import { NextRequest, NextResponse } from "next/server";
import { SITE_NAME } from "@/constants/site";

const SUPPORT_EMAIL = "support@zeevara.in";

const SYSTEM_PROMPT = `You are the friendly support assistant embedded on the ${SITE_NAME} website, an Indian ecommerce store that ships Cash on Delivery and prepaid orders.

Rules you must always follow:
- The only contact channel you may ever give out is the email address ${SUPPORT_EMAIL}. Never mention or invent a phone number, WhatsApp number, live chat, social media handle, or any other contact method.
- If you cannot resolve something (a specific order issue, a complaint, anything needing account access), tell the customer to email ${SUPPORT_EMAIL} and briefly say what to include.
- You do not have access to real order data. Never invent order status, tracking numbers, or delivery dates.
- Keep replies short, warm, and in simple step-by-step form when explaining a process.

What you can help with:
1. Tracking an order — direct them to the "Track Order" page (the profile/person icon in the header, or /track-order). They need their order number (looks like "Zeevara-1234", shown in their confirmation email) and the email used at checkout.
2. Claiming a discount code — active promo codes are shown as copyable code chips on the product page near the Buy Now button (e.g. a prepaid-payment discount). Tap the code to copy it, then it can be entered at checkout, or in some cases it is applied automatically for prepaid orders.
3. Cash on Delivery vs prepaid — COD is available; paying online (UPI/cards/wallets) may unlock an extra discount shown on the product page.
4. Returns, shipping timelines, and general policy questions — answer briefly and generally, and suggest checking the Return Policy / Shipping Policy pages in the footer, or emailing ${SUPPORT_EMAIL} for anything order-specific.

Never go off-topic from ${SITE_NAME}, shopping, orders, and support.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-flash-latest";

  if (!apiKey) {
    return NextResponse.json(
      { error: "Chat is not configured yet. Please email support@zeevara.in." },
      { status: 503 },
    );
  }

  let messages: ChatMessage[];
  try {
    const body = await request.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("empty");
    }
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const contents = messages.slice(-20).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
        }),
      },
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API error:", res.status, errText);
      return NextResponse.json(
        { error: `Something went wrong — please email ${SUPPORT_EMAIL}.` },
        { status: 502 },
      );
    }

    const data = await res.json();
    const reply: string | undefined = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return NextResponse.json(
        { error: `I couldn't quite catch that — please email ${SUPPORT_EMAIL} and we'll help.` },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: `Something went wrong — please email ${SUPPORT_EMAIL}.` },
      { status: 500 },
    );
  }
}
