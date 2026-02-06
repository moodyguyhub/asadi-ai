/**
 * Minimal analytics utility for tracking CTA clicks.
 * Replace with your preferred analytics provider (Plausible, Posthog, GA, etc.)
 */

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
  // Log to console in dev for verification
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", event, properties);
  }

  // Placeholder: send to your analytics provider
  // Example for Plausible:
  // if (typeof window !== "undefined" && window.plausible) {
  //   window.plausible(event, { props: properties });
  // }

  // Example for Posthog:
  // if (typeof window !== "undefined" && window.posthog) {
  //   window.posthog.capture(event, properties);
  // }
}
