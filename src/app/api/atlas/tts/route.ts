import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Server-side TTS using OpenAI's audio API.
 * Returns an MP3 audio stream for the given text.
 * Uses a fixed voice ("nova") for consistent character.
 */
export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "TTS not configured" }, { status: 503 });
  }

  let body: { text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const text = ((body?.text || "").toString().trim()).slice(0, 4096);
  if (!text) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        voice: "nova",       // Fixed female voice — consistent, clear, slightly warm
        input: text,
        response_format: "mp3",
        speed: 1.0,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI TTS error:", response.status, err);
      return NextResponse.json({ error: "TTS failed" }, { status: 502 });
    }

    // Stream the audio back to the client
    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json({ error: "TTS unavailable" }, { status: 503 });
  }
}
