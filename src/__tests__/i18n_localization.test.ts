import { describe, it, expect } from "vitest";
import {
  translations,
  toBengaliNumber,
  formatNumber,
  translateStatus,
  translateUrgency,
  translateNeed,
  translateResourceType,
  translateVerification,
} from "../lib/i18n";

describe("SHONGJOG V4.2 Localization & Translation Matrix", () => {
  it("A. Key parity between English and Bengali dictionaries", () => {
    const enKeys = Object.keys(translations.en).sort();
    const bnKeys = Object.keys(translations.bn).sort();

    expect(enKeys.length).toBeGreaterThanOrEqual(150);
    expect(bnKeys.length).toBeGreaterThanOrEqual(150);

    const missingInBn = enKeys.filter((k) => !(k in translations.bn));
    const missingInEn = bnKeys.filter((k) => !(k in translations.en));

    expect(missingInBn).toEqual([]);
    expect(missingInEn).toEqual([]);
  });

  it("B. Bengali numeral formatting with ASCII and mixed strings", () => {
    expect(toBengaliNumber(0)).toBe("০");
    expect(toBengaliNumber(1234567890)).toBe("১২৩৪৫৬৭৮৯০");
    expect(toBengaliNumber("SHG-2026-0801")).toBe("SHG-২০২৬-০৮০১");
    expect(toBengaliNumber("4.2m")).toBe("৪.২m");
    expect(toBengaliNumber("1:12")).toBe("১:১২");

    expect(formatNumber(42, "en")).toBe("42");
    expect(formatNumber(42, "bn")).toBe("৪২");
    expect(formatNumber("350 places", "bn")).toBe("৩৫০ places");
  });

  it("C. Status translation accuracy in both EN and BN", () => {
    const statuses = [
      "intake_received",
      "ai_parsed",
      "assigned",
      "en_route",
      "arrived",
      "completed",
      "cancelled",
    ];

    statuses.forEach((status) => {
      const en = translateStatus(status, "en");
      const bn = translateStatus(status, "bn");
      expect(en).toBeTruthy();
      expect(bn).toBeTruthy();
      expect(en).not.toBe(bn);
    });
  });

  it("D. Urgency translation mapping", () => {
    expect(translateUrgency("critical", "en")).toContain("Critical");
    expect(translateUrgency("critical", "bn")).toContain("জীবনঝুঁকি");
    expect(translateUrgency("urgent", "bn")).toContain("উচ্চ অগ্রাধিকার");
    expect(translateUrgency("routine", "bn")).toContain("নিয়মিত");
  });

  it("E. Functional accommodation needs translation", () => {
    const needs = [
      "wheelchair_transport",
      "step_free_access",
      "guided_assistance",
      "visual_communication",
      "sign_language",
      "power_equipment",
      "caregiver_accompaniment",
      "older_adult_assistance",
      "cognitive_support",
    ];

    needs.forEach((need) => {
      const en = translateNeed(need, "en");
      const bn = translateNeed(need, "bn");
      expect(en).toBeTruthy();
      expect(bn).toBeTruthy();
      expect(en).not.toBe(bn);
    });
  });

  it("F. Asset types and verification tiers translation", () => {
    expect(translateResourceType("shelter", "bn")).toBe("সাইক্লোন শেল্টার");
    expect(translateResourceType("vehicle", "bn")).toBe("স্থানান্তর যান");
    expect(translateResourceType("responder", "bn")).toBe("রেসপন্ডার ইউনিট");

    expect(translateVerification("verified", "bn")).toBe("যাচাইকৃত নিরাপদ");
    expect(translateVerification("unverified", "bn")).toBe("যাচাইবিহীন");
  });
});
