import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      requestId,
      vehicleId,
      shelterId,
      responderId,
      coordinatorName = "Coordinator Duty Desk",
      idempotencyKey,
    } = body;

    if (!requestId) {
      return NextResponse.json({ success: false, error: "Request ID is required." }, { status: 400 });
    }

    const caseReq = await prisma.assistanceRequest.findUnique({
      where: { id: requestId },
      include: { assignment: true },
    });

    if (!caseReq) {
      return NextResponse.json({ success: false, error: "Case not found." }, { status: 404 });
    }

    // Idempotency check: if already assigned, return existing assignment cleanly if idempotent retry
    if (caseReq.assignment && ["assigned", "accepted", "in_progress"].includes(caseReq.assignment.status)) {
      if (idempotencyKey && caseReq.assignment.id) {
        return NextResponse.json({
          success: true,
          data: caseReq.assignment,
          idempotent: true,
        });
      }
      return NextResponse.json(
        { success: false, error: "Case already has an active assignment in progress." },
        { status: 409 }
      );
    }

    // Database-enforced atomic transaction for resource reservation and assignment creation
    const assignmentResult = await prisma.$transaction(async (tx) => {
      // 1. Database-Enforced Atomic Reservation for Vehicle
      if (vehicleId) {
        // Enforce capacity headroom atomically in SQL to prevent race conditions
        const vehicleAffected = await tx.$executeRaw`
          UPDATE Resource
          SET reservedCapacity = reservedCapacity + ${caseReq.groupSize}
          WHERE id = ${vehicleId}
            AND isActive = 1
            AND (verificationStatus = 'verified' OR verificationStatus = 'partner_verified')
            AND (totalCapacity - reservedCapacity - currentOccupancy) >= ${caseReq.groupSize}
        `;

        if (vehicleAffected === 0) {
          throw new Error(
            `Vehicle capacity exceeded, unverified, or unavailable for reservation.`
          );
        }
      }

      // 2. Database-Enforced Atomic Reservation for Shelter
      if (shelterId) {
        // Enforce shelter headroom atomically in SQL to prevent oversubscription
        const shelterAffected = await tx.$executeRaw`
          UPDATE Resource
          SET reservedCapacity = reservedCapacity + ${caseReq.groupSize}
          WHERE id = ${shelterId}
            AND isActive = 1
            AND (verificationStatus = 'verified' OR verificationStatus = 'partner_verified')
            AND (totalCapacity - reservedCapacity - currentOccupancy) >= ${caseReq.groupSize}
        `;

        if (shelterAffected === 0) {
          throw new Error(
            `Shelter headroom capacity exceeded, unverified, or unavailable for reservation.`
          );
        }
      }

      // 3. Database-Enforced Atomic Lock for Responder Unit
      if (responderId) {
        const responderAffected = await tx.$executeRaw`
          UPDATE ResponderDetail
          SET currentStatus = 'en_route'
          WHERE resourceId = ${responderId}
            AND currentStatus = 'available'
        `;

        if (responderAffected === 0) {
          throw new Error(`Responder unit ${responderId} is currently committed or unavailable.`);
        }
      }

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const assignmentId = `ASG-2026-${randomSuffix}`;

      // Create Assignment record (enforced unique requestId at database schema level)
      const createdAssignment = await tx.assignment.create({
        data: {
          id: assignmentId,
          requestId: caseReq.id,
          vehicleId: vehicleId || null,
          shelterId: shelterId || null,
          responderId: responderId || null,
          status: "assigned",
          assignedByCoordinator: coordinatorName,
        },
      });

      // Update Case Request Status
      await tx.assistanceRequest.update({
        where: { id: caseReq.id },
        data: { status: "assigned" },
      });

      // Log to Immutable Case Timeline
      await tx.caseTimeline.create({
        data: {
          requestId: caseReq.id,
          eventType: "assigned",
          actorRole: "coordinator",
          actorName: coordinatorName,
          detailsJson: JSON.stringify({
            assignmentId,
            vehicleId,
            shelterId,
            responderId,
            seatsReserved: caseReq.groupSize,
            idempotencyKey: idempotencyKey || null,
          }),
        },
      });

      return createdAssignment;
    });

    return NextResponse.json({
      success: true,
      data: assignmentResult,
    });
  } catch (error) {
    console.error("Assignment dispatch error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
