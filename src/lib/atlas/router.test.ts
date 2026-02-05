import { describe, expect, it } from "vitest";
import { isCapabilitiesQuery, isHardOutOfScopeQuery, pickTopics } from "./router";

describe("atlas router", () => {
  it("routes Truvesta summary", () => {
    expect(pickTopics("Summarize Truvesta in 3 bullets.")).toContain("products.truvesta");
  });

  it("routes dealing desk synonyms to Truvesta", () => {
    expect(pickTopics("Tell me about the dealing desk product.")).toContain("products.truvesta");
  });

  it("routes broker CRM to Ardura", () => {
    expect(pickTopics("Is the broker CRM called Ardura?")).toContain("products.ardura");
  });

  it("routes quick chat to availability", () => {
    expect(pickTopics("Quick chat this week?")).toContain("availability");
  });

  it("routes mixed compare to both products", () => {
    const topics = pickTopics("Compare Truvesta vs Ardura");
    expect(topics).toContain("products.truvesta");
    expect(topics).toContain("products.ardura");
  });

  it("detects capabilities queries", () => {
    expect(isCapabilitiesQuery("What are your sources?")).toBe(true);
    expect(isCapabilitiesQuery("What's your scope?")).toBe(true);
    expect(isCapabilitiesQuery("What can you answer?")).toBe(true);
  });

  it("detects hard out-of-scope requests", () => {
    expect(isHardOutOfScopeQuery("What is Mahmood's salary expectation?")).toBe(true);
    expect(isHardOutOfScopeQuery("Can you share private metrics / client names?")).toBe(true);
    expect(isHardOutOfScopeQuery("Write a full trading strategy for me.")).toBe(true);
  });
});
