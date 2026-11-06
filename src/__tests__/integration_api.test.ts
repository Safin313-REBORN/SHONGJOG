import { describe, it, expect, beforeAll } from "vitest";
import { resetAndSeedDatabase } from "../lib/seed/seed";
import { prisma } from "../lib/prisma";
import { POST as createRequestPost } from "../app/api/requests/route";
import { GET as getRequestById } from "../app/api/requests/[id]/route";
import { GET as getMatching } from "../app/api/matching/[requestId]/route";
import { POST as approveAssignmentPost } from "../app/api/assignments/route";
import { POST as updateStatusPost } from "../app/api/assignments/[id]/status/route";
import { NextRequest } from "next/server";

beforeAll(async () => {
  await resetAndSeedDatabase();
});

describe("End-to-End API Integration & Lifecycle State Machine", () => {
  let createdCaseId = "";
  let createdAssignmentId = "";

  it("1. Citizen submits an assistance request with Bengali input and consent", async () => {
    const payload = {
      rawDescription: "আমার মায়ের হাঁটুতে তীব্র সমস্যা, হুইলচেয়ার ব্যবহার করেন। ডাকোপ চালনা বাজার সংলগ্ন।",
      approximateLocation: "Dacope Chalna Bazar",
      groupSize: 2,
      statedNeeds: ["wheelchair_transport", "step_free_access"],
      contactName: "Tariqul",
      contactPhone: "+880 1811-223344",
      consentGiven: true,
      latitude: 22.572,
      longitude: 89.513,
    };

    const req = new NextRequest("http://localhost:3000/api/requests", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const res = await createRequestPost(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.case_reference).toBeDefined();
    expect(json.case_reference).toMatch(/^SHG-2026-\d{4}$/);
    expect(json.ai_analysis.support_needs).toContain("wheelchair_transport");

    createdCaseId = json.case_reference;
  });

  it("2. Retrieves full case details including audit timeline", async () => {
    const req = new NextRequest(`http://localhost:3000/api/requests/${createdCaseId}`);
    const res = await getRequestById(req, {
      params: Promise.resolve({ id: createdCaseId }),
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.id).toBe(createdCaseId);
    expect(json.data.timelineEvents.length).toBeGreaterThanOrEqual(2); // Created + AI Analyzed
  });

  it("3. Matching engine generates explainable safe recommendation for the case", async () => {
    const req = new NextRequest(`http://localhost:3000/api/matching/${createdCaseId}`);
    const res = await getMatching(req, {
      params: Promise.resolve({ requestId: createdCaseId }),
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.recommendation.feasibility).toBe("verified_safe_match");
    expect(json.recommendation.vehicle.wheelchair_accessible).toBe(true);
    expect(json.recommendation.shelter.ramp_available).toBe(true);
  });

  it("4. Coordinator authorizes assignment with atomic capacity reservation", async () => {
    const assignPayload = {
      requestId: createdCaseId,
      vehicleId: "RES-VEH-05",
      shelterId: "RES-SHL-01",
      responderId: "RES-RSP-01",
      coordinatorName: "Coordinator Tanvir",
    };

    const req = new NextRequest("http://localhost:3000/api/assignments", {
      method: "POST",
      body: JSON.stringify(assignPayload),
    });

    const res = await approveAssignmentPost(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.status).toBe("assigned");
    createdAssignmentId = json.data.id;

    // Verify DB reservation
    const veh = await prisma.resource.findUnique({ where: { id: "RES-VEH-05" } });
    expect(veh?.reservedCapacity).toBeGreaterThanOrEqual(2);

    const shl = await prisma.resource.findUnique({ where: { id: "RES-SHL-01" } });
    expect(shl?.reservedCapacity).toBeGreaterThanOrEqual(2);
  });

  it("5. Rejects duplicate assignment on already assigned request", async () => {
    const duplicatePayload = {
      requestId: createdCaseId,
      vehicleId: "RES-VEH-05",
      shelterId: "RES-SHL-01",
      coordinatorName: "Coordinator Other",
    };

    const req = new NextRequest("http://localhost:3000/api/assignments", {
      method: "POST",
      body: JSON.stringify(duplicatePayload),
    });

    const res = await approveAssignmentPost(req);
    expect(res.status).toBe(409);
  });

  it("6. Responder transitions through lifecycle: accept -> en_route -> arrived -> complete", async () => {
    // A. Accept
    let req = new NextRequest(`http://localhost:3000/api/assignments/${createdAssignmentId}/status`, {
      method: "POST",
      body: JSON.stringify({ action: "accept", responderName: "Team Lead Tanjim" }),
    });
    let res = await updateStatusPost(req, {
      params: Promise.resolve({ id: createdAssignmentId }),
    });
    let json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.assignmentStatus).toBe("accepted");

    // B. En Route
    req = new NextRequest(`http://localhost:3000/api/assignments/${createdAssignmentId}/status`, {
      method: "POST",
      body: JSON.stringify({ action: "en_route", responderName: "Team Lead Tanjim" }),
    });
    res = await updateStatusPost(req, {
      params: Promise.resolve({ id: createdAssignmentId }),
    });
    json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.assignmentStatus).toBe("in_progress");
    expect(json.data.requestStatus).toBe("en_route");

    // C. Arrived
    req = new NextRequest(`http://localhost:3000/api/assignments/${createdAssignmentId}/status`, {
      method: "POST",
      body: JSON.stringify({ action: "arrived", responderName: "Team Lead Tanjim" }),
    });
    res = await updateStatusPost(req, {
      params: Promise.resolve({ id: createdAssignmentId }),
    });
    json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.assignmentStatus).toBe("arrived");

    // D. Complete
    req = new NextRequest(`http://localhost:3000/api/assignments/${createdAssignmentId}/status`, {
      method: "POST",
      body: JSON.stringify({ action: "complete", responderName: "Team Lead Tanjim" }),
    });
    res = await updateStatusPost(req, {
      params: Promise.resolve({ id: createdAssignmentId }),
    });
    json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.assignmentStatus).toBe("completed");
    expect(json.data.requestStatus).toBe("completed");

    // Verify Vehicle reservation freed and Shelter occupancy incremented
    const finalVeh = await prisma.resource.findUnique({ where: { id: "RES-VEH-05" } });
    expect(finalVeh?.reservedCapacity).toBe(0);

    const finalShl = await prisma.resource.findUnique({ where: { id: "RES-SHL-01" } });
    expect(finalShl?.currentOccupancy).toBeGreaterThan(120); // Baseline was 120
  });
});

