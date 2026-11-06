import { describe, it, expect, beforeAll } from "vitest";
import {
  detectLanguage,
  extractNeedsDeterministically,
  AIAnalysisSchema,
} from "../lib/ai/adaptionClient";
import { findOptimalMatch, calculateDistanceKm } from "../lib/matching/engine";
import { resetAndSeedDatabase } from "../lib/seed/seed";

beforeAll(async () => {
  // Ensure baseline seed state is active before running tests
  await resetAndSeedDatabase();
});

describe("Module C: AI Multilingual Extraction & Schema Validation", () => {
  it("accurately detects Bengali, Banglish, and English inputs", () => {
    expect(detectLanguage("আমার বাবা হাঁটতে পারেন না। ডাকোপ বাজার।")).toBe("bn");
    expect(detectLanguage("Amar babar wheelchair lagbe, pani barche dacope.")).toBe("banglish");
    expect(detectLanguage("We need step-free evacuation transport for 4 people.")).toBe("en");
  });

  it("extracts wheelchair needs and Bengali group numbers correctly", () => {
    const text = "আমার বাবা হাঁটতে পারেন না। আমরা ৩ জন আছি। হুইলচেয়ার নিয়ে যেতে পারে এমন গাড়ি লাগবে।";
    const result = extractNeedsDeterministically(text);

    expect(result.language).toBe("bn");
    expect(result.group_size).toBe(3);
    expect(result.support_needs).toContain("wheelchair_transport");
    expect(result.support_needs).toContain("step_free_access");
    expect(result.is_fallback).toBe(true);
  });

  it("extracts deaf and visual communication requirements from Banglish text", () => {
    const text = "Ami deaf shunte paina. Phone call korben na, SMS ba visual team pathan.";
    const result = extractNeedsDeterministically(text);

    expect(result.language).toBe("banglish");
    expect(result.support_needs).toContain("visual_communication");
  });

  it("extracts life-support power requirements for oxygen patients", () => {
    const text = "Patient is on home oxygen concentrator and ventilator. Power went out, need generator shelter.";
    const result = extractNeedsDeterministically(text);

    expect(result.language).toBe("en");
    expect(result.support_needs).toContain("power_equipment");
    expect(result.support_needs).toContain("step_free_access");
  });

  it("flags missing location when no landmark or address is provided", () => {
    const text = "Pani ghore dhukse khub emergency help dorkar!";
    const result = extractNeedsDeterministically(text);

    expect(result.missing_information).toContain("approximate_location");
    expect(result.requires_human_review).toBe(true);
  });

  it("validates structured outputs against strict Zod schema", () => {
    const validPayload = {
      language: "bn",
      group_size: 4,
      support_needs: ["wheelchair_transport", "step_free_access"],
      requested_resources: ["accessible_vehicle"],
      location: "Dacope Bazar",
      urgency: "urgent",
      missing_information: [],
      requires_human_review: true,
      confidence_score: 0.95,
      extracted_notes: "Validated test payload",
      is_fallback: true,
      model_name: "simulated-rule-engine-v1",
    };

    expect(() => AIAnalysisSchema.parse(validPayload)).not.toThrow();

    const invalidPayload = {
      ...validPayload,
      group_size: -2, // Invalid
    };
    expect(() => AIAnalysisSchema.parse(invalidPayload)).toThrow();
  });
});

describe("Module D: Intelligent Resource Matching Engine & Hard Constraints", () => {
  it("calculates accurate Haversine distances", () => {
    // Dacope coordinates: ~22.571°N, 89.512°E to Chalna coordinates: ~22.585°N, 89.525°E
    const dist = calculateDistanceKm(22.571, 89.512, 22.585, 89.525);
    expect(dist).toBeGreaterThan(1.5);
    expect(dist).toBeLessThan(3.0);
  });

  it("HARD CONSTRAINT 1: Wheelchair user must receive accessible vehicle with ramp/lift", async () => {
    const match = await findOptimalMatch({
      requestId: "TEST-01",
      groupSize: 2,
      latitude: 22.574,
      longitude: 89.514,
      supportNeeds: ["wheelchair_transport", "step_free_access"],
      urgency: "urgent",
    });

    expect(match.vehicle).not.toBeNull();
    expect(match.vehicle?.wheelchair_accessible).toBe(true);
    expect(match.vehicle?.type).toBe("accessible_van");
    expect(match.satisfied_needs).toContain("wheelchair_transport");
  });

  it("HARD CONSTRAINT 2: Mobility user must NOT be routed to shelter with stairs and no ramp", async () => {
    // Even if Bajua shelter (RES-SHL-03) is nearby, it lacks a ramp and must be rejected
    const match = await findOptimalMatch({
      requestId: "TEST-02",
      groupSize: 2,
      latitude: 22.553,
      longitude: 89.498, // Close to Bajua
      supportNeeds: ["step_free_access"],
      urgency: "urgent",
    });

    expect(match.shelter).not.toBeNull();
    expect(match.shelter?.ramp_available || match.shelter?.step_free_access).toBe(true);
    expect(match.shelter?.id).not.toBe("RES-SHL-03"); // Bajua lacks ramp, must not match
  });

  it("HARD CONSTRAINT 3: Oxygen/ventilator patient must be routed to shelter with generator backup", async () => {
    const match = await findOptimalMatch({
      requestId: "TEST-03",
      groupSize: 3,
      latitude: 22.576,
      longitude: 89.509,
      supportNeeds: ["power_equipment", "step_free_access"],
      urgency: "critical",
    });

    expect(match.shelter).not.toBeNull();
    expect(match.shelter?.power_backup).toBe(true);
    expect(match.satisfied_needs).toContain("power_equipment");
  });

  it("HARD CONSTRAINT 4: Unverified resources must NEVER be assigned in verified safe pool", async () => {
    const match = await findOptimalMatch({
      requestId: "TEST-04",
      groupSize: 12,
      latitude: 22.561,
      longitude: 89.535, // Right next to unverified trawler RES-VEH-04
      supportNeeds: [],
      urgency: "routine",
    });

    // Even though RES-VEH-04 has 15 seats, it is UNVERIFIED and must be excluded!
    if (match.vehicle) {
      expect(match.vehicle.id).not.toBe("RES-VEH-04");
      expect(match.vehicle.verification_status).toBe("verified");
    }
  });

  it("HARD CONSTRAINT 5: Deaf resident is matched to volunteer with sign language or visual comms skills", async () => {
    const match = await findOptimalMatch({
      requestId: "TEST-05",
      groupSize: 1,
      latitude: 22.581,
      longitude: 89.521,
      supportNeeds: ["sign_language", "visual_communication"],
      urgency: "urgent",
    });

    expect(match.responder).not.toBeNull();
    expect(match.responder?.skills).toContain("sign_language");
    expect(match.responder?.id).toBe("RES-RSP-02"); // Dacope Inclusive Youth Team
  });
});
