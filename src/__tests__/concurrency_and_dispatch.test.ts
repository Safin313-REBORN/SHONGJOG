import { describe, it, expect, beforeAll } from "vitest";
import { resetAndSeedDatabase } from "../lib/seed/seed";
import { prisma } from "../lib/prisma";
import { POST as createRequestPost } from "../app/api/requests/route";
import { POST as approveAssignmentPost } from "../app/api/assignments/route";
import { POST as updateStatusPost } from "../app/api/assignments/[id]/status/route";
import { NextRequest } from "next/server";

beforeAll(async () => {
  await resetAndSeedDatabase();
});

describe("Stage 2: Concurrency, Atomic Locks & State Machine Enforcement", () => {
  it("A. Concurrency Test: 5 simultaneous dispatches on limited vehicle capacity", async () => {
    // 1. Create 5 distinct citizen requests with group size 2
    const createdCaseIds: string[] = [];
    for (let i = 0; i < 5; i++) {
      const req = new NextRequest("http://localhost:3000/api/requests", {
        method: "POST",
        body: JSON.stringify({
          rawDescription: "Emergency evacuation assistance needed for wheelchair user and companion",
          approximateLocation: `Kamarkhola Sector Point ${i + 1}`,
          groupSize: 2,
          statedNeeds: ["wheelchair_transport"],
          contactName: `Citizen ${i + 1}`,
          contactPhone: `+880170000000${i}`,
          consentGiven: true,
          latitude: 22.565 + i * 0.002,
          longitude: 89.508 + i * 0.002,
        }),
      });
      const res = await createRequestPost(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      createdCaseIds.push(json.case_reference);
    }

    // Vehicle RES-VEH-01 has totalCapacity = 4. With groupSize = 2, only 2 dispatches should succeed!
    // Simultaneously dispatch all 5 cases targeting RES-VEH-01
    const dispatchPromises = createdCaseIds.map((cId, idx) => {
      const payload = {
        requestId: cId,
        vehicleId: "RES-VEH-01",
        shelterId: "RES-SHL-01",
        coordinatorName: `Coordinator ${idx + 1}`,
      };
      const req = new NextRequest("http://localhost:3000/api/assignments", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return approveAssignmentPost(req).then(async (res) => ({
        status: res.status,
        json: await res.json(),
      }));
    });

    const results = await Promise.all(dispatchPromises);
    const successful = results.filter((r) => r.status === 200 && r.json.success);
    const failed = results.filter((r) => r.status === 400 && !r.json.success);

    // Exactly 3 requests must succeed (3 * 2 = 6 capacity exhausted) and 2 rejected
    expect(successful.length).toBe(3);
    expect(failed.length).toBe(2);

    // Verify vehicle capacity is exactly 6 and never negative or oversubscribed
    const veh = await prisma.resource.findUnique({ where: { id: "RES-VEH-01" } });
    expect(veh?.reservedCapacity).toBe(6);
    const remaining = (veh?.totalCapacity || 0) - (veh?.reservedCapacity || 0) - (veh?.currentOccupancy || 0);
    expect(remaining).toBe(0);
    expect(remaining).toBeGreaterThanOrEqual(0);
  });

  it("B. Idempotency Test: Resending dispatch with idempotencyKey returns existing assignment", async () => {
    // Pick an existing open case
    const req = new NextRequest("http://localhost:3000/api/requests", {
      method: "POST",
      body: JSON.stringify({
        rawDescription: "Idempotency test case",
        approximateLocation: "Chalna High School",
        groupSize: 1,
        statedNeeds: ["step_free_access"],
        contactName: "Idempotent Citizen",
        consentGiven: true,
      }),
    });
    const res = await createRequestPost(req);
    const json = await res.json();
    const caseId = json.case_reference;

    // First dispatch
    const assignPayload = {
      requestId: caseId,
      shelterId: "RES-SHL-02",
      coordinatorName: "Coordinator Idempotency",
      idempotencyKey: "IDEMP-KEY-TEST-12345",
    };
    const assignReq1 = new NextRequest("http://localhost:3000/api/assignments", {
      method: "POST",
      body: JSON.stringify(assignPayload),
    });
    const assignRes1 = await approveAssignmentPost(assignReq1);
    const assignJson1 = await assignRes1.json();
    expect(assignRes1.status).toBe(200);
    expect(assignJson1.success).toBe(true);

    // Repeated dispatch with same idempotencyKey
    const assignReq2 = new NextRequest("http://localhost:3000/api/assignments", {
      method: "POST",
      body: JSON.stringify(assignPayload),
    });
    const assignRes2 = await approveAssignmentPost(assignReq2);
    const assignJson2 = await assignRes2.json();

    expect(assignRes2.status).toBe(200);
    expect(assignJson2.success).toBe(true);
    expect(assignJson2.idempotent).toBe(true);
    expect(assignJson2.data.id).toBe(assignJson1.data.id);
  });

  it("C. State Machine Enforcement: Rejects illegal out-of-order status transitions", async () => {
    // Create new case & assignment
    const req = new NextRequest("http://localhost:3000/api/requests", {
      method: "POST",
      body: JSON.stringify({
        rawDescription: "State machine check case",
        approximateLocation: "Bajua Bazar",
        groupSize: 1,
        consentGiven: true,
      }),
    });
    const res = await createRequestPost(req);
    const json = await res.json();
    const caseId = json.case_reference;

    const assignReq = new NextRequest("http://localhost:3000/api/assignments", {
      method: "POST",
      body: JSON.stringify({
        requestId: caseId,
        shelterId: "RES-SHL-02",
        responderId: "RES-RSP-02",
        coordinatorName: "Duty Coordinator",
      }),
    });
    const assignRes = await approveAssignmentPost(assignReq);
    const assignJson = await assignRes.json();
    const assignmentId = assignJson.data.id;

    // 1. Illegal transition: Cannot jump straight from 'assigned' to 'complete' without accepting or arriving!
    const illegalReq = new NextRequest(`http://localhost:3000/api/assignments/${assignmentId}/status`, {
      method: "POST",
      body: JSON.stringify({ action: "complete", responderName: "Volunteer Unit" }),
    });
    const illegalRes = await updateStatusPost(illegalReq, {
      params: Promise.resolve({ id: assignmentId }),
    });
    const illegalJson = await illegalRes.json();

    expect(illegalRes.status).toBe(400);
    expect(illegalJson.success).toBe(false);
    expect(illegalJson.error).toContain("Illegal state transition");

    // 2. Legal transition: Accept
    const acceptReq = new NextRequest(`http://localhost:3000/api/assignments/${assignmentId}/status`, {
      method: "POST",
      body: JSON.stringify({ action: "accept", responderName: "Volunteer Unit" }),
    });
    const acceptRes = await updateStatusPost(acceptReq, {
      params: Promise.resolve({ id: assignmentId }),
    });
    expect(acceptRes.status).toBe(200);

    // 3. Repeated accept: Idempotent 200 OK
    const repeatAcceptReq = new NextRequest(`http://localhost:3000/api/assignments/${assignmentId}/status`, {
      method: "POST",
      body: JSON.stringify({ action: "accept", responderName: "Volunteer Unit" }),
    });
    const repeatAcceptRes = await updateStatusPost(repeatAcceptReq, {
      params: Promise.resolve({ id: assignmentId }),
    });
    const repeatJson = await repeatAcceptRes.json();
    expect(repeatAcceptRes.status).toBe(200);
    expect(repeatJson.idempotent).toBe(true);
  });

  it("D. Authorization Enforcement: Responder ID mismatch is rejected with 403 Forbidden", async () => {
    // Create new case & assignment assigned to RES-RSP-01
    const req = new NextRequest("http://localhost:3000/api/requests", {
      method: "POST",
      body: JSON.stringify({
        rawDescription: "Authorization check case",
        approximateLocation: "Pankhali",
        groupSize: 1,
        consentGiven: true,
      }),
    });
    const res = await createRequestPost(req);
    const json = await res.json();
    const caseId = json.case_reference;

    const assignReq = new NextRequest("http://localhost:3000/api/assignments", {
      method: "POST",
      body: JSON.stringify({
        requestId: caseId,
        shelterId: "RES-SHL-01",
        responderId: "RES-RSP-01",
        coordinatorName: "Duty Coordinator",
      }),
    });
    const assignRes = await approveAssignmentPost(assignReq);
    const assignJson = await assignRes.json();
    const assignmentId = assignJson.data.id;

    // Attempt action with mismatched responderId: RES-RSP-02
    const unauthReq = new NextRequest(`http://localhost:3000/api/assignments/${assignmentId}/status`, {
      method: "POST",
      body: JSON.stringify({
        action: "accept",
        responderId: "RES-RSP-02", // Mismatched responder!
        responderName: "Impostor Responder",
      }),
    });
    const unauthRes = await updateStatusPost(unauthReq, {
      params: Promise.resolve({ id: assignmentId }),
    });
    const unauthJson = await unauthRes.json();

    expect(unauthRes.status).toBe(403);
    expect(unauthJson.success).toBe(false);
    expect(unauthJson.error).toContain("Unauthorized");
  });
});
