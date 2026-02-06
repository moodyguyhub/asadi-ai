/**
 * Analytics utility — forwards custom events to Vercel Analytics.
 * Events appear in your Vercel dashboard under Analytics → Custom Events.
 */
import { track } from "@vercel/analytics";

type EventName =
  | "cta_book_call_30min"
  | "cta_quick_chat_15min"
  | "cta_view_work"
  | "cta_copy_email"
  | "cta_linkedin"
  | "cta_download_cv"
  | "cta_request_artifacts"
  | "atlas_opened"
  | "atlas_chip_clicked"
  | "atlas_voice_toggle"
  | "atlas_voice_query";

export function trackEvent(event: EventName, properties?: Record<string, string | number | boolean>) {
  // Dev logging
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", event, properties);
  }

  // Send to Vercel Analytics (custom events)
  try {
    track(event, properties);
  } catch {
    // Vercel Analytics not loaded yet — silently ignore
  }
}
